import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-redirect";

export async function POST(request: Request) {
  const session = await requireAuth();
  const { listingId } = await request.json();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      listingId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await requireAuth();
  const { listingId } = await request.json();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      listingId,
    },
  });

  return NextResponse.json({ success: true });
}