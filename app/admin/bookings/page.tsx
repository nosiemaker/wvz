"use client"

import { useState, useEffect } from "react"
import { Check, X, ChevronRight } from "lucide-react"
import { getAllBookings, approveBooking } from "@/lib/bookings"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getAllBookings()
        setBookings(data || [])
      } catch (error) {
        console.log("[v0] Error loading bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const handleApprove = async (bookingId: string) => {
    try {
      await approveBooking(bookingId)
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b)))
    } catch (error) {
      console.log("[v0] Error approving booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-accent/10 text-accent"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">Manage vehicle bookings and approvals</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === "all" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === "pending" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === "approved" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}
        >
          Approved
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Driver</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, idx) => (
                  <tr key={booking.id} className={idx !== filteredBookings.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-6 py-4 text-sm font-semibold">{booking.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold">{booking.users?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{booking.users?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{booking.vehicles?.registration}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="p-1.5 hover:bg-primary/10 rounded text-primary"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-destructive/10 rounded text-destructive">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 hover:bg-muted rounded">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
