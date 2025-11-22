"use client"

import { Mail, Phone, FileText, Calendar, AlertTriangle, Edit2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.log("[v0] Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load profile</p>
      </div>
    )
  }

  const initials =
    user.profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="pb-20">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
            {initials}
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.profile?.full_name || "Driver"}</h1>
          <p className="text-muted-foreground mb-4">Premium Driver Member</p>
          <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Contact Information</h2>
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-semibold">{user.profile?.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">License Information</h2>
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">License Number</p>
              <p className="font-semibold">{user.profile?.license_number || "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">License Type</p>
              <p className="font-semibold">HCV (Heavy Commercial Vehicle)</p>
            </div>
            {user.profile?.license_expiry && (
              <div className="flex items-center justify-between bg-primary-foreground/10 border border-primary rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Valid Until</p>
                  <p className="font-bold text-lg">{new Date(user.profile.license_expiry).toLocaleDateString()}</p>
                </div>
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Driver Statistics */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Trips</p>
              <p className="text-3xl font-bold">247</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Miles</p>
              <p className="text-3xl font-bold">52.3k</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Violation Points</p>
              <p className="text-3xl font-bold text-destructive">3</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Safety Rating</p>
              <p className="text-3xl font-bold text-primary">4.8/5</p>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Compliance</h2>
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Medical Fitness</p>
                  <p className="text-sm text-muted-foreground">Valid</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">✓</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-semibold">PUC Certificate</p>
                  <p className="text-sm text-muted-foreground">Expires in 30 days</p>
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
