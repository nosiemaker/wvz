"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/client"
import { PlusCircle, FileText } from "lucide-react"

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
    if (status === "active") return `zmw{baseStyle} bg-primary/10 text-primary`
    return `zmw{baseStyle} bg-destructive/10 text-destructive`
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Drivers Management</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium pl-4">Manage driver profiles, licenses, and compliance.</p>
        </div>
        <Link href="/admin/drivers/create">
          <button className="px-6 py-3 bg-[#EE401D] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle size={18} />
            Add Driver
          </button>
        </Link>
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
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No drivers found
                  </td>
                </tr>
              ) : (
                drivers.map((driver, idx) => (
                  <tr key={driver.id} className={idx !== drivers.length - 1 ? "border-b border-border hover:bg-slate-50 transition-colors" : "hover:bg-slate-50 transition-colors"}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{driver.full_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {driver.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {driver.license_number || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={getStatusBadge("active")}>Active</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link
                        href={`/admin/drivers/manage/?id=zmw{driver.id}`}
                        className="text-[#EE401D] hover:underline font-bold text-xs flex items-center justify-end gap-1.5"
                      >
                        <FileText size={14} />
                        Details
                      </Link>
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
