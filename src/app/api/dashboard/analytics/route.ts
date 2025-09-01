import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const listings = await prisma.listing.findMany({
    include: {
      reviews: true,
      favorites: true,
    },
  });

  const totalListings = listings.length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
  const totalFavorites = listings.reduce((sum, l) => sum + (l.favorites?.length || 0), 0);
  const totalReviews = listings.reduce((sum, l) => sum + (l.reviews?.length || 0), 0);
  const averagePrice =
    totalListings > 0
      ? Math.round(listings.reduce((sum, l) => sum + (l.price || 0), 0) / totalListings)
      : 0;

  return NextResponse.json({
    totalListings,
    totalViews,
    totalFavorites,
    totalReviews,
    averagePrice,
  });
}