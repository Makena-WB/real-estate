import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-redirect";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAuth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!role || !["AGENT", "LANDLORD"].includes(role)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const myListings = await prisma.listing.findMany({
    where: {
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
    include: {
      _count: {
        select: {
          favorites: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ listings: myListings });
}