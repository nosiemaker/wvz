"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, ChevronRight } from "lucide-react"
import { getBookings } from "@/lib/bookings"
import Link from "next/link"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings()
        setBookings(data || [])
      } catch (error) {
        console.log("[v0] Error loading bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-accent/10 text-accent"
      case "draft":
        return "bg-muted/50 text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        {/* Create Booking Button */}
        <Link href="/mobile/bookings/create">
          <button className="w-full bg-accent text-accent-foreground px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Create New Booking
          </button>
        </Link>

        {/* Bookings List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Your Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{booking.id}</p>
                    <p className="font-semibold">{booking.cost_center || "No cost center"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="font-semibold">{booking.vehicles?.registration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">{booking.status}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full text-accent font-semibold py-2 flex items-center justify-center gap-2 hover:bg-accent/10 rounded-lg transition-colors">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
