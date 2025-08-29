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
  const listingId = formData.get("listingId") as string;
  const images = formData.getAll("images") as File[];

  // Upload images to Cloudinary
  const uploadedUrls: string[] = [];
  for (const file of images) {
    const url = await uploadToCloudinary(file);
    uploadedUrls.push(url);
  }

  // Save URLs to DB
  await prisma.listing.update({
    where: { id: listingId },
    data: {
      images: { push: uploadedUrls }, // Prisma: images is a string[]
    },
  });

  return NextResponse.json({ success: true, urls: uploadedUrls });
}

// DELETE: Remove image
export async function DELETE(req: Request) {
  const { listingId, imgUrl } = await req.json();

  // Remove image URL from listing
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  const newImages = (listing?.images || []).filter((url: string) => url !== imgUrl);

  await prisma.listing.update({
    where: { id: listingId },
    data: { images: newImages },
  });

  // TODO: Optionally delete image from storage

  return NextResponse.json({ success: true });
}