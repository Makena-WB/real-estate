import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-redirect";

export async function GET() {
  const properties = await prisma.listing.findMany({
    include: { agent: true, reviews: true },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (
    !session?.user?.role ||
    !["AGENT", "LANDLORD"].includes(session.user.role) ||
    !session.user.id
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const data = await request.json();

  if (!data.ownerId) {
    return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
  }

  // Convert images to array if it's a string
  let images = data.images;
  if (typeof images === "string") {
    images = images
      .split(",")
      .map((img: string) => img.trim())
      .filter((img: string) => img.length > 0);
  }

  const property = await prisma.listing.create({
    data: {
      ...data,
      images, // now an array
      agentId: session.user.id,
      ownerId: data.ownerId,
    },
  });
  return NextResponse.json(property, { status: 201 });
}