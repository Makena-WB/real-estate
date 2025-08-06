import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-redirect";

export default async function Dashboard() {
  const session = await requireAuth();

  return <div>Welcome {session.user?.email}</div>;
}
