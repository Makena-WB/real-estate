import { requireAuth } from "@/lib/auth-redirect"
import { prisma } from "@/lib/prisma"
import { FileText, Home, MapPin, Calendar, CheckCircle, Clock, Eye, Send, DollarSign, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"

export default async function ApplicationsPage() {
  const session = await requireAuth()
  const userId = session?.user?.id

  // Fetch applications for the logged-in user
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)

  const truncateMessage = (message: string, maxLength = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  // Calculate stats
  const pendingApplications = applications.filter((app) => app.status === "PENDING" || typeof app.status === "undefined").length
  const approvedApplications = applications.filter((app) => app.status === "APPROVED").length
  const rejectedApplications = applications.filter((app) => app.status === "REJECTED").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-100">
              My Applications
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Track your property applications and stay updated on their status
            </p>

            {/* Stats Overview */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{applications.length}</div>
                <div className="text-sm sm:text-base">Total Applications</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{pendingApplications}</div>
                <div className="text-sm sm:text-base">Pending</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">{approvedApplications}</div>
                <div className="text-sm sm:text-base">Approved</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400">{rejectedApplications}</div>
                <div className="text-sm sm:text-base">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Content */}
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-6">
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {applications.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-4">No Applications Yet</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Start browsing properties and submit your first application to see them here
            </p>
            <Link href="/properties">
              <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-500/30 flex items-center gap-3 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative z-10">Browse Properties</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50"
              >
                {/* Property Image */}
                <div className="relative overflow-hidden">
                  {app.listing?.images && app.listing.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={
                          Array.isArray(app.listing.images)
                            ? app.listing.images[0]
                            : typeof app.listing.images === "string"
                              ? (app.listing.images as string).split(",")[0]
                              : ""
                        }
                        alt={app.listing.title || "Property"}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div
                          className={`px-3 py-1 rounded-full shadow-lg backdrop-blur-sm text-xs font-semibold ${
                            app.status === "APPROVED"
                              ? "bg-green-500/90 text-white"
                              : app.status === "REJECTED"
                                ? "bg-red-500/90 text-white"
                                : "bg-yellow-500/90 text-white"
                          }`}
                        >
                          {app.status === "APPROVED" ? "Approved" : app.status === "REJECTED" ? "Rejected" : "Pending"}
                        </div>
                      </div>

                      {/* Application Type Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-slate-600/30">
                          <span className="text-slate-200 text-xs font-semibold capitalize">{app.type}</span>
                        </div>
                      </div>

                      {/* Price Badge */}
                      {app.listing?.price && (
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-slate-600/30">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-slate-300" />
                              <span className="font-bold text-slate-100 text-lg">{formatPrice(app.listing.price)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button Overlay */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Link href={`/properties/${app.listing?.id}`}>
                          <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                            <Eye className="w-4 h-4 text-slate-300" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative">
                      <Home className="w-16 h-16 text-slate-400" />
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div
                          className={`px-3 py-1 rounded-full shadow-lg backdrop-blur-sm text-xs font-semibold ${
                            app.status === "APPROVED"
                              ? "bg-green-500/90 text-white"
                              : app.status === "REJECTED"
                                ? "bg-red-500/90 text-white"
                                : "bg-yellow-500/90 text-white"
                          }`}
                        >
                          {app.status === "APPROVED" ? "Approved" : app.status === "REJECTED" ? "Rejected" : "Pending"}
                        </div>
                      </div>
                      {/* Application Type Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-slate-600/30">
                          <span className="text-slate-200 text-xs font-semibold capitalize">{app.type}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-slate-50 transition-colors duration-200 mb-2">
                      {app.listing?.title || "Property Application"}
                    </h2>
                    {app.listing?.location && (
                      <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                        <MapPin className="w-4 h-4" />
                        {app.listing.location}
                      </div>
                    )}
                  </div>

                  {/* Application Message */}
                  <div className="mb-4 p-4 bg-slate-700/30 rounded-2xl border border-slate-600/20">
                    <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-2">
                      <Send className="w-3 h-3" />
                      Your Message
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {truncateMessage(app.message)}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="mb-4 p-3 bg-slate-700/20 rounded-xl border border-slate-600/10">
                    <div className="flex items-center gap-3">
                      {app.status === "APPROVED" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : app.status === "REJECTED" ? (
                        <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✕</span>
                        </div>
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-200">
                          {app.status === "APPROVED"
                            ? "Application Approved"
                            : app.status === "REJECTED"
                              ? "Application Rejected"
                              : "Application Pending"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {app.status === "APPROVED"
                            ? "Congratulations! Your application was accepted."
                            : app.status === "REJECTED"
                              ? "Unfortunately, your application was not accepted."
                              : "Your application is being reviewed."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/20 px-3 py-2 rounded-xl border border-slate-600/10 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <Link href={`/properties/${app.listing?.id}`} className="block">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30 flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Property
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {applications.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/properties">
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <Home className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold mb-1">Browse Properties</div>
                  <div className="text-slate-400 text-sm">Find more properties</div>
                </button>
              </Link>
              <Link href="/favorites">
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <Heart className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold mb-1">View Favorites</div>
                  <div className="text-slate-400 text-sm">Saved properties</div>
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <CheckCircle className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold mb-1">Dashboard</div>
                  <div className="text-slate-400 text-sm">Overview & stats</div>
                </button>
              </Link>
              <Link href="/dashboard/settings">
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <Calendar className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold mb-1">Settings</div>
                  <div className="text-slate-400 text-sm">Account preferences</div>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
