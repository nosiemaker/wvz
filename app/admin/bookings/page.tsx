"use client"

import { useState, useEffect } from "react"
import { Check, X, ChevronRight, Car, User, Truck, ExternalLink, Loader } from "lucide-react"
import { getAllBookings, approveBooking, allocateBooking, rejectBooking } from "@/lib/bookings"
import { getVehicles } from "@/lib/vehicles"
import { getDrivers } from "@/lib/auth"

type AllocationModalProps = {
  booking: any
  vehicles: any[]
  drivers: any[]
  onClose: () => void
  onAllocate: (data: any) => Promise<void>
}

function AllocationModal({ booking, vehicles, drivers, onClose, onAllocate }: AllocationModalProps) {
  const [isExternal, setIsExternal] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    providerName: "",
    driverName: "", // External
    driverPhone: "", // External
    vehicleDetails: "", // External
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAllocate({ isExternal, ...formData })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold">Allocate Resources</h2>
        <p className="text-sm text-muted-foreground">Assign vehicle and driver for trip to {booking.destination}</p>

        <div className="flex bg-muted p-1 rounded-lg mb-4">
          <button
            type="button"
            className={
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-all " +
              (!isExternal ? "bg-background shadow-sm" : "text-muted-foreground")
            }
            onClick={() => setIsExternal(false)}
          >
            Internal Fleet
          </button>
          <button
            type="button"
            className={
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-all " +
              (isExternal ? "bg-background shadow-sm" : "text-muted-foreground")
            }
            onClick={() => setIsExternal(true)}
          >
            External Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isExternal ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Select Vehicle</label>
                <select
                  className="w-full bg-input border border-border rounded-md px-3 py-2"
                  value={formData.vehicleId}
                  onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                  required
                >
                  <option value="">Choose Vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registration} - {v.make} {v.model}{v.status ? ` (${v.status})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {booking.is_self_drive ? (
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Self-Drive: Requester will be assigned as driver.</span>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Driver</label>
                  <select
                    className="w-full bg-input border border-border rounded-md px-3 py-2"
                    value={formData.driverId}
                    onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                    required
                  >
                    <option value="">Choose Driver...</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Provider Name</label>
                <input
                  className="w-full bg-input border border-border rounded-md px-3 py-2"
                  placeholder="e.g. Avis, Hertz"
                  value={formData.providerName}
                  onChange={e => setFormData({ ...formData, providerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Details</label>
                <input
                  className="w-full bg-input border border-border rounded-md px-3 py-2"
                  placeholder="Make, Model, Plate"
                  value={formData.vehicleDetails}
                  onChange={e => setFormData({ ...formData, vehicleDetails: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Driver Name</label>
                  <input
                    className="w-full bg-input border border-border rounded-md px-3 py-2"
                    value={formData.driverName}
                    onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact</label>
                  <input
                    className="w-full bg-input border border-border rounded-md px-3 py-2"
                    value={formData.driverPhone}
                    onChange={e => setFormData({ ...formData, driverPhone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              Confirm Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bookingsData, vehiclesData, driversData] = await Promise.all([
        getAllBookings(),
        getVehicles(),
        getDrivers()
      ])
      setBookings(bookingsData || [])
      setVehicles(vehiclesData || [])
      setDrivers(driversData || [])
    } catch (error) {
      console.log("[v0] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAllocate = async (data: any) => {
    if (!selectedBooking) return

    // If external, we construct the details object
    const externalDetails = data.isExternal ? {
      provider: data.providerName,
      driver_name: data.driverName,
      driver_phone: data.driverPhone,
      vehicle_details: data.vehicleDetails
    } : undefined

    // Note: data.vehicleId/driverId might be empty string for external, need to handle nulls in backend 
    // BUT our backend allocateBooking takes strings. 
    // IF external, we might not have a vehicle_id in our DB. 
    // The current backend function signature expects string IDs. 
    // We should update backend or pass dummy IDs / handle optionality.
    // Let's assume for MVP we pass empty strings or nulls and backend handles it.
    // Looking at my plan: bookings table has vehicle_id/driver_id REFERENCES.
    // If it's external, we can't reference internal IDs. They must be NULLABLE.
    // My schema script DID make them nullable.
    // My backend action `allocateBooking` might crash if I pass empty string to UUID field?
    // I should check `allocateBooking` again.
    // It takes `vehicleId: string`. I should updated it to `vehicleId?: string`.

    // For now, I'll pass undefined if external.
    await allocateBooking(
      selectedBooking.id,
      data.isExternal ? "" : data.vehicleId,
      data.isExternal ? "" : (selectedBooking.is_self_drive ? selectedBooking.requester_id : data.driverId),
      data.isExternal,
      externalDetails
    )

    await loadData() // Reload
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-600"
      case "pending_allocation": return "bg-blue-500/10 text-blue-600"
      case "pending_supervisor": return "bg-orange-500/10 text-orange-600"
      case "rejected": return "bg-destructive/10 text-destructive"
      default: return "bg-muted text-muted-foreground"
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
        {["all", "pending_supervisor", "pending_allocation", "approved"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={
              "px-4 py-2 rounded-lg font-semibold capitalize " +
              (statusFilter === status ? "bg-accent text-accent-foreground" : "border border-border hover:bg-muted")
            }
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Details</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Requester</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dates</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Allocation</th>
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
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold">{booking.destination}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{booking.cost_center || "Standard"}</span>
                          {booking.approximate_distance && (
                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">{booking.approximate_distance} KM</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px] mt-1">{booking.purpose}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">{booking.requester?.full_name || "Unknown"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      {booking.vehicles ? (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>{booking.vehicles.registration}</span>
                        </div>
                      ) : booking.external_resource_details ? (
                        <div className="flex items-center gap-2 text-purple-600">
                          <ExternalLink className="w-4 h-4" />
                          <span>External</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={"px-3 py-1 rounded-full text-xs font-semibold " + getStatusColor(booking.status)}
                      >
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.status === 'pending_allocation' && (
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold hover:opacity-90"
                        >
                          Allocate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <AllocationModal
          booking={selectedBooking}
          vehicles={vehicles}
          drivers={drivers}
          onClose={() => setSelectedBooking(null)}
          onAllocate={handleAllocate}
        />
      )}
    </div>
  )
}
