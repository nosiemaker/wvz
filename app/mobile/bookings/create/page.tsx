"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ArrowLeft, MapPin, Calendar, Users, Car, FileText, Loader, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createTripRequest, type TripRequestData } from "@/lib/bookings"
import { getCurrentUser } from "@/lib/auth"
import "leaflet/dist/leaflet.css"

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false })

type MapPick = { lat: number; lng: number }

export default function CreateBookingPage() {
  const [formData, setFormData] = useState<TripRequestData>({
    startDate: "",
    endDate: "",
    purpose: "",
    startLocation: "",
    destination: "",
    passengers: 1,
    isSelfDrive: false,
    vehicleId: undefined,
    costCenter: "",
  })

  const [canDrive, setCanDrive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [startSearchQuery, setStartSearchQuery] = useState("")
  const [startSearchResults, setStartSearchResults] = useState<any[]>([])
  const [startPos, setStartPos] = useState<MapPick | null>(null)
  const [startSearchLoading, setStartSearchLoading] = useState(false)
  const [startReverseLoading, setStartReverseLoading] = useState(false)

  const [destSearchQuery, setDestSearchQuery] = useState("")
  const [destSearchResults, setDestSearchResults] = useState<any[]>([])
  const [destPos, setDestPos] = useState<MapPick | null>(null)
  const [destSearchLoading, setDestSearchLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [reverseLoading, setReverseLoading] = useState(false)
  const [roadDistance, setRoadDistance] = useState<number | null>(null)
  const [distanceLoading, setDistanceLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser()
      if (user?.profile?.can_drive) {
        setCanDrive(true)
      }
    }
    checkUser()
  }, [])

  const startMapCenter = useMemo(() => {
    if (startPos) return [startPos.lat, startPos.lng] as [number, number]
    return [-15.4167, 28.2833] as [number, number]
  }, [startPos])

  const destMapCenter = useMemo(() => {
    if (destPos) return [destPos.lat, destPos.lng] as [number, number]
    return [-15.4167, 28.2833] as [number, number]
  }, [destPos])

  useEffect(() => {
    const fetchRoadDistance = async () => {
      if (!startPos || !destPos) {
        setRoadDistance(null)
        return
      }

      setDistanceLoading(true)
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startPos.lng},${startPos.lat};${destPos.lng},${destPos.lat}?overview=false`
        const res = await fetch(url)
        const data = await res.json()

        if (data.routes && data.routes.length > 0) {
          // OSRM returns distance in meters
          const km = Math.round((data.routes[0].distance / 1000) * 10) / 10
          setRoadDistance(km)
        }
      } catch (err) {
        console.error("Failed to fetch road distance:", err)
      } finally {
        setDistanceLoading(false)
      }
    }

    fetchRoadDistance()
  }, [startPos, destPos])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

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
      await createTripRequest({
        ...formData,
        approximateDistance: roadDistance || undefined
      })
      router.push("/mobile/bookings?success=Request submitted successfully")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartSearch = async () => {
    const term = startSearchQuery.trim()
    if (!term) return
    setStartSearchLoading(true)
    try {
      const res = await fetch(
        "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" +
        encodeURIComponent(term)
      )
      const data = await res.json()
      setStartSearchResults(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Search failed:", err)
    } finally {
      setStartSearchLoading(false)
    }
  }

  const handleSelectStartResult = async (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setStartPos({ lat, lng })
    setFormData((prev) => ({ ...prev, startLocation: result.display_name || prev.startLocation }))
    setStartSearchResults([])
  }

  const handleStartMapSelect = async (pos: MapPick) => {
    setStartPos(pos)
    setStartReverseLoading(true)
    try {
      const res = await fetch(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
        encodeURIComponent(String(pos.lat)) +
        "&lon=" +
        encodeURIComponent(String(pos.lng))
      )
      const data = await res.json()
      if (data && data.display_name) {
        setFormData((prev) => ({ ...prev, startLocation: data.display_name }))
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err)
    } finally {
      setStartReverseLoading(false)
    }
  }

  const handleDestSearch = async () => {
    const term = destSearchQuery.trim()
    if (!term) return
    setSearchLoading(true)
    try {
      const res = await fetch(
        "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" +
        encodeURIComponent(term)
      )
      const data = await res.json()
      setDestSearchResults(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Search failed:", err)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectDestResult = async (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setDestPos({ lat, lng })
    setFormData((prev) => ({ ...prev, destination: result.display_name || prev.destination }))
    setDestSearchResults([])
  }

  const handleDestMapSelect = async (pos: MapPick) => {
    setDestPos(pos)
    setReverseLoading(true)
    try {
      const res = await fetch(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
        encodeURIComponent(String(pos.lat)) +
        "&lon=" +
        encodeURIComponent(String(pos.lng))
      )
      const data = await res.json()
      if (data && data.display_name) {
        setFormData((prev) => ({ ...prev, destination: data.display_name }))
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err)
    } finally {
      setReverseLoading(false)
    }
  }

  return (
    <div className="pb-40">
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

          {/* Start Location */}
          <div>
            <label className="block text-sm font-semibold mb-2">Start Location</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation || ""}
                onChange={handleChange}
                placeholder="Where are you starting from?"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={startSearchQuery}
                  onChange={(e) => setStartSearchQuery(e.target.value)}
                  placeholder="Search start location"
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2 outline-none text-foreground"
                />
                <button
                  type="button"
                  onClick={handleStartSearch}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                >
                  {startSearchLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {startSearchResults.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-2">
                  {startSearchResults.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => handleSelectStartResult(result)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm"
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 rounded-lg overflow-hidden border border-border mb-6">
              <MapPicker center={startMapCenter} selectedPos={startPos} onSelect={handleStartMapSelect} />
              <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/30">
                {startReverseLoading ? "Finding address..." : "Tap on the map to pick a start location."}
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
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  placeholder="Search on map (e.g. Lusaka Central)"
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2 outline-none text-foreground"
                />
                <button
                  type="button"
                  onClick={handleDestSearch}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {destSearchResults.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-2">
                  {destSearchResults.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => handleSelectDestResult(result)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm"
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 rounded-lg overflow-hidden border border-border mb-6">
              <MapPicker center={destMapCenter} selectedPos={destPos} onSelect={handleDestMapSelect} />
              <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/30">
                {reverseLoading ? "Finding address..." : "Tap on the map to pick a destination."}
              </div>
            </div>
          </div>

          {(roadDistance !== null || distanceLoading) && (
            <div className="bg-card border border-border rounded-lg p-4 text-sm">
              <p className="font-semibold">Approximate Road Distance</p>
              {distanceLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Loader className="w-3 h-3 animate-spin" />
                  <span>Calculating route...</span>
                </div>
              ) : (
                <p className="text-muted-foreground">{roadDistance} km</p>
              )}
            </div>
          )}

          {/* Cost Center */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cost Center</label>
            <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
              <Briefcase className="w-5 h-5 text-muted-foreground mr-3" />
              <select
                name="costCenter"
                value={formData.costCenter}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-foreground"
                required
              >
                <option value="">Select Cost Center / Project</option>
                <option value="Administration">Administration</option>
                <option value="Operations">Operations</option>
                <option value="Grant-Health-2025">Grant - Health 2025</option>
                <option value="Grant-Education-2025">Grant - Education 2025</option>
                <option value="Emergency-Response">Emergency Response</option>
                <option value="HR">Human Resources</option>
              </select>
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

          {/* Self Drive Toggle - Conditional */}
          {canDrive && (
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
          )}

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
