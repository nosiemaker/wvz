"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, MapPin, Calendar, Users, Car, FileText, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createTripRequest, type TripRequestData } from "@/lib/bookings"

export default function CreateBookingPage() {
  const [formData, setFormData] = useState<TripRequestData>({
    startDate: "",
    endDate: "",
    purpose: "",
    destination: "",
    passengers: 1,
    isSelfDrive: false,
    vehicleId: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Handle Checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await createTripRequest(formData)
      router.push("/mobile/bookings?success=Request submitted successfully")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <Link
          href="/mobile/bookings"
          className="inline-flex items-center gap-2 text-primary mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Trips
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-6">Request New Trip</h1>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Date</label>
              <div className="flex items-center bg-card border border-border rounded-lg px-3 py-3 focus-within:border-primary transition-colors">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-foreground text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End Date</label>
              <div className="flex items-center bg-card border border-border rounded-lg px-3 py-3 focus-within:border-primary transition-colors">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-foreground text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold mb-2">Destination</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Where are you going?"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold mb-2">Purpose of Trip</label>
            <div className="flex items-start bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <FileText className="w-5 h-5 text-muted-foreground mr-3 mt-1" />
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Why is this trip necessary?"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
                required
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-semibold mb-2">Number of Passengers</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Users className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="number"
                name="passengers"
                min="1"
                max="60"
                value={formData.passengers}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-foreground"
                required
              />
            </div>
          </div>

          {/* Self Drive Toggle */}
          <div className="flex items-center justify-between bg-card border border-border p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">Self Drive Request</p>
                <p className="text-xs text-muted-foreground">Request to drive yourself</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isSelfDrive"
                checked={formData.isSelfDrive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
