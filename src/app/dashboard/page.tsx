import { requireAuth } from "@/lib/auth-redirect";
import LogoutButton from "@/components/ui/logout-button";

export default async function Dashboard() {
  const session = await requireAuth();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {session?.user?.name ?? session?.user?.email ?? "Guest"}
      </h1>
      <LogoutButton />
    </div>
  );
}
