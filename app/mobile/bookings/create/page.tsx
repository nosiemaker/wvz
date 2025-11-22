"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Calendar, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBooking } from "@/lib/bookings"
import { getVehicles } from "@/lib/vehicles"

export default function CreateBookingPage() {
  const [formData, setFormData] = useState({
    date: "",
    origin: "",
    destination: "",
    vehicle: "",
    costCenter: "",
  })
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles()
        setVehicles(data || [])
      } catch (err) {
        console.log("[v0] Error loading vehicles:", err)
        setError("Failed to load vehicles")
      } finally {
        setIsLoadingVehicles(false)
      }
    }

    loadVehicles()
  }, [])

  const costCenters = ["CC-001", "CC-002", "CC-003"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await createBooking(formData.vehicle, formData.date, formData.date, formData.costCenter)
      router.push("/mobile/bookings?success=Booking created successfully")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingVehicles) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading vehicles...</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <Link
          href="/mobile/bookings"
          className="inline-flex items-center gap-2 text-accent mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Bookings
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Travel Date</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-foreground"
                required
              />
            </div>
          </div>

          {/* Origin */}
          <div>
            <label className="block text-sm font-semibold mb-2">Origin</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Pickup location"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
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
                placeholder="Drop-off location"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Select Vehicle</label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary outline-none transition-colors"
              required
            >
              <option value="">Choose a vehicle...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} - {v.registration}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Center */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cost Center</label>
            <select
              name="costCenter"
              value={formData.costCenter}
              onChange={handleChange}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary outline-none transition-colors"
              required
            >
              <option value="">Select cost center...</option>
              {costCenters.map((cc) => (
                <option key={cc} value={cc}>
                  {cc}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Booking"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
