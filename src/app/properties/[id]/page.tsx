import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
  Star,
  MapPin,
  DollarSign,
  User,
  Home,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Shield,
  Wifi,
  Car,
  Waves,
  Camera,
  Send,
  Phone,
  Mail,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default async function PropertyDetailPage(context: { params: { id: string } }) {
  const { params } = await context
  type PropertyType = {
    id: string
    title: string
    description: string
    location: string
    price: number
    images: string | string[]
    createdAt: Date
    views?: number
    agent?: { name?: string | null; email?: string | null } | null
    owner?: { name?: string | null; email?: string | null } | null
    reviews: Array<{
      id: string
      rating: number
      comment: string
      createdAt: Date
      renter?: { name?: string | null; email?: string | null } | null
    }>
  }

  const property = (await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      agent: { select: { name: true, email: true } },
      owner: { select: { name: true, email: true } },
      reviews: {
        include: {
          renter: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })) as PropertyType | null

  if (!property) return notFound()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
      : 0

  const images = Array.isArray(property.images) ? property.images : property.images.split(",").filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 mb-6 sm:mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Properties
        </Link>

        {/* Header Section */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-4 leading-tight">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300 font-medium">{property.views || 0} views</span>
                </div>
                {property.reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-slate-300 font-medium">
                      {averageRating.toFixed(1)} ({property.reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">{formatPrice(property.price)}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
              <Link href={`/applications/apply?listingId=${property.id}`} className="flex-1 lg:flex-none">
                <button className="group relative overflow-hidden w-full h-12 lg:h-14 rounded-2xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold shadow-lg hover:shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 ease-out border border-slate-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    Apply Now
                  </span>
                </button>
              </Link>
              <div className="flex gap-3 sm:flex-1 lg:flex-none lg:w-full">
                <button className="flex-1 h-12 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button className="flex-1 h-12 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden">
              {images.length > 0 ? (
                <div className="space-y-4 p-6 sm:p-8">
                  {/* Main Image */}
                  <div className="relative group">
                    <img
                      src={images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-slate-600/30">
                      <div className="flex items-center gap-1 text-slate-200 text-sm font-medium">
                        <Camera className="w-3 h-3" />
                        {images.length} photos
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                      {images.slice(1, 9).map((url: string, idx: number) => (
                        <div key={idx} className="relative group cursor-pointer">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Property image ${idx + 2}`}
                            className="w-full h-16 sm:h-20 object-cover rounded-xl border-2 border-slate-600/50 group-hover:border-slate-500 transition-all duration-200 shadow-sm group-hover:shadow-md"
                          />
                          <div className="absolute inset-0 bg-slate-600/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200"></div>
                        </div>
                      ))}
                      {images.length > 9 && (
                        <div className="relative group cursor-pointer">
                          <img
                            src={images[9] || "/placeholder.svg"}
                            alt="More images"
                            className="w-full h-16 sm:h-20 object-cover rounded-xl border-2 border-slate-600/50 group-hover:border-slate-500 transition-all duration-200 shadow-sm group-hover:shadow-md"
                          />
                          <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-slate-200 text-xs font-bold">+{images.length - 9}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center rounded-2xl">
                    <Home className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <Home className="w-6 h-6 text-slate-300" />
                Property Description
              </h2>
              <div className="prose prose-slate prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-slate-300" />
                Amenities & Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: "24/7 Security", available: true },
                  { icon: Car, label: "Parking Available", available: true },
                  { icon: Wifi, label: "High-Speed Wi-Fi", available: true },
                  { icon: Waves, label: "Swimming Pool", available: true },
                  { icon: Home, label: "Furnished", available: false },
                  { icon: User, label: "Concierge Service", available: false },
                ].map((amenity, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      amenity.available
                        ? "bg-slate-700/30 border-slate-600/20 text-slate-200"
                        : "bg-slate-700/10 border-slate-600/10 text-slate-400"
                    }`}
                  >
                    <amenity.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{amenity.label}</span>
                    {amenity.available && (
                      <div className="ml-auto w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  Reviews ({property.reviews.length})
                </h2>
                {property.reviews.length > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-100">{averageRating.toFixed(1)}</div>
                    <div className="text-slate-400 text-sm">Average Rating</div>
                  </div>
                )}
              </div>

              {property.reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-400">Be the first to review this property!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {property.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-slate-700/30 border border-slate-600/20 p-6 rounded-2xl hover:bg-slate-700/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200">
                              {review.renter?.name || review.renter?.email || "Anonymous"}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-slate-500"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-300" />
                Contact Information
              </h3>
              <div className="space-y-4">
                {property.agent && (
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Property Agent</div>
                        <div className="text-sm text-slate-200 font-semibold">
                          {property.agent.name || property.agent.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-slate-600/50 hover:bg-slate-600 border border-slate-500/30 text-slate-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                      <button className="flex-1 px-3 py-2 bg-slate-600/50 hover:bg-slate-600 border border-slate-500/30 text-slate-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                    </div>
                  </div>
                )}

                {property.owner && (
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <Home className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Property Owner</div>
                        <div className="text-sm text-slate-200 font-semibold">
                          {property.owner.name || property.owner.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-slate-600/50 hover:bg-slate-600 border border-slate-500/30 text-slate-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                      <button className="flex-1 px-3 py-2 bg-slate-600/50 hover:bg-slate-600 border border-slate-500/30 text-slate-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4">Property Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Listed</span>
                  <span className="font-semibold text-slate-100 text-sm">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Views</span>
                  <span className="font-semibold text-slate-100 text-sm">{property.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Reviews</span>
                  <span className="font-semibold text-slate-100 text-sm">{property.reviews.length}</span>
                </div>
                {property.reviews.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Rating</span>
                    <span className="font-semibold text-slate-100 text-sm">{averageRating.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <div className="text-slate-200 font-semibold text-sm">Schedule Viewing</div>
                      <div className="text-slate-400 text-xs">Book a property tour</div>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <div className="text-slate-200 font-semibold text-sm">Get Quote</div>
                      <div className="text-slate-400 text-xs">Request pricing details</div>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl transition-all duration-200 hover:shadow-lg group text-left">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <div className="text-slate-200 font-semibold text-sm">Share Property</div>
                      <div className="text-slate-400 text-xs">Send to friends</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
