"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff, Loader } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/95 p-4">
      <Link
        href="/mobile/auth"
        className="inline-flex items-center gap-2 text-primary-foreground mb-6 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Login
      </Link>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="bg-card rounded-xl p-6 space-y-4 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Create Account</h1>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <div className="flex items-center bg-input border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <User className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="flex items-center bg-input border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <div className="flex items-center bg-input border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Phone className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="flex items-center bg-input border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <div className="flex items-center bg-input border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="rounded border-border bg-input mt-1" required />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-accent hover:underline">
                Terms and Conditions
              </Link>
            </span>
          </label>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
