"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("role", "driver")
          .order("created_at", { ascending: false })

        if (error) throw error
        setDrivers(data || [])
      } catch (error) {
        console.log("[v0] Error loading drivers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDrivers()
  }, [])

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "active") return `${baseStyle} bg-primary/10 text-primary`
    return `${baseStyle} bg-destructive/10 text-destructive`
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading drivers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Drivers Management</h1>
        <p className="text-muted-foreground">Manage driver profiles and compliance</p>
      </div>

      {/* Drivers Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Driver Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">License</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">License Expiry</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No drivers found
                  </td>
                </tr>
              ) : (
                drivers.map((driver, idx) => (
                  <tr key={driver.id} className={idx !== drivers.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-6 py-4 text-sm font-semibold">{driver.full_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-xs">{driver.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-xs text-muted-foreground">{driver.license_number || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-xs">
                        {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={getStatusBadge("active")}>Active</span>
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
