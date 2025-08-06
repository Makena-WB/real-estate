import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth () {
   const session = await getServerSession(authOptions);
   if (!session) {
       redirect("/auth/login");
       return session;
   }
   return null;
}