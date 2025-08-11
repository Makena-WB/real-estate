import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  let where = {};
  if (role) {
    where = { role };
  }

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(users);
}