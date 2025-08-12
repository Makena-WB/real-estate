"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, UserPlus, ArrowLeft, Shield, Check } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name) && name.trim().length >= 2
  }

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }

  const getPasswordStrength = (password: string) => {
    const checks = validatePassword(password)
    const score = Object.values(checks).filter(Boolean).length

    if (score < 2) return { strength: "weak", color: "text-red-400", bg: "bg-red-500" }
    if (score < 4) return { strength: "medium", color: "text-yellow-400", bg: "bg-yellow-500" }
    return { strength: "strong", color: "text-green-400", bg: "bg-green-500" }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!form.name.trim()) {
      errors.name = "Name is required"
    } else if (!validateName(form.name)) {
      errors.name = "Name must be at least 2 characters and contain only letters"
    }

    if (!form.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!form.password.trim()) {
      errors.password = "Password is required"
    } else {
      const passwordChecks = validatePassword(form.password)
      if (!passwordChecks.length) {
        errors.password = "Password must be at least 8 characters"
      } else if (!passwordChecks.uppercase || !passwordChecks.lowercase) {
        errors.password = "Password must contain both uppercase and lowercase letters"
      } else if (!passwordChecks.number) {
        errors.password = "Password must contain at least one number"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleBlur = (field: string) => {
    const errors = { ...validationErrors }

    if (field === "name") {
      if (!form.name.trim()) {
        errors.name = "Name is required"
      } else if (!validateName(form.name)) {
        errors.name = "Name must be at least 2 characters and contain only letters"
      } else {
        delete errors.name
      }
    }

    if (field === "email") {
      if (!form.email.trim()) {
        errors.email = "Email is required"
      } else if (!validateEmail(form.email)) {
        errors.email = "Please enter a valid email address"
      } else {
        delete errors.email
      }
    }

    if (field === "password") {
      if (!form.password.trim()) {
        errors.password = "Password is required"
      } else {
        const passwordChecks = validatePassword(form.password)
        if (!passwordChecks.length) {
          errors.password = "Password must be at least 8 characters"
        } else if (!passwordChecks.uppercase || !passwordChecks.lowercase) {
          errors.password = "Password must contain both uppercase and lowercase letters"
        } else if (!passwordChecks.number) {
          errors.password = "Password must contain at least one number"
        } else {
          delete errors.password
        }
      }
    }

    setValidationErrors(errors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/auth/login")
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/90 shadow-lg backdrop-blur-sm mb-4">
            <Home className="size-8 text-slate-300" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">EstateEase</h1>
          <p className="text-slate-300 mt-2">Join thousands of satisfied users</p>
        </div>

        {/* Registration form */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600/30 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Create Account</h2>
            <p className="text-slate-300">Start your real estate journey with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className={`h-12 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/50 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 ${
                  validationErrors.name ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/50" : ""
                }`}
                required
              />
              {validationErrors.name && <p className="text-red-400 text-sm font-medium">{validationErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`h-12 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/50 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 ${
                  validationErrors.email ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/50" : ""
                }`}
                required
              />
              {validationErrors.email && <p className="text-red-400 text-sm font-medium">{validationErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </label>
              <Input
                id="password"
                name="password"
                placeholder="Create a secure password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={`h-12 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/50 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 ${
                  validationErrors.password ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/50" : ""
                }`}
                required
              />

              {/* Password strength indicator */}
              {form.password && (
                <div className="space-y-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-600/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(form.password).bg}`}
                        style={{
                          width: `${(Object.values(validatePassword(form.password)).filter(Boolean).length / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className={`text-xs font-semibold ${getPasswordStrength(form.password).color}`}>
                      {getPasswordStrength(form.password).strength.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(validatePassword(form.password)).map(([key, valid]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 ${valid ? "text-green-400" : "text-slate-400"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${valid ? "bg-green-400" : "bg-slate-500"} transition-colors duration-200`}
                        ></div>
                        <span className="font-medium">
                          {key === "length" && "8+ characters"}
                          {key === "uppercase" && "Uppercase"}
                          {key === "lowercase" && "Lowercase"}
                          {key === "number" && "Number"}
                          {key === "special" && "Special char"}
                        </span>
                        {valid && <Check className="w-3 h-3 text-green-400 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationErrors.password && (
                <p className="text-red-400 text-sm font-medium">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-200">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/50 bg-slate-700/50 text-slate-100 rounded-md shadow-sm transition-all duration-200"
              >
                <option value="USER" className="bg-slate-700 text-slate-100">
                  Renter
                </option>
                <option value="LANDLORD" className="bg-slate-700 text-slate-100">
                  Landlord
                </option>
                <option value="AGENT" className="bg-slate-700 text-slate-100">
                  Agent
                </option>
              </select>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || Object.keys(validationErrors).length > 0}
              className="w-full h-12 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-slate-500/30"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-slate-200 hover:text-slate-100 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 font-medium opacity-80">
            <Shield className="w-4 h-4" />
            <span>Secure registration • Your data is protected</span>
          </div>
          <p className="text-xs text-slate-500 opacity-70">By creating an account, you agree to our Terms of Service</p>
        </div>
      </div>
    </section>
  )
}
