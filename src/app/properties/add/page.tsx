import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";

export default async function AddPropertyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || !["AGENT", "LANDLORD"].includes(session.user.role)) {
    redirect("/"); // or show a 403 page
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      <PropertyForm />
    </div>
  );
}