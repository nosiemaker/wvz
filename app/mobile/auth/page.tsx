"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      router.push("/mobile")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/95 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-accent-foreground">FL</span>
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground mb-2">FleetLog</h1>
        <p className="text-primary-foreground/80">Driver Digital Logging System</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="bg-card rounded-xl p-6 space-y-4 shadow-lg">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border bg-input" />
              <span>Remember me</span>
            </label>
            <Link href="/mobile/auth/forgot" className="text-accent hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-primary-foreground">
          New driver?{" "}
          <Link href="/mobile/auth/signup" className="font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </form>

      {/* Demo Credentials */}
      <div className="mt-8 w-full max-w-md">
        <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg p-4 text-sm text-primary-foreground/90">
          <p className="font-semibold mb-2">Demo Credentials</p>
          <p>
            Email: <code className="bg-primary-foreground/20 px-2 py-1 rounded">driver@fleet.com</code>
          </p>
          <p>
            Password: <code className="bg-primary-foreground/20 px-2 py-1 rounded">demo123</code>
          </p>
        </div>
      </div>
    </div>
  )
}
