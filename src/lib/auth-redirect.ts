import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth(redirectTo: string = "/auth/login") {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(redirectTo);
    // No need to return after redirect; this line will never be reached
  }
  return session;
}