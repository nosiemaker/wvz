"use client"

import { useEffect, useState } from "react"
import { Fuel, User, Calendar, RotateCw } from "lucide-react"
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

    return (
        <div className="bg-white min-h-screen">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Log Fuel Entry</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Station
                        </label>
                        <input
                            type="text"
                            value={formData.station}
                            onChange={handleChange("station")}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                            placeholder="Enter station name"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={handleChange("date")}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                Odometer (km)
                            </label>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={formData.odometer}
                                onChange={handleChange("odometer")}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                                placeholder="35173"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Liters
                        </label>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            value={formData.liters}
                            onChange={handleChange("liters")}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                            placeholder="34"
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-xl bg-[#EE401D] px-4 py-3 text-sm font-black uppercase tracking-widest text-white shadow-sm transition-opacity disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Fuel Entry"}
                    </button>
                </form>
            </div>

            <div className="divide-y divide-slate-100">
                {isLoading ? (
                    <div className="p-6 text-sm font-semibold text-slate-400">Loading fuel entries...</div>
                ) : fuelEntries.length === 0 ? (
                    <div className="p-6 text-sm font-semibold text-slate-400">No fuel entries yet.</div>
                ) : (
                    fuelEntries.map((entry) => (
                        <div key={entry.id} className="p-6 flex justify-between items-start relative border-b border-slate-50">
                            <div className="space-y-3 flex-1 pr-4">
                                <div className="flex items-center gap-3">
                                    <Fuel size={22} className="text-black" />
                                    <span className="text-[19px] font-[900] italic tracking-tight text-slate-800 leading-tight">
                                        {entry.station}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 flex justify-center">
                                        <User size={18} className="text-black" />
                                    </div>
                                    <span className="text-[17px] font-[900] italic tracking-tight text-slate-700">
                                        {entry.driver_name || "Driver"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-black" />
                                    <span className="text-[15px] font-[900] italic tracking-tight text-slate-400">
                                        {new Date(entry.date).toLocaleDateString()} at {entry.odometer_km} KM
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between min-h-[100px] py-1">
                                <RotateCw size={24} className="text-[#00897B] stroke-[3px]" />
                                <div className="text-[34px] font-[900] italic text-slate-500/80 mt-auto tracking-tighter">
                                    {entry.liters} L
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
