import { requireAuth } from "@/lib/auth-redirect"
import { User, Mail, Lock, Settings, Shield, Edit3, Calendar, MapPin } from "lucide-react"

export default async function SettingsPage() {
  const session = await requireAuth()
  const role = session?.user?.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg mb-4 sm:mb-6 border border-slate-500/30">
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-3 sm:mb-4">
            Account Settings
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Settings Panel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Profile Information</h2>
                  <p className="text-slate-400 text-sm">Update your account details</p>
                </div>
              </div>

              <form className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400 group-focus-within:text-slate-300 transition-colors duration-200" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={session?.user?.name ?? ""}
                      className="w-full h-12 pl-12 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-slate-300 transition-colors duration-200" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={session?.user?.email ?? ""}
                      className="w-full h-12 pl-12 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-slate-300 transition-colors duration-200" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value="••••••••••••"
                      className="w-full h-12 pl-12 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Role Display */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Account Type</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                    <Shield className="w-5 h-5 text-slate-300" />
                    <div>
                      <div className="text-slate-200 font-semibold capitalize">
                        {role === "USER" ? "Renter" : role?.toLowerCase() || "Member"}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {role === "USER" && "Browse and apply for properties"}
                        {role === "LANDLORD" && "List and manage properties"}
                        {role === "AGENT" && "Manage properties for clients"}
                        {!role && "Standard account access"}
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button className="group relative overflow-hidden px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Lock className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="relative z-10">Change Password</span>
                </button>
                <button className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30 flex items-center justify-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <Edit3 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="relative z-10">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center border border-slate-500/30">
                  <User className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{session?.user?.name || "User"}</h3>
                  <p className="text-slate-400 text-sm capitalize">
                    {role === "USER" ? "Renter" : role?.toLowerCase() || "Member"}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{session?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Member since 2024</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Location not set</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <h3 className="font-bold text-slate-100 mb-4">Account Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Profile Views</span>
                  <span className="font-semibold text-slate-100">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">
                    {role === "USER" ? "Applications Sent" : "Properties Listed"}
                  </span>
                  <span className="font-semibold text-slate-100">{role === "USER" ? "3" : "12"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Favorites</span>
                  <span className="font-semibold text-slate-100">8</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-slate-100">Security</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your account is secured with industry-standard encryption. Last login was today.
              </p>
              <button className="mt-4 text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200">
                View Security Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
