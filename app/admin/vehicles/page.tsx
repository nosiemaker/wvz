"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Truck, Check, Wrench, FileText, PlusCircle } from "lucide-react"
import { getVehicles } from "@/lib/vehicles"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles()
        setVehicles(data || [])
      } catch (error) {
        console.error("Failed to load vehicles:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "active") return `${baseStyle} bg-primary/10 text-primary`
    if (status === "maintenance") return `${baseStyle} bg-accent/10 text-accent`
    return `${baseStyle} bg-destructive/10 text-destructive`
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm font-medium text-slate-500">Loading Fleet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Vehicles Management</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium pl-4">Manage fleet vehicles and maintenance schedules.</p>
        </div>
        <Link href="/admin/vehicles/add">
          <button className="px-6 py-3 bg-[#EE401D] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle size={18} />
            Add Vehicle
          </button>
        </Link>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-[24px] border border-slate-100">
            <Truck size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">No vehicles found</h3>
            <p className="text-slate-400 text-sm">Add a vehicle to get started.</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700">
                    <Truck size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800 tracking-tight">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                      {vehicle.registration}
                      <span className="mx-2 text-slate-300">•</span>
                      {vehicle.year}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(vehicle.status || 'unknown')}>
                  {(vehicle.status || 'Unknown').charAt(0).toUpperCase() + (vehicle.status || 'unknown').slice(1)}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Mileage</p>
                  <p className="font-bold text-slate-700">{vehicle.current_mileage ? parseInt(vehicle.current_mileage).toLocaleString() : 0} KM</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Type</p>
                  <p className="font-bold text-slate-700 capitalize">{vehicle.fuel_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Color</p>
                  <p className="font-bold text-slate-700">{vehicle.color || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Service</p>
                  <p className="font-bold text-slate-700">{vehicle.next_service_date ? new Date(vehicle.next_service_date).toLocaleDateString() : 'Not Scheduled'}</p>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="pt-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Compliance Status</p>
                <div className="flex gap-2">
                  {['Road Tax', 'Insurance', 'Fitness'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
                      <Check size={12} strokeWidth={3} />
                      <span className="text-[11px] font-bold uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors">
                  <FileText size={16} />
                  View Details
                </button>
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors">
                  <Wrench size={16} />
                  Schedule Service
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
