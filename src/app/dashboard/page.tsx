import { requireAuth } from "@/lib/auth-redirect"
import LogoutButton from "@/components/ui/logout-button"
import { User, Home, Heart, Settings, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const session = await requireAuth()
  const role = session?.user?.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg mb-4 sm:mb-6 border border-slate-500/30">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-3 sm:mb-4 px-4">
            Welcome back, {session?.user?.name ?? session?.user?.email ?? "Guest"}!
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
            {role === "USER"
              ? "Browse listings, manage your favorites, view your applications, and update your account settings."
              : "Manage your properties, track favorites, and explore new opportunities."}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {/* Listings Card - visible to all */}
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden rounded-2xl sm:rounded-3xl hover:border-slate-500/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">Listings</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Browse available properties</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm sm:text-base">Total Listings</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-100">12</span>
              </div>
              <button className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30 text-sm sm:text-base">
                View Listings
              </button>
            </div>
          </div>

          {/* Favorites Card - visible to all */}
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden rounded-2xl sm:rounded-3xl hover:border-slate-500/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">Favorites</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Saved properties</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm sm:text-base">Saved Properties</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-100">8</span>
              </div>
              <button className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30 text-sm sm:text-base">
                View Favorites
              </button>
            </div>
          </div>

          {/* Applications Card - only for renters */}
          {role === "USER" && (
            <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden rounded-2xl sm:rounded-3xl hover:border-slate-500/50 p-6 sm:p-8 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">Applications</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">Sent to agents</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm sm:text-base">Applications Sent</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-100">2</span>
                </div>
                <button className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30 text-sm sm:text-base">
                  View Applications
                </button>
              </div>
            </div>
          )}

          {/* Properties & Analytics Cards - only for agents/landlords */}
          {role && ["AGENT", "LANDLORD"].includes(role) && (
            <>
              {/* My Properties Card */}
              <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden rounded-2xl sm:rounded-3xl hover:border-slate-500/50 p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">My Properties</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">Manage your listings</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm sm:text-base">Active Listings</span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-100">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm sm:text-base">Total Views</span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-100">1,247</span>
                  </div>
                  <button className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30 text-sm sm:text-base">
                    View Properties
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Renters: Only show relevant actions */}
            {role === "USER" && (
              <>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Browse Properties</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Find your dream home</div>
                </button>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">View Favorites</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Saved properties</div>
                </button>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Applications</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Sent to agents</div>
                </button>
                <Link href="/dashboard/settings" passHref legacyBehavior>
                  <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group xs:col-span-2 lg:col-span-1 w-full text-left flex flex-col items-center">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-slate-200 font-semibold text-sm sm:text-base">Settings</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Manage account</div>
                  </button>
                </Link>
              </>
            )}
            {/* Agents/Landlords: Only show relevant actions */}
            {role && ["AGENT", "LANDLORD"].includes(role) && (
              <>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Add Property</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Create new listing</div>
                </button>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Manage Listings</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Edit or remove properties</div>
                </button>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Applications</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Review received applications</div>
                </button>
                <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold text-sm sm:text-base">Analytics</div>
                  <div className="text-slate-400 text-xs sm:text-sm">View performance reports</div>
                </button>
                <Link href="/dashboard/settings" passHref legacyBehavior>
                  <button className="p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-lg group w-full text-left flex flex-col items-center">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-slate-200 font-semibold text-sm sm:text-base">Settings</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Manage account</div>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center border border-slate-500/30 flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-slate-200" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  {session?.user?.name ?? "User"}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base truncate">{session?.user?.email}</p>
                <p className="text-slate-400 text-xs sm:text-sm">Member since 2024</p>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 text-slate-200 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg text-sm sm:text-base">
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
