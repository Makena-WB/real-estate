import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Heart, MapPin, DollarSign, User, Home, Eye, Trash2, Star } from "lucide-react"

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg mb-6">
            <Heart className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Access Required</h2>
          <p className="text-slate-300 text-lg mb-8">Please log in to view your favorite properties</p>
          <Link href="/auth/login">
            <button className="px-8 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        include: {
          agent: true,
          owner: true,
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

  const truncateDescription = (description: string, maxLength = 120) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <Heart className="w-10 h-10 text-slate-300 fill-current" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-100">
              My Favorite Properties
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your curated collection of dream homes and investment opportunities
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-200">{favorites.length}</div>
                <div className="text-sm">Saved Properties</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-200">
                  {favorites.reduce((sum, fav) => sum + (fav.listing.reviews?.length || 0), 0)}
                </div>
                <div className="text-sm">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-6">
              <Heart className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">No Favorites Yet</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites to see them here
            </p>
            <Link href="/properties">
              <button className="px-8 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl">
                Browse Properties
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {favorites.map((fav) => (
              <Card
                key={fav.id}
                className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl hover:border-slate-500/50"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {fav.listing.images && fav.listing.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={
                          Array.isArray(fav.listing.images)
                            ? fav.listing.images[0]
                            : typeof fav.listing.images === "string"
                              ? (fav.listing.images as string).split(",")[0]
                              : ""
                        }
                        alt={fav.listing.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                          <Heart className="w-4 h-4 text-red-400 fill-current" />
                        </button>
                        <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                          <Eye className="w-4 h-4 text-slate-300" />
                        </button>
                        <button className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-200 border border-slate-600/30">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-slate-600/30">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-300" />
                            <span className="font-bold text-slate-100 text-lg">{formatPrice(fav.listing.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-white fill-current" />
                            <span className="text-white text-xs font-semibold">Favorite</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative">
                      <Home className="w-16 h-16 text-slate-400" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-white fill-current" />
                            <span className="text-white text-xs font-semibold">Favorite</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-slate-50 transition-colors duration-200">
                    {fav.listing.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <MapPin className="w-4 h-4" />
                    {fav.listing.location}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-300 leading-relaxed line-clamp-3">
                    {truncateDescription(fav.listing.description)}
                  </p>

                  {/* Agent & Owner Info */}
                  <div className="space-y-3">
                    {fav.listing.agent && (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-2xl border border-slate-600/30">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-medium">Agent</div>
                          <div className="text-sm text-slate-200 font-semibold">
                            {fav.listing.agent.name || fav.listing.agent.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}

                    {fav.listing.owner && (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-2xl border border-slate-600/30">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <Home className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-medium">Landlord</div>
                          <div className="text-sm text-slate-200 font-semibold">
                            {fav.listing.owner.name || fav.listing.owner.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date Added */}
                  <div className="text-xs text-slate-400 bg-slate-700/30 px-3 py-2 rounded-xl border border-slate-600/20">
                    Added to favorites on {new Date(fav.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-600/30">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-slate-300">
                        {fav.listing.reviews?.length || 0}{" "}
                        {(fav.listing.reviews?.length || 0) === 1 ? "Review" : "Reviews"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/30 transition-all duration-200 border border-red-500/30">
                        Remove
                      </button>
                      <Link href={`/properties/${fav.listing.id}`}>
                        <button className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
