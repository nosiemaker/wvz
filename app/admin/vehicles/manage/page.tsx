"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, Truck, Calendar, FileText, Trash2 } from "lucide-react"
import { getVehicle, updateVehicle } from "@/lib/vehicles"
import { getVehicleTrips } from "@/lib/trips"

function EditVehicleContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [trips, setTrips] = useState<any[]>([])
    const [formData, setFormData] = useState({
        registration: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        color: "",
        fuel_type: "diesel",
        status: "active",
        license_required: "C",
        maintenance_interval_km: 5000,
        current_mileage: 0,
        office: ""
    })

    useEffect(() => {
        const loadVehicle = async () => {
            if (!id) return
            try {
                const data = await getVehicle(id as string)
                if (data) {
                    setFormData({
                        registration: data.registration || "",
                        make: data.make || "",
                        model: data.model || "",
                        year: data.year || new Date().getFullYear(),
                        vin: data.vin || "",
                        color: data.color || "",
                        fuel_type: data.fuel_type || "diesel",
                        status: data.status || "active",
                        license_required: data.license_required || "C",
                        maintenance_interval_km: data.maintenance_interval_km || 5000,
                        current_mileage: data.current_mileage || 0,
                        office: data.office || ""
                    })
                }

                // Load trip history
                const tripData = await getVehicleTrips(id as string)
                if (tripData) {
                    setTrips(tripData)
                }
            } catch (error) {
                console.error("Error loading vehicle:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadVehicle()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return
        setIsSaving(true)

        try {
            const { office, ...updatePayload } = formData
            await updateVehicle(id as string, updatePayload)
            alert("Vehicle updated successfully!")
            router.push("/admin/vehicles")
        } catch (error) {
            console.error("Error updating vehicle:", error)
            alert("Failed to update vehicle. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-500">Loading Vehicle Data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Edit Vehicle</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Update vehicle technical and operational details.</p>
                    </div>
                </div>
                <button
                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-2 font-bold text-sm"
                    onClick={() => {
                        if (confirm("Are you sure you want to retire this vehicle?")) {
                            updateVehicle(id as string, { status: 'retired' }).then(() => router.push('/admin/vehicles'));
                        }
                    }}
                >
                    <Trash2 size={20} />
                    Retire Vehicle
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Details Card */}
                <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Truck size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">Vehicle Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Registration (Plate)</label>
                            <input
                                required
                                value={formData.registration}
                                onChange={e => setFormData({ ...formData, registration: e.target.value })}
                                placeholder="e.g. ABC 1234"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">VIN / Chassis No.</label>
                            <input
                                required
                                value={formData.vin}
                                onChange={e => setFormData({ ...formData, vin: e.target.value })}
                                placeholder="Enter VIN"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Make</label>
                            <input
                                required
                                value={formData.make}
                                onChange={e => setFormData({ ...formData, make: e.target.value })}
                                placeholder="e.g. Toyota"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Model</label>
                            <input
                                required
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                placeholder="e.g. Hilux"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Color</label>
                            <input
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                placeholder="e.g. White"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Office (Optional)</label>
                            <select
                                value={formData.office}
                                onChange={e => setFormData({ ...formData, office: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all appearance-none"
                            >
                                <option value="">Select office</option>
                                <option value="Lusaka">Lusaka</option>
                                <option value="Chipata">Chipata</option>
                                <option value="Ndola">Ndola</option>
                                <option value="Livingstone">Livingstone</option>
                                <option value="Kabwe">Kabwe</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Operations Card */}
                <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">Operational Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Fuel Type</label>
                            <select
                                value={formData.fuel_type}
                                onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all appearance-none"
                            >
                                <option value="diesel">Diesel</option>
                                <option value="petrol">Petrol</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Required License Class</label>
                            <input
                                value={formData.license_required}
                                onChange={e => setFormData({ ...formData, license_required: e.target.value })}
                                placeholder="e.g. C1"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Service Interval (KM)</label>
                            <input
                                type="number"
                                value={formData.maintenance_interval_km}
                                onChange={e => setFormData({ ...formData, maintenance_interval_km: parseInt(e.target.value) })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Mileage (KM)</label>
                            <input
                                type="number"
                                value={formData.current_mileage}
                                onChange={e => setFormData({ ...formData, current_mileage: parseInt(e.target.value) })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Vehicle Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="maintenance">In Maintenance</option>
                                <option value="inactive">Inactive</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-[#EE401D] text-white rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Trip History Section */}
            <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm mt-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
                            <Calendar size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">Assignment History</h3>
                    </div>
                    <span className="text-[11px] font-black bg-slate-100 text-slate-600 uppercase tracking-widest px-3 py-1 rounded-full">
                        {trips.length} Trips Total
                    </span>
                </div>

                <div className="space-y-4">
                    {trips.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold italic uppercase text-xs">No trip history found for this vehicle</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                                        <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Route / Purpose</th>
                                        <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Distance</th>
                                        <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {trips.map((trip) => {
                                        const startDate = new Date(trip.start_time)
                                        const dist = trip.end_mileage && trip.start_mileage
                                            ? trip.end_mileage - trip.start_mileage
                                            : 0

                                        return (
                                            <tr key={trip.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 font-bold text-slate-800 text-sm">
                                                    {startDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                            {trip.users?.full_name?.substring(0, 2) || "DR"}
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-sm">{trip.users?.full_name || "Unknown Driver"}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">
                                                        {trip.purpose || "Operational Trip"}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 font-medium italic mt-0.5">
                                                        {trip.start_location || "N/A"} → {trip.destination || "N/A"}
                                                    </p>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="font-black text-slate-800 text-sm">{dist}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">km</span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${trip.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                        trip.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function EditVehiclePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-500">Initializing editor...</p>
                </div>
            </div>
        }>
            <EditVehicleContent />
        </Suspense>
    )
}
