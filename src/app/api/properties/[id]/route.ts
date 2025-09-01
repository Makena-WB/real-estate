import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-redirect";

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  // Increment views (legacy counter)
  await prisma.listing.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });
  // Create a PropertyView record for analytics
  await prisma.propertyView.create({
    data: {
      listingId: params.id,
      // Optionally, add userId if you have user info (e.g., from session)
    },
  });
  // Fetch property with updated views
  const property = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { agent: true, owner: true, reviews: true },
  });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "User ID missing from session" }, { status: 400 });
  }
  const property = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Allow update if user is agent or owner
  const isAgent = property.agentId && property.agentId === session.user.id;
  const isOwner = property.ownerId === session.user.id;
  if (
    !session?.user?.role ||
    !["AGENT", "LANDLORD"].includes(session.user.role) ||
    (!isAgent && !isOwner)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await request.json();

  // Only allow updatable fields and only set if present
  const allowedFields = [
    "title",
    "price",
    "location",
    "description",
    "bedrooms",
    "bathrooms",
    "location",
    "propertyType",
    "status",
    "images"
  ];
  const updateData: Record<string, any> = {};
  for (const field of allowedFields) {
    if (field in data) {
      // Ensure images is always an array if provided
      if (field === "images" && data.images && !Array.isArray(data.images)) {
        updateData.images = [data.images];
      } else {
        updateData[field] = data[field];
      }
    }
  }
  // Remove any undefined fields (Prisma will error if undefined is passed)
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // Handle amenities: expects amenities to be an array of amenity names
  let amenitiesToSet: string[] = [];
  if (Array.isArray(data.amenities)) {
    amenitiesToSet = data.amenities;
  }

  try {
    // Update the listing itself
    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update amenities (remove all, then add new)
    if (Array.isArray(amenitiesToSet)) {
      // Find or create amenities
      const amenityRecords = await Promise.all(
        amenitiesToSet.map(async (name) => {
          return prisma.amenity.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        })
      );
      // Remove existing amenities for this listing
      await prisma.listingAmenity.deleteMany({ where: { listingId: params.id } });
      // Add new amenities
      await prisma.listingAmenity.createMany({
        data: amenityRecords.map((a) => ({ listingId: params.id, amenityId: a.id })),
        skipDuplicates: true,
      });
    }

    // Return updated listing with amenities
    const propertyWithAmenities = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        agent: true,
        owner: true,
        reviews: true,
        amenities: { include: { amenity: true } },
      },
    });
    return NextResponse.json(propertyWithAmenities);
  } catch (error: any) {
    console.error("PUT /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "User ID missing from session" }, { status: 400 });
  }
  const property = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Allow delete if user is agent or owner
  const isAgent = property.agentId && property.agentId === session.user.id;
  const isOwner = property.ownerId === session.user.id;
  if (
    !session?.user?.role ||
    !["AGENT", "LANDLORD"].includes(session.user.role) ||
    (!isAgent && !isOwner)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}