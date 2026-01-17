"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Truck, Check, Wrench, FileText, PlusCircle, Search,
  MoreHorizontal, ChevronDown, Filter, Settings,
  ChevronLeft, ChevronRight, Eye, User, Info, AlertCircle
} from "lucide-react"
import { getVehicles } from "@/lib/vehicles"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")

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

  const getStatusIndicator = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "active") return <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Active</div>
    if (s === "maintenance" || s === "in shop") return <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>In Shop</div>
    if (s === "out of service") return <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Out of Service</div>
    return <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Inactive</div>
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchStr = searchTerm.toLowerCase()
    const matchesSearch = (
      vehicle.registration?.toLowerCase().includes(searchStr) ||
      vehicle.make?.toLowerCase().includes(searchStr) ||
      vehicle.model?.toLowerCase().includes(searchStr)
    )

    if (activeTab === "All") return matchesSearch
    if (activeTab === "Assigned") return matchesSearch && vehicle.status === "active"
    if (activeTab === "Unassigned") return matchesSearch && vehicle.status !== "active"
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#EE401D]/20 border-t-[#EE401D] rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Initializing Fleet Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1 text-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Vehicles</h1>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Info size={12} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Learn</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-all">
            <MoreHorizontal size={18} />
          </button>
          <Link href="/admin/vehicles/add">
            <button className="px-5 py-2.5 bg-[#EE401D] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:shadow-xl hover:translate-y-[-1px] active:scale-95 transition-all flex items-center gap-2 italic">
              <PlusCircle size={16} />
              Add Vehicle
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 pb-0 px-2">
        {["All", "Assigned", "Unassigned", "Archived"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EE401D] rounded-full"></div>
            )}
          </button>
        ))}
        <button className="pb-3 text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 italic">
          <PlusCircle size={14} />
          Add Tab
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {["Vehicle Type", "Office Location", "Vehicle Status", "Watcher"].map((filter) => (
              <button key={filter} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
                {filter}
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            ))}
            <button className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-200 transition-all italic">
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1 - {filteredVehicles.length} of {vehicles.length}</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button className="p-1.5 hover:bg-slate-50 disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            <button className="p-1.5 hover:bg-slate-50 disabled:opacity-30" disabled><ChevronRight size={16} /></button>
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
            <Settings size={16} />
          </button>
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-50">
            Save View
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-[#EE401D] focus:ring-[#EE401D]" />
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-1 group cursor-pointer hover:text-slate-900 transition-colors">
                    Name <ChevronDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Year</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Make</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Model</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">VIN</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Type</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Office Location</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Current Meter</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-right">Plate</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle size={48} className="text-slate-200 mb-4" />
                      <h3 className="text-sm font-black italic uppercase text-slate-800 tracking-tight">No Vehicles Encountered</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-[#EE401D] focus:ring-[#EE401D]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-[#EE401D] transition-all">
                          <Truck size={20} />
                        </div>
                        <div className="flex flex-col">
                          <Link href={"/admin/vehicles/manage/?id=" + vehicle.id} className="text-[13px] font-bold text-slate-900 hover:text-[#EE401D] transition-colors leading-none">
                            {vehicle.registration}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">[{vehicle.year} {vehicle.make} {vehicle.model}]</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-[8px] font-black text-slate-400 rounded uppercase tracking-widest">Sample</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{vehicle.year || "2024"}</td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{vehicle.make}</td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{vehicle.model}</td>
                    <td className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tight font-mono">{vehicle.vin || 'JTDKBRFU9...359307'}</td>
                    <td className="px-4 py-4">{getStatusIndicator(vehicle.status)}</td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{vehicle.type || (vehicle.registration?.includes('M/B') ? 'Motorcycle' : 'SUV')}</td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{vehicle.office || 'Project Fleet'}</td>
                    <td className="px-4 py-4 text-[11px] font-bold text-slate-800">
                      {vehicle.current_mileage ? parseInt(vehicle.current_mileage).toLocaleString() : '0'} <span className="text-slate-400 ml-0.5">KM</span>
                    </td>
                    <td className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right italic">{vehicle.registration}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={"/admin/vehicles/manage/?id=" + vehicle.id} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-[#EE401D] transition-all">
                          <Eye size={16} />
                        </Link>
                        <Link href={"/admin/vehicles/manage/?id=" + vehicle.id + "&section=service"} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-emerald-500 transition-all">
                          <Wrench size={16} />
                        </Link>
                        <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                          <MoreHorizontal size={16} />
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

      {/* Footer Info */}
      <div className="px-2 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[2px] italic">
        <span>Last updated: {new Date().toLocaleDateString()}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Asset Operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            <span>Service Required</span>
          </div>
        </div>
      </div>
    </div>
  )
}
