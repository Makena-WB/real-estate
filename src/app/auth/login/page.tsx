"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, LogIn, ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Redirect to dashboard on success
    router.push("/dashboard");
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
          <p className="text-blue-600 mt-2">Welcome back to your account</p>
        </div>

        {/* Login form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Sign In</h2>
            <p className="text-blue-600">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-600">
              {"Don't have an account? "}
              <Link 
                href="/auth/register" 
                className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicator */}
        <div className="text-center mt-6">
          <p className="text-sm text-blue-600 font-medium opacity-80">
            Secure login • Trusted by thousands of users
          </p>
        </div>
      </div>
    </section>
  );
}
