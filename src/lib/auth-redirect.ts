import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth(redirectTo: string = "/auth/login") {
  // Only allow internal redirects
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    redirectTo = "/auth/login";
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}