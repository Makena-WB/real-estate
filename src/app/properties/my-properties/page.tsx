import { requireAuth } from "@/lib/auth-redirect"
import { prisma } from "@/lib/prisma"
import { Home, Edit3, Plus, MapPin, DollarSign, Calendar, Eye, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export default async function MyPropertiesPage() {
  const session = await requireAuth()
  const userId = session?.user?.id
  const role = session?.user?.role

  // Fetch properties where the user is either owner or agent
  const myListings = await prisma.listing.findMany({
    where: {
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
    include: {
      reviews: true,
      _count: {
        select: {
          favorites: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const truncateDescription = (description: string, maxLength = 100) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + "..."
  }

  const totalViews = myListings.reduce((sum, listing) => sum + (listing.views || 0), 0)
  const totalFavorites = myListings.reduce((sum, listing) => sum + (listing._count?.favorites || 0), 0)
  const totalReviews = myListings.reduce((sum, listing) => sum + (listing._count?.reviews || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <Home className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-100">
              My Properties
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Manage your property portfolio with comprehensive analytics and easy editing tools
            </p>

            {/* Stats Overview */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{myListings.length}</div>
                <div className="text-sm sm:text-base">Properties</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{totalViews}</div>
                <div className="text-sm sm:text-base">Total Views</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{totalFavorites}</div>
                <div className="text-sm sm:text-base">Favorites</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{totalReviews}</div>
                <div className="text-sm sm:text-base">Reviews</div>
              </div>
            </div>

            {/* Add Property Button */}
            <div className="mt-8">
              <Link href="/properties/add">
                <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-500/30 flex items-center gap-3 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <Plus className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="relative z-10">Add New Property</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-6">
        {myListings.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-6">
              <Home className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-4">No Properties Yet</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Start building your property portfolio by adding your first listing
            </p>
            <Link href="/properties/add">
              <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-500/30 flex items-center gap-3 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <Plus className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative z-10">Add Your First Property</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={Array.isArray(listing.images) ? listing.images[0] : (typeof listing.images === "string" ? (listing.images as string).split(",")[0] : "")}
                        alt={listing.title}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                          <Eye className="w-4 h-4 text-slate-300" />
                        </button>
                        <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                          <BarChart3 className="w-4 h-4 text-slate-300" />
                        </button>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-slate-600/30">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-300" />
                            <span className="font-bold text-slate-100 text-lg">{formatPrice(listing.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <span className="text-white text-xs font-semibold">Active</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative">
                      <Home className="w-16 h-16 text-slate-400" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <span className="text-white text-xs font-semibold">Active</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-slate-600/30">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-300" />
                            <span className="font-bold text-slate-100 text-lg">{formatPrice(listing.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-slate-50 transition-colors duration-200 mb-2">
                      {listing.title}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                    </div>
                    <p className="text-slate-300 leading-relaxed line-clamp-3 text-sm">
                      {truncateDescription(listing.description)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-700/30 rounded-2xl border border-slate-600/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-100">{listing.views || 0}</div>
                      <div className="text-xs text-slate-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-100">{listing._count?.favorites || 0}</div>
                      <div className="text-xs text-slate-400">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-100">{listing._count?.reviews || 0}</div>
                      <div className="text-xs text-slate-400">Reviews</div>
                    </div>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/20 px-3 py-2 rounded-xl border border-slate-600/10 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link href={`/properties/${listing.id}`} className="flex-1">
                      <button className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Link>
                    <Link href={`/properties/${listing.id}/edit`} className="flex-1">
                      <button className="w-full px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30 flex items-center justify-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {myListings.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/properties/add">
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <Plus className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-slate-200 font-semibold mb-1">Add Property</div>
                  <div className="text-slate-400 text-sm">Create new listing</div>
                </button>
              </Link>
              <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                <BarChart3 className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-slate-200 font-semibold mb-1">Analytics</div>
                <div className="text-slate-400 text-sm">View performance</div>
              </button>
              <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                <Settings className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-slate-200 font-semibold mb-1">Bulk Edit</div>
                <div className="text-slate-400 text-sm">Manage multiple</div>
              </button>
              <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                <Eye className="w-6 h-6 text-slate-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-slate-200 font-semibold mb-1">Preview</div>
                <div className="text-slate-400 text-sm">See public view</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
