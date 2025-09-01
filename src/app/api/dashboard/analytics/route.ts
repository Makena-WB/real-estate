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

  // Recent activity: today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Views: count of PropertyView records created today
  const viewsToday = await prisma.propertyView.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  // Favorites: count of favorites created today
  const favoritesToday = await prisma.favorite.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  // Reviews: count of reviews created today
  const reviewsToday = await prisma.review.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  return NextResponse.json({
    totalListings,
    totalViews,
    totalFavorites,
    totalReviews,
    averagePrice,
    recentActivity: [
      { date: "Today", views: viewsToday, favorites: favoritesToday, reviews: reviewsToday },
      // You can add more periods (week, month) if needed
    ],
  });
}