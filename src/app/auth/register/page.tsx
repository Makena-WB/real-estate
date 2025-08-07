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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const getPasswordStrength = (password: string) => {
    const checks = validatePassword(password);
    const score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { strength: 'weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (score < 4) return { strength: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { strength: 'strong', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (!validateName(form.name)) {
      errors.name = "Name must be at least 2 characters and contain only letters";
    }
    
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!form.password.trim()) {
      errors.password = "Password is required";
    } else {
      const passwordChecks = validatePassword(form.password);
      if (!passwordChecks.length) {
        errors.password = "Password must be at least 8 characters";
      } else if (!passwordChecks.uppercase || !passwordChecks.lowercase) {
        errors.password = "Password must contain both uppercase and lowercase letters";
      } else if (!passwordChecks.number) {
        errors.password = "Password must contain at least one number";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: string) => {
    const errors = { ...validationErrors };
    
    if (field === 'name') {
      if (!form.name.trim()) {
        errors.name = "Name is required";
      } else if (!validateName(form.name)) {
        errors.name = "Name must be at least 2 characters and contain only letters";
      } else {
        delete errors.name;
      }
    }
    
    if (field === 'email') {
      if (!form.email.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(form.email)) {
        errors.email = "Please enter a valid email address";
      } else {
        delete errors.email;
      }
    }
    
    if (field === 'password') {
      if (!form.password.trim()) {
        errors.password = "Password is required";
      } else {
        const passwordChecks = validatePassword(form.password);
        if (!passwordChecks.length) {
          errors.password = "Password must be at least 8 characters";
        } else if (!passwordChecks.uppercase || !passwordChecks.lowercase) {
          errors.password = "Password must contain both uppercase and lowercase letters";
        } else if (!passwordChecks.number) {
          errors.password = "Password must contain at least one number";
        } else {
          delete errors.password;
        }
      }
    }
    
    setValidationErrors(errors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
                onBlur={() => handleBlur('name')}
                className={`h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50 ${
                  validationErrors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm font-medium">{validationErrors.name}</p>
              )}
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
                onBlur={() => handleBlur('email')}
                className={`h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50 ${
                  validationErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm font-medium">{validationErrors.email}</p>
              )}
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
                onBlur={() => handleBlur('password')}
                className={`h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50 ${
                  validationErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                required
              />
              
              {/* Password strength indicator */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(form.password).bg}`}
                        style={{ 
                          width: `${(Object.values(validatePassword(form.password)).filter(Boolean).length / 5) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${getPasswordStrength(form.password).color}`}>
                      {getPasswordStrength(form.password).strength.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(validatePassword(form.password)).map(([key, valid]) => (
                      <div key={key} className={`flex items-center gap-1 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1 h-1 rounded-full ${valid ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {key === 'length' && '8+ characters'}
                        {key === 'uppercase' && 'Uppercase'}
                        {key === 'lowercase' && 'Lowercase'}
                        {key === 'number' && 'Number'}
                        {key === 'special' && 'Special char'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {validationErrors.password && (
                <p className="text-red-500 text-sm font-medium">{validationErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || Object.keys(validationErrors).length > 0}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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
