import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// Helper to upload a single file buffer to Cloudinary

async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}

// POST: Add images
export async function POST(req: Request) {
  const formData = await req.formData();
  const propertyId = formData.get("propertyId") as string;
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }
  const images = formData.getAll("images").filter((f) => f instanceof File) as File[];
  if (!images.length) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  // Upload images to Cloudinary
  const uploadedUrls: string[] = [];
  for (const file of images) {
    try {
      const url = await uploadToCloudinary(file);
      uploadedUrls.push(url);
    } catch (err: any) {
      return NextResponse.json({ error: "Cloudinary upload failed", details: err?.message || err }, { status: 500 });
    }
  }

  // Save URLs to DB
  try {
    await prisma.listing.update({
      where: { id: propertyId },
      data: {
        images: { push: uploadedUrls }, // Prisma: images is a string[]
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update listing images", details: err?.message || err }, { status: 500 });
  }

  return NextResponse.json({ success: true, urls: uploadedUrls });
}

// DELETE: Remove image
export async function DELETE(req: Request) {
  const { propertyId, imageUrl } = await req.json();
  if (!propertyId || !imageUrl) {
    return NextResponse.json({ error: "Missing propertyId or imageUrl" }, { status: 400 });
  }

  // Remove image URL from listing
  try {
    const listing = await prisma.listing.findUnique({ where: { id: propertyId } });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    const newImages = (listing.images || []).filter((url: string) => url !== imageUrl);
    await prisma.listing.update({
      where: { id: propertyId },
      data: { images: newImages },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to remove image", details: err?.message || err }, { status: 500 });
  }

  // TODO: Optionally delete image from storage

  return NextResponse.json({ success: true });
}