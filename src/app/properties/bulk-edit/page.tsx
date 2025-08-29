"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Edit3,
  Home,
  Settings,
  ArrowLeft,
  Shield,
  CheckCircle,
  Save,
  RefreshCw,
  DollarSign,
  MapPin,
  Eye,
  Calendar,
  AlertCircle,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"

type Listing = {
  id: string | number
  title: string
  price: number
  location: string
  createdAt: string
  description?: string
  images?: string[] | string
  views?: number
  _count?: {
    favorites?: number
    reviews?: number
  }
}

export default function BulkEditPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedListings, setSelectedListings] = useState<Set<string | number>>(new Set())

  // Image Remove Handler
  async function handleRemoveImage(listingId: string, imgUrl: string) {
    try {
      await fetch("/api/properties/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, imgUrl }),
      })
      // Refresh listings after mutation
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                images: Array.isArray(listing.images) ? listing.images.filter((url) => url !== imgUrl) : listing.images,
              }
            : listing,
        ),
      )
    } catch (err) {
      setError("Failed to remove image")
    }
  }

  // Image Add Handler
  async function handleAddImages(listingId: string, files: FileList) {
    try {
      const formData = new FormData()
      formData.append("listingId", listingId)
      Array.from(files).forEach((file) => formData.append("images", file))
      const res = await fetch("/api/properties/images", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.urls) {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === listingId
              ? {
                  ...listing,
                  images: Array.isArray(listing.images) ? [...listing.images, ...data.urls] : data.urls,
                }
              : listing,
          ),
        )
      }
    } catch (err) {
      setError("Failed to add images")
    }
  }

  async function handleBulkSave() {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    // Collect updated data from the form
    const updates = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      description: listing.description,
    }))

    try {
      const res = await fetch("/api/properties/bulk-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!data.success) throw new Error("Bulk update failed")

      setSuccessMessage(`Successfully updated ${updates.length} properties`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setError(err.message || "Unknown error occurred")
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  function handleSelectAll() {
    if (selectedListings.size === listings.length) {
      setSelectedListings(new Set())
    } else {
      setSelectedListings(new Set(listings.map((l) => l.id)))
    }
  }

  function handleSelectListing(listingId: string | number) {
    const newSelected = new Set(selectedListings)
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId)
    } else {
      newSelected.add(listingId)
    }
    setSelectedListings(newSelected)
  }

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/properties/bulk-listings")
        const data = await res.json()
        if (data.error) {
          setAccessDenied(true)
        } else {
          setListings(data.listings)
        }
      } catch (err) {
        setError("Failed to load properties")
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-4">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">Loading Properties</h2>
          <p className="text-slate-400">Please wait while we fetch your listings...</p>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-2xl rounded-2xl sm:rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Access Denied</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Only agents and landlords can access the bulk edit functionality. Please contact an administrator if you
              believe this is an error.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                  Go to Dashboard
                </button>
              </Link>
              <Link href="/properties" className="flex-1">
                <button className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm">
                  Browse Properties
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Success/Error Messages */}
      {(successMessage || error) && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-green-400">Success!</h4>
                  <p className="text-sm text-green-300/80">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-400">Error</h4>
                  <p className="text-sm text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <Settings className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-100">
              Bulk Edit Properties
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Efficiently manage multiple properties at once with our powerful bulk editing tools
            </p>

            {/* Stats Overview */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{listings.length}</div>
                <div className="text-sm sm:text-base">Properties</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">
                  {listings.reduce((sum, listing) => sum + (listing._count?.favorites || 0), 0)}
                </div>
                <div className="text-sm sm:text-base">Total Favorites</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">
                  {listings.reduce((sum, listing) => sum + (listing._count?.reviews || 0), 0)}
                </div>
                <div className="text-sm sm:text-base">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Back Navigation */}
        <Link
          href="/my-properties"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to My Properties
        </Link>

        {listings.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-6">
              <Home className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-4">No Properties Found</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              You have no properties to edit. Add your first property to get started with bulk editing.
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
          <div className="space-y-8">
            {/* Bulk Actions Header */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">Bulk Actions</h2>
                  <p className="text-slate-300">
                    Select properties and apply changes to multiple listings at once
                    {selectedListings.size > 0 && (
                      <span className="ml-2 px-2 py-1 bg-slate-600/50 rounded-lg text-sm">
                        {selectedListings.size} selected
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {selectedListings.size === listings.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={handleBulkSave}
                    disabled={saving || selectedListings.size === 0}
                    className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Properties List */}
            <form className="space-y-6">
              {listings.map((listing: any) => (
                <div
                  key={listing.id}
                  className={`group bg-slate-800/80 backdrop-blur-sm border shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden ${
                    selectedListings.has(listing.id)
                      ? "border-slate-500/70 ring-2 ring-slate-500/30"
                      : "border-slate-600/30 hover:border-slate-500/50"
                  }`}
                >
                  {/* Property Header */}
                  <div className="p-6 sm:p-8 border-b border-slate-600/30">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedListings.has(listing.id)}
                            onChange={() => handleSelectListing(listing.id)}
                            className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2 line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {listing.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatPrice(listing.price)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link href={`/properties/${listing.id}`}>
                          <button
                            type="button"
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/properties/${listing.id}/edit`}>
                          <button
                            type="button"
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* Title Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Property Title</label>
                        <input
                          type="text"
                          defaultValue={listing.title}
                          className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                        />
                      </div>

                      {/* Price Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Price (KES)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="number"
                            defaultValue={listing.price}
                            className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Location Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Location</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            defaultValue={listing.location}
                            className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Status Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Status</label>
                        <div className="relative">
                          <select className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer">
                            <option value="active" className="bg-slate-700 text-slate-100">
                              Active
                            </option>
                            <option value="inactive" className="bg-slate-700 text-slate-100">
                              Inactive
                            </option>
                            <option value="sold" className="bg-slate-700 text-slate-100">
                              Sold
                            </option>
                            <option value="rented" className="bg-slate-700 text-slate-100">
                              Rented
                            </option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Featured Toggle */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Featured Property</label>
                        <div className="flex items-center h-12">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
                            <span className="ml-3 text-sm text-slate-300">Mark as featured</span>
                          </label>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Availability</label>
                        <div className="relative">
                          <select className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer">
                            <option value="available" className="bg-slate-700 text-slate-100">
                              Available
                            </option>
                            <option value="pending" className="bg-slate-700 text-slate-100">
                              Pending
                            </option>
                            <option value="unavailable" className="bg-slate-700 text-slate-100">
                              Unavailable
                            </option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Images Field */}
                      <div className="space-y-2 col-span-full">
                        <label className="block text-sm font-medium text-slate-200">Property Images</label>
                        <div className="flex flex-wrap gap-4 mb-2">
                          {/* Existing images */}
                          {(() => {
                            const images = Array.isArray(listing.images)
                              ? listing.images
                              : typeof listing.images === "string"
                                ? (listing.images as string).split(",").filter(Boolean)
                                : []

                            return images.map((imgUrl: string, idx: number) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={imgUrl || "/placeholder.svg?height=96&width=96"}
                                  alt={`Property image ${idx + 1}`}
                                  className="w-24 h-24 object-cover rounded-xl border-2 border-slate-600/50 group-hover:border-slate-500 transition-all duration-200 shadow-sm group-hover:shadow-md"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                  title="Remove image"
                                  onClick={() => handleRemoveImage(listing.id, imgUrl)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          })()}

                          {/* Add new image placeholder */}
                          <label className="w-24 h-24 border-2 border-dashed border-slate-600/50 rounded-xl flex items-center justify-center hover:border-slate-500 transition-all duration-200 cursor-pointer group">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-slate-300 transition-colors duration-200" />
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) handleAddImages(listing.id, e.target.files)
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Click the + icon to add images or hover over existing images to remove them.
                        </p>
                      </div>
                    </div>

                    {/* Description Field */}
                    <div className="mt-6 space-y-2">
                      <label className="block text-sm font-medium text-slate-200">Description</label>
                      <textarea
                        rows={3}
                        defaultValue={listing.description}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Property Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-100">{listing._count?.favorites || 0}</div>
                        <div className="text-xs text-slate-400">Favorites</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-100">{listing._count?.reviews || 0}</div>
                        <div className="text-xs text-slate-400">Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-100">{listing.views || 0}</div>
                        <div className="text-xs text-slate-400">Views</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bulk Action Buttons */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleBulkSave}
                    disabled={saving || selectedListings.size === 0}
                    className="group relative overflow-hidden flex-1 h-14 rounded-2xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-semibold shadow-lg hover:shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 ease-out border border-slate-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                          Save All Changes ({selectedListings.size})
                        </>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset Changes
                  </button>
                </div>

                {/* Warning Notice */}
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-1">Important Notice</h4>
                      <p className="text-sm text-yellow-300/80 leading-relaxed">
                        Bulk changes will be applied to all selected properties. Please review your changes carefully
                        before saving. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
