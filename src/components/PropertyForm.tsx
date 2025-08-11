"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Type,
  Upload,
  MapPin,
  DollarSign,
  User,
  Home,
  AlertCircle,
} from "lucide-react"

export default function PropertyForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
    ownerId: "",
  })
  const [landlords, setLandlords] = useState<{ id: string; name: string; email: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const descriptionRef = useRef<HTMLDivElement>(null)

  // Calculate form completion percentage
  const calculateFormProgress = () => {
    let completedFields = 0
    const totalFields = 6

    if (form.title.trim()) completedFields++
    if (form.description.trim() && form.description !== "<br>") completedFields++
    if (form.price && Number.parseFloat(form.price) > 0) completedFields++
    if (form.location.trim()) completedFields++
    if (form.ownerId) completedFields++
    if (form.images) completedFields++

    return (completedFields / totalFields) * 100
  }

  const formProgress = calculateFormProgress()

  // Fetch landlords on mount
  useEffect(() => {
    async function fetchLandlords() {
      try {
        const res = await fetch("/api/users?role=LANDLORD")
        const data = await res.json()
        setLandlords(data)
      } catch {
        setLandlords([])
      }
    }
    fetchLandlords()
  }, [])

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  // Handle rich text editor changes
  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      setForm({ ...form, description: descriptionRef.current.innerHTML })
      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([])
      }
    }
  }

  // Rich text formatting functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    descriptionRef.current?.focus()
    handleDescriptionChange()
  }

  // Validate form fields
  const validateForm = () => {
    const errors: string[] = []

    if (!form.title.trim()) {
      errors.push("Property title is required")
    }

    if (!form.description.trim() || form.description === "<br>") {
      errors.push("Property description is required")
    }

    if (!form.price || Number.parseFloat(form.price) <= 0) {
      errors.push("Valid price is required")
    }

    if (!form.location.trim()) {
      errors.push("Location is required")
    }

    if (!form.ownerId) {
      errors.push("Please select a landlord")
    }

    if (!form.images) {
      errors.push("At least one image is required")
    }

    return errors
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError("")

    try {
      const urls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "Properties")

        const res = await fetch("https://api.cloudinary.com/v1_1/dk1gui2j1/image/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()
        if (data.secure_url) {
          urls.push(data.secure_url)
        } else {
          throw new Error("Image upload failed")
        }
      }

      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images},${urls.join(",")}` : urls.join(","),
      }))
    } catch (err: any) {
      setError(err.message || "Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  // Handle image deletion
  const handleImageDelete = (indexToDelete: number) => {
    const imageUrls = form.images.split(",").filter((_, index) => index !== indexToDelete)
    setForm({ ...form, images: imageUrls.join(",") })
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)
    setValidationErrors([])

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number.parseFloat(form.price),
        }),
      })
      if (!res.ok) throw new Error("Failed to add property")
      setSuccess(true)
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        images: "",
        ownerId: "",
      })
      if (descriptionRef.current) {
        descriptionRef.current.innerHTML = ""
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg mb-6">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">Add New Property</h1>
          <p className="text-blue-600 text-lg max-w-2xl mx-auto">
            Create a stunning property listing with rich descriptions and beautiful imagery
          </p>
        </div>

        {/* Form Progress Bar */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-blue-800">Form Completion</span>
            <span className="text-lg font-bold text-blue-700">{Math.round(formProgress)}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${formProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-3 text-sm text-blue-600">
            {formProgress === 100 ? (
              <span className="font-medium text-green-600">✓ All fields completed! Ready to submit.</span>
            ) : (
              <span>Complete all fields to submit your property listing</span>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-blue-200/50 space-y-8"
        >
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200 space-y-3">
              <div className="flex items-center gap-3 text-red-700 font-semibold text-lg">
                <AlertCircle className="w-6 h-6" />
                Please fix the following errors:
              </div>
              <ul className="space-y-2 ml-9">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600 font-medium">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Property Title */}
          <div className="space-y-3">
            <label htmlFor="title" className="flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Type className="w-5 h-5" />
              Property Title
              {form.title.trim() && <span className="text-green-600 text-sm">✓</span>}
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter an attractive property title..."
              className={`w-full h-14 px-6 rounded-2xl border-2 focus:ring-4 focus:ring-blue-100 bg-white/80 backdrop-blur-sm shadow-sm text-lg transition-all duration-300 placeholder:text-blue-400 ${
                validationErrors.some((error) => error.includes("title"))
                  ? "border-red-300 focus:border-red-400"
                  : form.title.trim()
                    ? "border-green-300 focus:border-green-400"
                    : "border-blue-200/60 focus:border-blue-400"
              }`}
            />
          </div>

          {/* Rich Text Description */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Type className="w-5 h-5" />
              Property Description
              {form.description.trim() && form.description !== "<br>" && (
                <span className="text-green-600 text-sm">✓</span>
              )}
            </label>

            {/* Rich Text Toolbar */}
            <div className="flex flex-wrap gap-2 p-4 bg-blue-50/80 rounded-2xl border border-blue-200/60">
              <button
                type="button"
                onClick={() => formatText("bold")}
                className="p-2 rounded-lg bg-white/80 hover:bg-blue-100 border border-blue-200/60 transition-all duration-200 hover:shadow-md"
                title="Bold"
              >
                <Bold className="w-4 h-4 text-blue-700" />
              </button>
              <button
                type="button"
                onClick={() => formatText("italic")}
                className="p-2 rounded-lg bg-white/80 hover:bg-blue-100 border border-blue-200/60 transition-all duration-200 hover:shadow-md"
                title="Italic"
              >
                <Italic className="w-4 h-4 text-blue-700" />
              </button>
              <button
                type="button"
                onClick={() => formatText("underline")}
                className="p-2 rounded-lg bg-white/80 hover:bg-blue-100 border border-blue-200/60 transition-all duration-200 hover:shadow-md"
                title="Underline"
              >
                <Underline className="w-4 h-4 text-blue-700" />
              </button>
              <div className="w-px h-8 bg-blue-200 mx-1"></div>
              <button
                type="button"
                onClick={() => formatText("insertUnorderedList")}
                className="p-2 rounded-lg bg-white/80 hover:bg-blue-100 border border-blue-200/60 transition-all duration-200 hover:shadow-md"
                title="Bullet List"
              >
                <List className="w-4 h-4 text-blue-700" />
              </button>
              <button
                type="button"
                onClick={() => formatText("insertOrderedList")}
                className="p-2 rounded-lg bg-white/80 hover:bg-blue-100 border border-blue-200/60 transition-all duration-200 hover:shadow-md"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4 text-blue-700" />
              </button>
            </div>

            {/* Rich Text Editor */}
            <div
              ref={descriptionRef}
              contentEditable
              onInput={handleDescriptionChange}
              className={`w-full min-h-[120px] p-6 rounded-2xl border-2 focus:ring-4 focus:ring-blue-100 bg-white/80 backdrop-blur-sm shadow-sm text-lg transition-all duration-300 focus:outline-none ${
                validationErrors.some((error) => error.includes("description"))
                  ? "border-red-300 focus:border-red-400"
                  : form.description.trim() && form.description !== "<br>"
                    ? "border-green-300 focus:border-green-400"
                    : "border-blue-200/60 focus:border-blue-400"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
              data-placeholder="Describe your property in detail... Use the toolbar above to format your text."
            />
          </div>

          {/* Price and Location Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="price" className="flex items-center gap-2 text-lg font-semibold text-blue-800">
                <DollarSign className="w-5 h-5" />
                Price (KES)
                {form.price && Number.parseFloat(form.price) > 0 && <span className="text-green-600 text-sm">✓</span>}
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="0"
                className={`w-full h-14 px-6 rounded-2xl border-2 focus:ring-4 focus:ring-blue-100 bg-white/80 backdrop-blur-sm shadow-sm text-lg transition-all duration-300 placeholder:text-blue-400 ${
                  validationErrors.some((error) => error.includes("price"))
                    ? "border-red-300 focus:border-red-400"
                    : form.price && Number.parseFloat(form.price) > 0
                      ? "border-green-300 focus:border-green-400"
                      : "border-blue-200/60 focus:border-blue-400"
                }`}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="location" className="flex items-center gap-2 text-lg font-semibold text-blue-800">
                <MapPin className="w-5 h-5" />
                Location
                {form.location.trim() && <span className="text-green-600 text-sm">✓</span>}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Enter property location..."
                className={`w-full h-14 px-6 rounded-2xl border-2 focus:ring-4 focus:ring-blue-100 bg-white/80 backdrop-blur-sm shadow-sm text-lg transition-all duration-300 placeholder:text-blue-400 ${
                  validationErrors.some((error) => error.includes("Location"))
                    ? "border-red-300 focus:border-red-400"
                    : form.location.trim()
                      ? "border-green-300 focus:border-green-400"
                      : "border-blue-200/60 focus:border-blue-400"
                }`}
              />
            </div>
          </div>

          {/* Landlord Selection */}
          <div className="space-y-3">
            <label htmlFor="ownerId" className="flex items-center gap-2 text-lg font-semibold text-blue-800">
              <User className="w-5 h-5" />
              Select Landlord
              {form.ownerId && <span className="text-green-600 text-sm">✓</span>}
            </label>
            <select
              id="ownerId"
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              required
              className={`w-full h-14 px-6 rounded-2xl border-2 focus:ring-4 focus:ring-blue-100 bg-white/80 backdrop-blur-sm shadow-sm text-lg transition-all duration-300 ${
                validationErrors.some((error) => error.includes("landlord"))
                  ? "border-red-300 focus:border-red-400"
                  : form.ownerId
                    ? "border-green-300 focus:border-green-400"
                    : "border-blue-200/60 focus:border-blue-400"
              }`}
            >
              <option value="">-- Select Landlord --</option>
              {landlords.map((landlord) => (
                <option key={landlord.id} value={landlord.id}>
                  {landlord.name || landlord.email}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label htmlFor="images" className="flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Upload className="w-5 h-5" />
              Upload Images
              {form.images && <span className="text-green-600 text-sm">✓</span>}
            </label>
            <div className="relative">
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <div
                className={`w-full h-14 px-6 rounded-2xl border-2 border-dashed bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center gap-3 text-blue-600 font-medium ${
                  uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } ${
                  validationErrors.some((error) => error.includes("image"))
                    ? "border-red-300/80"
                    : form.images
                      ? "border-green-300/80"
                      : "border-blue-300/80"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{uploading ? "Uploading..." : "Choose files or drag and drop"}</span>
              </div>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Uploading images...
              </div>
            )}

            {form.images && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                {form.images.split(",").map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Property image ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-xl border-2 border-blue-200/60 shadow-sm group-hover:shadow-md transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200"></div>
                    <button
                      type="button"
                      onClick={() => handleImageDelete(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      title="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-medium">{error}</div>
          )}
          {success && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 font-medium">
              Property added successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading || formProgress < 100}
            className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Property...
                </>
              ) : formProgress < 100 ? (
                <>
                  <AlertCircle className="w-6 h-6" />
                  Complete All Fields ({Math.round(formProgress)}%)
                </>
              ) : (
                <>
                  <Home className="w-6 h-6" />
                  Add Property
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #93c5fd;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
