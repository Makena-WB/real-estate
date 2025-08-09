import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
    try {
  const { name, email, password, role } = await request.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role, //Save the selected role
    },
  });

  return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
} catch (error) {
  return NextResponse.json({ error: "Something went wrong. Internal server error" }, { status: 500 });
}
}