"use client"

import { useState } from "react"
import { Truck, Check, Wrench, FileText } from "lucide-react"

export default function VehiclesPage() {
  const [vehicles] = useState([
    {
      id: "VH-001",
      registration: "WRJ 2024",
      type: "Toyota Hiace",
      status: "active",
      lastMaintenance: "2025-11-15",
      nextMaintenance: "2025-12-15",
      roadTax: "Valid",
      insurance: "Valid",
      fitness: "Valid",
      currentKm: 45820,
    },
    {
      id: "VH-002",
      registration: "MH-02-AB-1234",
      type: "Tata 407",
      status: "maintenance",
      lastMaintenance: "2025-11-10",
      nextMaintenance: "2025-11-25",
      roadTax: "Valid",
      insurance: "Valid",
      fitness: "Valid",
      currentKm: 32250,
    },
    {
      id: "VH-003",
      registration: "MH-05-CD-5678",
      type: "Mahindra Bolero",
      status: "active",
      lastMaintenance: "2025-11-20",
      nextMaintenance: "2025-12-20",
      roadTax: "Expires in 15 days",
      insurance: "Valid",
      fitness: "Valid",
      currentKm: 28500,
    },
  ])

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "active") return `${baseStyle} bg-primary/10 text-primary`
    if (status === "maintenance") return `${baseStyle} bg-accent/10 text-accent`
    return `${baseStyle} bg-destructive/10 text-destructive`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicles Management</h1>
        <p className="text-muted-foreground">Manage fleet vehicles and maintenance</p>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-card border border-border rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Truck className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">{vehicle.type}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.registration}</p>
                </div>
              </div>
              <span className={getStatusBadge(vehicle.status)}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Current KM</p>
                <p className="font-semibold">{vehicle.currentKm.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold">{vehicle.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Maintenance</p>
                <p className="font-semibold">{new Date(vehicle.lastMaintenance).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Maintenance</p>
                <p className="font-semibold">{new Date(vehicle.nextMaintenance).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Compliance Status</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Road Tax</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Insurance</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Fitness</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                View Details
              </button>
              <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-semibold flex items-center justify-center gap-2">
                <Wrench className="w-4 h-4" />
                Schedule Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
