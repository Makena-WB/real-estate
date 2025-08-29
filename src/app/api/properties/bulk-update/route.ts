import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Bulk update listings
export async function PUT(req: Request) {
  const updates = await req.json(); // [{ id, title, price, ... }, ...]
  const results = [];

  for (const update of updates) {
    const { id, ...fields } = update;
    const result = await prisma.listing.update({
      where: { id },
      data: fields,
    });
    results.push(result);
  }

  return NextResponse.json({ success: true, results });
}