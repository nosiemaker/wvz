"use client"

import { useEffect, useState } from "react"
import { Fuel, User, Calendar, RotateCw, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/client"

interface FuelEntry {
    id: string
    station: string
    driver_name: string | null
    date: string
    odometer_km: number
    liters: number
}

type FuelFormState = {
    station: string
    date: string
    odometer: string
    liters: string
}

export default function FuelPage() {
    const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([])
    const [formData, setFormData] = useState<FuelFormState>({
        station: "",
        date: "",
        odometer: "",
        liters: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showCardDetails, setShowCardDetails] = useState(false)

    useEffect(() => {
        const loadFuelEntries = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("fuel_entries")
                    .select("id, station, driver_name, date, odometer_km, liters")
                    .order("date", { ascending: false })

                if (error) throw error
                setFuelEntries(data || [])
            } catch (error: any) {
                console.error("Error loading fuel entries:", error)
                setErrorMessage("Failed to load fuel entries")
            } finally {
                setIsLoading(false)
            }
        }

        loadFuelEntries()
    }, [])

    const handleChange = (field: keyof FuelFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setErrorMessage(null)

        const station = formData.station.trim()
        const odometerValue = Number(formData.odometer)
        const litersValue = Number(formData.liters)

        if (!station || !formData.date || !formData.odometer || !formData.liters) {
            setErrorMessage("Please fill in all fields")
            return
        }

        if (Number.isNaN(odometerValue) || Number.isNaN(litersValue)) {
            setErrorMessage("Odometer and liters must be valid numbers")
            return
        }

        setIsSaving(true)
        try {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                throw new Error("Not authenticated")
            }

            const driverName =
                user.user_metadata?.full_name ||
                (user.email ? user.email.split("@")[0] : "") ||
                "User"

            const { data, error } = await supabase
                .from("fuel_entries")
                .insert({
                    station: station,
                    driver_name: driverName,
                    date: formData.date,
                    odometer_km: odometerValue,
                    liters: litersValue,
                    user_id: user.id,
                })
                .select("id, station, driver_name, date, odometer_km, liters")
                .single()

            if (error) throw error

            if (data) {
                setFuelEntries((prev) => [data, ...prev])
            }

            setFormData({
                station: "",
                date: "",
                odometer: "",
                liters: "",
            })
        } catch (error: any) {
            console.error("Error saving fuel entry:", error)
            setErrorMessage(error.message || "Failed to save fuel entry")
        } finally {
            setIsSaving(false)
        }
    }

    // Puma Fuel Card Component
    const FuelCard = () => (
        <div className="p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-400 italic">Electronic Fuel Card</h3>
                <button
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="p-2 bg-white rounded-full shadow-sm active:scale-95 transition-all text-slate-600 border border-slate-100"
                >
                    {showCardDetails ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="relative w-full aspect-[1.58/1] bg-white rounded-[20px] shadow-xl overflow-hidden border border-slate-100">
                {/* Left Red Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#EE401D]"></div>

                {/* Background Watermark (Cougar silhouette approximation) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <svg viewBox="0 0 200 100" className="w-[80%] h-auto rotate-[-5deg]">
                        <path d="M10,50 C30,20 80,30 100,50 C120,70 170,60 190,40 C170,80 120,90 100,70 C80,50 30,60 10,50" fill="currentColor" />
                    </svg>
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Card Top Row */}
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">Fuelling Zambia</span>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                                <span className="text-[12px] font-black italic tracking-tighter text-[#00897B]">PUMA</span>
                                <div className="w-6 h-3 bg-[#EE401D] rounded-sm flex items-center justify-center overflow-hidden">
                                    <div className="w-4 h-1 bg-white rounded-full rotate-[-20deg]"></div>
                                </div>
                            </div>
                            <span className="text-[6px] font-black tracking-[3px] text-slate-300 uppercase mt-0.5">C A R D</span>
                        </div>
                    </div>

                    {/* Card Number Section */}
                    <div className="mt-4">
                        <div className="text-[22px] font-black italic tracking-[2px] text-[#2C3E50] leading-tight">
                            {showCardDetails ? "4582 9103 4472 8816" : "•••• •••• •••• 8816"}
                        </div>
                        <div className="text-[8px] font-black text-slate-300 tracking-[1px] mt-1 ml-1 uppercase">
                            WVZ FLEET SERVICES
                        </div>
                    </div>

                    {/* Card Bottom Row */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-0">
                            <div className="text-[11px] font-black text-slate-400 tracking-wide uppercase">
                                {showCardDetails ? "001197507" : "•••••••••"}
                            </div>
                            <div className="text-[11px] font-black text-[#2C3E50] tracking-tight uppercase leading-snug">
                                WORLD VISION ZAMBIA
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-[#2C3E50] tracking-tighter italic uppercase">
                                DEC 28
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest italic">
                {showCardDetails ? "Details Visible - Secure individual identification" : "Details Hidden - Tap eye icon to reveal"}
            </p>
        </div>
    )

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Fuel Card Section */}
            <FuelCard />

            <div className="h-2 bg-slate-100/50"></div>

            <div className="p-6 border-b border-slate-100 bg-white">
                <h2 className="text-[18px] font-black text-slate-800 tracking-tight italic uppercase">Log Fuel Entry</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 italic">
                            Station
                        </label>
                        <input
                            type="text"
                            value={formData.station}
                            onChange={handleChange("station")}
                            className="w-full rounded-2xl border-2 border-slate-100 px-4 py-3 text-sm font-[900] text-slate-700 outline-none focus:border-[#EE401D]/20 transition-all placeholder:text-slate-300"
                            placeholder="e.g. Puma Service Station"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 italic">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={handleChange("date")}
                                className="w-full rounded-2xl border-2 border-slate-100 px-4 py-3 text-sm font-[900] text-slate-700 outline-none focus:border-[#EE401D]/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 italic">
                                Odometer
                            </label>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={formData.odometer}
                                onChange={handleChange("odometer")}
                                className="w-full rounded-2xl border-2 border-slate-100 px-4 py-3 text-sm font-[900] text-slate-700 outline-none focus:border-[#EE401D]/20 transition-all placeholder:text-slate-300"
                                placeholder="35173"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 italic">
                            Liters
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                value={formData.liters}
                                onChange={handleChange("liters")}
                                className="w-full rounded-2xl border-2 border-slate-100 pl-4 pr-12 py-3 text-sm font-[900] text-slate-700 outline-none focus:border-[#EE401D]/20 transition-all placeholder:text-slate-300"
                                placeholder="34.5"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 italic">L</span>
                        </div>
                    </div>
                    {errorMessage && (
                        <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-2xl bg-[#EE401D] px-4 py-4 text-sm font-black uppercase tracking-[2px] text-white shadow-lg shadow-[#EE401D]/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 italic"
                    >
                        {isSaving ? "Saving..." : (
                            <>
                                <Fuel size={18} />
                                <span>Save Fuel Entry</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="p-6 bg-slate-50/30">
                <h2 className="text-[14px] font-black text-slate-400 tracking-widest italic uppercase mb-4">Recent History</h2>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="p-6 text-sm font-semibold text-slate-400 flex items-center gap-2">
                            <RotateCw size={16} className="animate-spin" />
                            Loading fuel entries...
                        </div>
                    ) : fuelEntries.length === 0 ? (
                        <div className="p-6 text-sm font-semibold text-slate-400">No fuel entries yet.</div>
                    ) : (
                        fuelEntries.map((entry) => (
                            <div key={entry.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex justify-between items-center group">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                            <Fuel size={16} className="text-[#EE401D]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[15px] font-[900] italic tracking-tight text-slate-800 leading-none">
                                                {entry.station}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-10">
                                        <div className="flex items-center gap-1.5">
                                            <User size={12} className="text-slate-300" />
                                            <span className="text-[11px] font-black text-slate-400 uppercase italic">
                                                {entry.driver_name?.split(' ')[0] || "User"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <RotateCw size={12} className="text-slate-300" />
                                            <span className="text-[11px] font-black text-slate-400 uppercase italic">
                                                {entry.odometer_km} KM
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[24px] font-[900] italic text-slate-300 group-hover:text-[#EE401D] transition-colors tracking-tighter">
                                        {entry.liters}<span className="text-[12px] ml-0.5 uppercase">L</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
