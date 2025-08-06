"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, UserPlus, ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // After successful signup, redirect to login
    router.push("/auth/login");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-blue-200 bg-white/90 shadow-lg backdrop-blur-sm mb-4">
            <Home className="size-8 text-blue-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            EstateEase
          </h1>
          <p className="text-blue-600 mt-2">Join thousands of satisfied users</p>
        </div>

        {/* Registration form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Create Account</h2>
            <p className="text-blue-600">Start your real estate journey with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-blue-900">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-blue-900">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-blue-900">
                Password
              </label>
              <Input
                id="password"
                name="password"
                placeholder="Create a secure password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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
            <p className="text-blue-600">
              Already have an account?{" "}
              <Link 
                href="/auth/login" 
                className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-blue-600 font-medium opacity-80">
            🔒 Secure registration • Your data is protected
          </p>
          <p className="text-xs text-blue-500 opacity-70">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </section>
  );
}
