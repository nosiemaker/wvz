"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Truck, Calendar, FileText } from "lucide-react"

export default function AddVehiclePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        registration: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        color: "",
        fuelType: "diesel",
        status: "active",
        licenseRequired: "C",
        maintenanceIntervalKm: 5000
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        // In a real app: await supabase.from('vehicles').insert(formData)
        setTimeout(() => {
            setIsLoading(false)
            alert("Vehicle added successfully!")
            router.push("/admin/vehicles")
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
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
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Add New Vehicle</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Register a new vehicle into the fleet database.</p>
                </div>
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
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">VIN / Chassis No.</label>
                            <input
                                required
                                value={formData.vin}
                                onChange={e => setFormData({ ...formData, vin: e.target.value })}
                                placeholder="Enter VIN"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Make</label>
                            <input
                                required
                                value={formData.make}
                                onChange={e => setFormData({ ...formData, make: e.target.value })}
                                placeholder="e.g. Toyota"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Model</label>
                            <input
                                required
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                placeholder="e.g. Hilux"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Color</label>
                            <input
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                placeholder="e.g. White"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
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
                                value={formData.fuelType}
                                onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
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
                                value={formData.licenseRequired}
                                onChange={e => setFormData({ ...formData, licenseRequired: e.target.value })}
                                placeholder="e.g. C1"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Service Interval (KM)</label>
                            <input
                                type="number"
                                value={formData.maintenanceIntervalKm}
                                onChange={e => setFormData({ ...formData, maintenanceIntervalKm: parseInt(e.target.value) })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Initial Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="maintenance">In Maintenance</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 bg-[#EE401D] text-white rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Create Vehicle
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
