"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  X,
  DollarSign,
  MapPin,
  Home,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Edit3,
  Eye,
  Calendar,
  Building,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Shield,
  Camera,
  Plus,
  Trash2,
  Heart,
} from "lucide-react"

type Property = {
  id: string
  title: string
  price: number
  location: string
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  amenities?: string[]
  propertyType?: string
  status?: string
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/properties/${id}`)
        const data = await res.json()
        if (res.ok) {
          setProperty(data.property)
        } else {
          setError(data.error || "Failed to fetch property")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProperty()
  }, [id])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/properties/${id}`)
        }, 1500)
      } else {
        setError(data.error || "Failed to update property")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setSaving(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    // Handle amenities checkboxes
    const amenityNames = ["parking", "furnished", "petFriendly", "wifi", "security"]
    if (amenityNames.includes(name)) {
      setProperty((prev) => {
        if (!prev) return prev
        const amenities = prev.amenities || []
        if (checked) {
          // Add amenity
          return { ...prev, amenities: Array.from(new Set([...amenities, name])) }
        } else {
          // Remove amenity
          return { ...prev, amenities: amenities.filter((a) => a !== name) }
        }
      })
      return
    }

    setProperty((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "number" ? Number(value) : value,
          }
        : prev,
    )
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setImageUploading(true)
    const formData = new FormData()
    formData.append("propertyId", id as string)
    Array.from(files).forEach((file) => formData.append("images", file))

    try {
      const res = await fetch("/api/properties/images", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.urls) {
        setProperty((prev) =>
          prev
            ? {
                ...prev,
                images: [...(prev.images || []), ...data.urls],
              }
            : prev,
        )
      }
    } catch (err) {
      setError("Failed to upload images")
    } finally {
      setImageUploading(false)
    }
  }

  async function handleImageRemove(imageUrl: string) {
    try {
      const res = await fetch("/api/properties/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: id, imageUrl }),
      })
      if (res.ok) {
        setProperty((prev) =>
          prev
            ? {
                ...prev,
                images: prev.images?.filter((url) => url !== imageUrl) || [],
              }
            : prev,
        )
      }
    } catch (err) {
      setError("Failed to remove image")
    }
  }

  // Auto-dismiss success and error notifications
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-4">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">Loading Property</h3>
          <p className="text-slate-400">Please wait while we fetch the property details...</p>
        </div>
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-2xl rounded-2xl sm:rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Error Loading Property</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/my-properties" className="flex-1">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30">
                  Back to Properties
                </button>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Success Notification */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-green-400/30 flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Property updated successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-red-400/30 flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 hover:bg-red-600/50 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <Edit3 className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-100">
              Edit Property
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Update your property details and manage listing information
            </p>

            {/* Property Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-slate-200">{property.title}</div>
                <div className="text-sm sm:text-base">Property Title</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-slate-200">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                    minimumFractionDigits: 0,
                  }).format(property.price)}
                </div>
                <div className="text-sm sm:text-base">Current Price</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-slate-200">{property.location}</div>
                <div className="text-sm sm:text-base">Location</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/my-properties"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to My Properties
          </Link>
          <Link
            href={`/properties/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-medium rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
          >
            <Eye className="w-4 h-4" />
            View Property
          </Link>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Home className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-200">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={property.title || ""}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                  placeholder="Enter property title"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Price (KES)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={property.price || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={property.location || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Property Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    name="propertyType"
                    value={property.propertyType || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Select type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={property.status || "active"}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Square className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Property Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Bedrooms</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Bed className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="bedrooms"
                    value={property.bedrooms || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Bathrooms</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Bath className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="bathrooms"
                    value={property.bathrooms || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Area (sq ft)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Square className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="area"
                    value={property.area || ""}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Shield className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Amenities</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Parking */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="parking"
                  checked={property.amenities?.includes("parking") || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                />
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-200">Parking Available</label>
                </div>
              </div>

              {/* Furnished */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={property.amenities?.includes("furnished") || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                />
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-200">Furnished</label>
                </div>
              </div>

              {/* Pet Friendly */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="petFriendly"
                  checked={property.amenities?.includes("petFriendly") || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                />
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-200">Pet Friendly</label>
                </div>
              </div>

              {/* WiFi */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={property.amenities?.includes("wifi") || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                />
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-200">WiFi Included</label>
                </div>
              </div>

              {/* Security */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="security"
                  checked={property.amenities?.includes("security") || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600/50 bg-slate-700/50 text-slate-500 focus:ring-slate-500/50 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:border-slate-500/70"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-200">Security System</label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Camera className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Property Images</h2>
            </div>

            {/* Existing Images */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {property.images?.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl || "/placeholder.svg?height=96&width=96"}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl border-2 border-slate-600/50 group-hover:border-slate-500 transition-all duration-200 shadow-sm group-hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(imageUrl)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add Image Button */}
              <label className="w-full h-24 border-2 border-dashed border-slate-600/50 rounded-xl flex flex-col items-center justify-center hover:border-slate-500 transition-all duration-200 cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploading}
                />
                {imageUploading ? (
                  <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-slate-300 transition-colors duration-200 mb-1" />
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                      Add Image
                    </span>
                  </>
                )}
              </label>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Upload high-quality images to showcase your property. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <FileText className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Description</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Property Description</label>
              <textarea
                name="description"
                value={property.description || ""}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 resize-none"
                placeholder="Describe your property in detail. Include key features, nearby amenities, and what makes it special..."
              />
              <p className="text-xs text-slate-400">
                Provide a detailed description to help potential tenants understand what makes your property unique.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
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
                      Save Changes
                    </>
                  )}
                </span>
              </button>

              <Link
                href={`/properties/${id}`}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-3"
              >
                <X className="w-5 h-5" />
                Cancel
              </Link>
            </div>

            {/* Last Updated Info */}
            {property.updatedAt && (
              <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {new Date(property.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
