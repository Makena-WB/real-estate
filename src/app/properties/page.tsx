import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, DollarSign, User, Star, Home, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { FavoriteButton } from "@/components/FavoriteButton"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PropertiesPage() {
  type ListingWithRelations = {
    id: string
    title: string
    description: string
    location: string
    price: number
    images: string[] | string
    agent?: { name?: string | null; email?: string | null } | null
    owner?: { name?: string | null; email?: string | null } | null
    reviews: any[]
  }

  const session = await getServerSession(authOptions);
  let userFavoriteIds: string[] = [];

  if (session?.user?.id) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { listingId: true },
    });
    userFavoriteIds = favorites.map(fav => fav.listingId);
  }

  const listings: ListingWithRelations[] = await prisma.listing.findMany({
    include: {
      agent: { select: { name: true, email: true } },
      owner: { select: { name: true, email: true } },
      reviews: true,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Home className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Available Properties</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover your perfect home from our curated collection of premium properties
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold">{listings.length}</div>
                <div className="text-sm">Properties</div>
              </div>
              <div className="w-px h-12 bg-blue-300/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {listings.reduce((sum, listing) => sum + listing.reviews.length, 0)}
                </div>
                <div className="text-sm">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <Home className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">No Properties Available</h3>
            <p className="text-blue-600 text-lg">Check back soon for new listings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden rounded-3xl"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={Array.isArray(listing.images) ? listing.images[0] : listing.images.split(",")[0]}
                        alt={listing.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <FavoriteButton
                          listingId={listing.id}
                          isFavorited={userFavoriteIds.includes(listing.id)}
                        />
                        <Link href={`/properties/${listing.id}`}>
                          <button
                            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                        </Link>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-blue-800 text-lg">{formatPrice(listing.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Home className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-blue-800 line-clamp-2 group-hover:text-blue-900 transition-colors duration-200">
                    {listing.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-blue-700 leading-relaxed line-clamp-3">
                    {truncateDescription(listing.description)}
                  </p>

                  {/* Agent & Owner Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-2xl">
                      <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 font-medium">Agent</div>
                        <div className="text-sm text-blue-800 font-semibold">
                          {listing.agent?.name || listing.agent?.email || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50/80 rounded-2xl">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                        <Home className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-green-600 font-medium">Landlord</div>
                        <div className="text-sm text-green-800 font-semibold">
                          {listing.owner?.name || listing.owner?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-blue-100/50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-blue-700">
                        {listing.reviews.length} {listing.reviews.length === 1 ? "Review" : "Reviews"}
                      </span>
                    </div>
                    <Link href={`/properties/${listing.id}`}>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg">
                        View Details
                      </button>
                    </Link>
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
