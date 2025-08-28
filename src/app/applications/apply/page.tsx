import { requireAuth } from "@/lib/auth-redirect"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { FileText, Home, MapPin, Send, User, MessageSquare, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ApplicationForm({ searchParams }: { searchParams: { listingId?: string } }) {
  const session = await requireAuth()
  const listingId = searchParams.listingId || ""

  // Fetch listing info for context (optional)
  const listing = listingId
    ? await prisma.listing.findUnique({
        where: { id: listingId },
        select: {
          title: true,
          location: true,
          price: true,
          images: true,
          agent: { select: { name: true, email: true } },
          owner: { select: { name: true, email: true } },
        },
      })
    : null

  async function handleSubmit(formData: FormData) {
    "use server"
    const message = formData.get("message") as string
    const type = formData.get("type") as string
    await prisma.application.create({
      data: {
        userId: session?.user?.id!,
        listingId,
        message,
        type,
      },
    })
    redirect("/applications")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-100">
              Apply for Property
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Submit your application and take the next step towards your dream home
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Back Navigation */}
        <Link
          href={listing ? `/properties/${listingId}` : "/properties"}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to {listing ? "Property" : "Properties"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Application Form</h2>
                  <p className="text-slate-400 text-sm">Fill out the details below to submit your application</p>
                </div>
              </div>

              <form action={handleSubmit} className="space-y-6">
                {/* Application Type */}
                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-slate-200">
                    Application Type
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      name="type"
                      className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer"
                      required
                    >
                      <option value="rent" className="bg-slate-700 text-slate-100">
                        Rent this Property
                      </option>
                      <option value="buy" className="bg-slate-700 text-slate-100">
                        Purchase this Property
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-200">
                    Application Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <MessageSquare className="w-5 h-5 text-slate-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full pl-12 pr-4 pt-4 pb-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 resize-none"
                      placeholder="Tell us why you're interested in this property, your background, and any questions you might have..."
                      required
                    />
                  </div>
                  <p className="text-slate-400 text-xs">
                    Include details about your background, timeline, and any specific requirements
                  </p>
                </div>

                {/* Applicant Information Display */}
                <div className="space-y-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-200 ml-2 font-medium">{session?.user?.name || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-200 ml-2 font-medium">{session?.user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative overflow-hidden w-full h-14 rounded-2xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white text-lg font-semibold shadow-lg hover:shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 ease-out border border-slate-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Send className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    Submit Application
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Property Information Sidebar */}
          <div className="space-y-6">
            {listing && (
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-slate-300" />
                  Property Details
                </h3>

                {/* Property Image */}
                {listing.images && listing.images.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={
                        Array.isArray(listing.images)
                          ? listing.images[0]
                          : typeof listing.images === "string"
                          ? (listing.images as string).split(",")[0]
                          : ""
                      }
                      alt={listing.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-100 text-lg line-clamp-2">{listing.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{listing.location}</span>
                  </div>

                  {listing.price && (
                    <div className="text-2xl font-bold text-slate-100">{formatPrice(listing.price)}</div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="mt-6 pt-4 border-t border-slate-600/30">
                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {listing.agent && (
                      <div>
                        <span className="text-slate-400">Agent:</span>
                        <span className="text-slate-200 ml-2 font-medium">
                          {listing.agent.name || listing.agent.email}
                        </span>
                      </div>
                    )}
                    {listing.owner && (
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <span className="text-slate-200 ml-2 font-medium">
                          {listing.owner.name || listing.owner.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Application Tips */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-slate-100">Application Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>Be specific about your interest and timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>Include relevant background information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>Ask any questions you might have</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>Be professional and courteous</span>
                </li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="font-bold text-slate-100">Secure Application</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your application is encrypted and will be sent directly to the property owner or agent. You'll receive a
                confirmation once submitted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
