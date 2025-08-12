import { requireAuth } from "@/lib/auth-redirect"
import LogoutButton from "@/components/ui/logout-button"
import { User, Home, Heart, Settings, BarChart3 } from "lucide-react"

export default async function Dashboard() {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg mb-6 border border-slate-500/30">
            <User className="w-10 h-10 text-slate-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Welcome back, {session?.user?.name ?? session?.user?.email ?? "Guest"}!
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Manage your properties, track favorites, and explore new opportunities
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Properties Card */}
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">My Properties</h3>
                <p className="text-slate-400 text-sm">Manage your listings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Active Listings</span>
                <span className="text-2xl font-bold text-slate-100">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Views</span>
                <span className="text-2xl font-bold text-slate-100">1,247</span>
              </div>
              <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                View Properties
              </button>
            </div>
          </div>

          {/* Favorites Card */}
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Favorites</h3>
                <p className="text-slate-400 text-sm">Saved properties</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Saved Properties</span>
                <span className="text-2xl font-bold text-slate-100">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">New This Week</span>
                <span className="text-2xl font-bold text-slate-100">3</span>
              </div>
              <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                View Favorites
              </button>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Analytics</h3>
                <p className="text-slate-400 text-sm">Performance insights</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">This Month</span>
                <span className="text-2xl font-bold text-green-400">+24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Inquiries</span>
                <span className="text-2xl font-bold text-slate-100">47</span>
              </div>
              <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-2xl transition-all duration-200 hover:shadow-lg group">
              <Home className="w-8 h-8 text-slate-300 mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
              <div className="text-slate-200 font-semibold">Add Property</div>
              <div className="text-slate-400 text-sm">Create new listing</div>
            </button>

            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-2xl transition-all duration-200 hover:shadow-lg group">
              <Heart className="w-8 h-8 text-slate-300 mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
              <div className="text-slate-200 font-semibold">Browse Properties</div>
              <div className="text-slate-400 text-sm">Find your dream home</div>
            </button>

            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-2xl transition-all duration-200 hover:shadow-lg group">
              <BarChart3 className="w-8 h-8 text-slate-300 mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
              <div className="text-slate-200 font-semibold">View Reports</div>
              <div className="text-slate-400 text-sm">Track performance</div>
            </button>

            <button className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-2xl transition-all duration-200 hover:shadow-lg group">
              <Settings className="w-8 h-8 text-slate-300 mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
              <div className="text-slate-200 font-semibold">Settings</div>
              <div className="text-slate-400 text-sm">Manage account</div>
            </button>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center border border-slate-500/30">
                <User className="w-8 h-8 text-slate-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{session?.user?.name ?? "User"}</h3>
                <p className="text-slate-300">{session?.user?.email}</p>
                <p className="text-slate-400 text-sm">Member since 2024</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 text-slate-200 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                Edit Profile
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
