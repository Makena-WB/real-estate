import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-redirect";

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const property = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { agent: true, owner: true, reviews: true },
  });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
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
  const updated = await prisma.listing.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updated);
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