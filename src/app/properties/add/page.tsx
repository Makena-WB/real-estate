import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import PropertyForm from "@/components/PropertyForm"
import { Plus, Shield } from "lucide-react"

export default async function AddPropertyPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || !["AGENT", "LANDLORD"].includes(session.user.role)) {
    redirect("/") // or show a 403 page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg mb-6 border border-slate-500/30">
            <Plus className="w-10 h-10 text-slate-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 tracking-tight">Add New Property</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Create a stunning property listing with rich descriptions and beautiful imagery
          </p>

          {/* User Role Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-slate-700/50 backdrop-blur-sm rounded-full border border-slate-600/30">
            <Shield className="w-4 h-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-200 capitalize">
              {session.user.role?.toLowerCase()} Access
            </span>
          </div>
        </div>

        {/* Property Form */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-slate-600/20 rounded-3xl blur-3xl -z-10"></div>

          <PropertyForm />
        </div>
      </div>
    </div>
  )
}
