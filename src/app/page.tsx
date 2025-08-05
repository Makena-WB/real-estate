import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return <div>Welcome {session.user?.email}</div>;
}
