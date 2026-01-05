"use client"

import { useState, useEffect } from "react"
import { MapPin, Truck, Play, ChevronRight, Hash, Compass, Target, Calendar, Clock, History } from "lucide-react"
import { getMyAssignedBookings } from "@/lib/bookings"
import { getActiveTrips, startTrip } from "@/lib/trips"
import { useRouter } from "next/navigation"

export default function DriverDashboard() {
    const [assignedBookings, setAssignedBookings] = useState<any[]>([])
    const [activeTrip, setActiveTrip] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Form states matching screenshot
    const [vehicleId, setVehicleId] = useState("")
    const [mileage, setMileage] = useState("")
    const [fromLocation, setFromLocation] = useState("")
    const [toLocation, setToLocation] = useState("")
    const [purpose, setPurpose] = useState("")

    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const [bookings, trips] = await Promise.all([
                    getMyAssignedBookings(),
                    getActiveTrips()
                ])
                setAssignedBookings(bookings || [])
                const currentActive = trips && trips.length > 0 ? trips[0] : null
                setActiveTrip(currentActive)

                // If there's an assigned booking, pre-fill some fields
                if (bookings && bookings.length > 0 && !currentActive) {
                    setVehicleId(bookings[0].vehicles?.registration || "")
                    setPurpose(bookings[0].purpose || "")
                    setFromLocation("Office") // Default or from booking
                    setToLocation(bookings[0].destination || "")
                }
            } catch (error) {
                console.log("Error loading data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const handleStartTrip = async () => {
        if (!vehicleId || !mileage) {
            alert("Please fill in at least Vehicle ID and Mileage")
            return
        }

        try {
            // Find the vehicle in assigned bookings to get ID
            const booking = assignedBookings.find(b => b.vehicles?.registration === vehicleId)
            const vId = booking?.vehicle_id || "7806fbe4-3c82-491c-9ef4-d36c57917ec7" // fallback for demo

            await startTrip({
                vehicleId: vId,
                bookingId: booking?.id,
                startMileage: parseInt(mileage),
                startLocation: fromLocation,
                destination: toLocation,
                purpose: purpose
            })

            router.push("/mobile/trips")
        } catch (error) {
            console.error("Start trip failed:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EE401D]"></div>
            </div>
        )
    }

    if (activeTrip) {
        return (
            <div className="bg-[#F8F9FA] min-h-[calc(100vh-120px)] p-6">
                <div className="bg-[#3E2723] rounded-[32px] shadow-2xl p-8 space-y-8 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-4 -translate-y-8 -z-0"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-white tracking-tight">Active Trip</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-[2px]">In Progress</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <MapPin className="text-white w-7 h-7" />
                        </div>
                    </div>

                    <div className="relative z-10 space-y-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-[24px] p-5 border border-white/10 flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Truck size={24} className="text-[#3E2723]" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[2px] font-black text-white/40">Vehicle Registration</p>
                                <p className="text-lg font-black text-white tracking-wider">{activeTrip.vehicles?.registration || "BAA 1234"}</p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-[24px] p-5 border border-white/10 flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Target size={24} className="text-[#3E2723]" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[2px] font-black text-white/40">Destination</p>
                                <p className="text-lg font-black text-white tracking-wider">{activeTrip.destination || "Lusaka Office"}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/mobile/trips")}
                        className="relative z-10 w-full py-5 bg-[#EE401D] text-white rounded-[24px] font-black text-[16px] shadow-2xl shadow-red-900/40 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                    >
                        MANAGE TRIP
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-full">
            {/* Main Form Section - Matching Screenshot 2 */}
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    {/* Vehicle Registration Input */}
                    <div className="bg-white rounded-full border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center px-6 h-[64px] focus-within:ring-2 focus-within:ring-[#EE401D]/20 transition-all">
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mb-0.5">Vehicle Registration</span>
                            <input
                                type="text"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-200 focus:outline-none text-[16px] tracking-tight uppercase"
                                placeholder="e.g. CAA 1234"
                                value={vehicleId}
                                onChange={(e) => setVehicleId(e.target.value)}
                            />
                        </div>
                        <Hash className="text-[#EE401D] w-5 h-5 opacity-80" />
                    </div>

                    {/* Start Odometer Input */}
                    <div className="bg-white rounded-full border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center px-6 h-[64px] focus-within:ring-2 focus-within:ring-[#EE401D]/20 transition-all">
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mb-0.5">Start Odometer</span>
                            <input
                                type="number"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-200 focus:outline-none text-[16px] tracking-tight"
                                placeholder="000.00"
                                value={mileage}
                                onChange={(e) => setMileage(e.target.value)}
                            />
                        </div>
                        <Compass className="text-[#EE401D] w-5 h-5 opacity-80" />
                    </div>

                    {/* Locations Grid - Split into two rows but matched rounded style */}
                    <div className="bg-white rounded-full border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center px-6 h-[64px] focus-within:ring-2 focus-within:ring-[#EE401D]/20 transition-all">
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mb-0.5">From Location</span>
                            <input
                                type="text"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-200 focus:outline-none text-[16px] tracking-tight"
                                placeholder="Current position"
                                value={fromLocation}
                                onChange={(e) => setFromLocation(e.target.value)}
                            />
                        </div>
                        <MapPin className="text-[#EE401D] w-5 h-5 opacity-80" />
                    </div>

                    <div className="bg-white rounded-full border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center px-6 h-[64px] focus-within:ring-2 focus-within:ring-[#EE401D]/20 transition-all">
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mb-0.5">To Location</span>
                            <input
                                type="text"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-200 focus:outline-none text-[16px] tracking-tight"
                                placeholder="Destination"
                                value={toLocation}
                                onChange={(e) => setToLocation(e.target.value)}
                            />
                        </div>
                        <Target className="text-[#EE401D] w-5 h-5 opacity-80" />
                    </div>

                    {/* Purpose Input */}
                    <div className="bg-white rounded-full border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center px-6 h-[64px] focus-within:ring-2 focus-within:ring-[#EE401D]/20 transition-all">
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mb-0.5">Purpose</span>
                            <input
                                type="text"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-200 focus:outline-none text-[16px] tracking-tight"
                                placeholder="Official Business"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                            />
                        </div>
                        <Play className="text-[#EE401D] w-5 h-5 opacity-80" />
                    </div>
                </div>

                {/* Start Trip Button - Brown Gradient */}
                <button
                    onClick={handleStartTrip}
                    className="w-full h-[64px] bg-gradient-to-r from-[#795548] to-[#3E2723] text-white rounded-full font-black text-[18px] shadow-2xl shadow-brown-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[2px]"
                >
                    <Play fill="currentColor" size={24} />
                    START TRIP
                </button>
            </div>

            {/* Assignments Section - Matching Screenshot 3 */}
            <div className="px-6 pb-24 mt-4">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                        <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[2px]">Pending Assignments</h3>
                    </div>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-inner">
                        {assignedBookings.length} Trips
                    </span>
                </div>

                <div className="space-y-5">
                    {assignedBookings.length > 0 ? assignedBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-[32px] border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 space-y-5 relative overflow-hidden group">
                            {/* Accent shape */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 -z-0"></div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2.5 text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase tracking-wider">{new Date(booking.start_date).toLocaleDateString()}</span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase tracking-wider">08:00 AM</span>
                                    </div>
                                    <h4 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">{booking.destination || "Lusaka"}</h4>
                                </div>
                                <div className="bg-[#EE401D]/10 text-[#EE401D] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {booking.status}
                                </div>
                            </div>

                            <div className="relative z-10 bg-slate-50 rounded-[20px] p-4 flex items-start gap-3.5 border border-slate-100/50">
                                <History className="text-slate-300 w-5 h-5 mt-0.5" />
                                <p className="text-[13px] text-slate-500 font-bold italic leading-relaxed">
                                    {booking.purpose || "Official field operation follow up and vehicle maintenance check."}
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#3E2723] text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-brown-900/20">
                                        V01
                                    </div>
                                    <span className="font-black text-slate-800 text-[15px] tracking-tighter uppercase">{booking.vehicles?.registration || "BAA 1234"}</span>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex items-center gap-2">
                                        <Compass className="w-4.5 h-4.5 text-[#EE401D]" />
                                        <span className="text-[14px] font-black text-slate-800">1,291</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-300 font-black text-[16px]">#</span>
                                        <span className="text-[14px] font-black text-slate-800">33</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setVehicleId(booking.vehicles?.registration || "")
                                    setFromLocation("Lusaka")
                                    setToLocation(booking.destination || "")
                                    setPurpose(booking.purpose || "")
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="relative z-10 w-full py-4.5 bg-slate-900 text-white rounded-[20px] text-[13px] font-black hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[1.5px] flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                            >
                                <Play size={14} className="fill-current" />
                                Load Details
                            </button>
                        </div>
                    )) : (
                        <div className="py-16 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                                <Calendar className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-[2px]">No pending assignments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
