"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Clock, User, Car, Info, Calendar as CalendarIcon, Filter } from "lucide-react"

type CalendarViewProps = {
    bookings: any[]
    vehicles: any[]
    onSelectBooking: (booking: any) => void
}

export default function CalendarView({ bookings, vehicles, onSelectBooking }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Hours to display (6 AM to 10 PM)
    const hours = Array.from({ length: 17 }, (_, i) => i + 6)

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    const changeDate = (days: number) => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + days)
        setCurrentDate(newDate)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setCurrentDate(new Date(e.target.value))
        }
    }

    // Filter real bookings and add dummy ones for the current date
    const dayBookings = useMemo(() => {
        const realOnDay = bookings.filter(b => {
            const bDate = new Date(b.start_date)
            return (
                bDate.getDate() === currentDate.getDate() &&
                bDate.getMonth() === currentDate.getMonth() &&
                bDate.getFullYear() === currentDate.getFullYear() &&
                b.status === 'approved'
            )
        })

        // Mock dummy data to make it look active
        const dummies: any[] = []
        if (vehicles.length > 0) {
            // Dummy 1: 8 AM - 12 PM for first vehicle
            dummies.push({
                id: 'dummy-1',
                vehicle_id: vehicles[0].id,
                start_date: new Date(new Date(currentDate).setHours(8, 0, 0, 0)),
                destination: 'Siavonga Cluster Office',
                requester: { full_name: 'Mutinta Hachilala' },
                status: 'approved',
                duration: 4
            })

            // Dummy 2: 2 PM - 5 PM for second vehicle (if exists)
            if (vehicles.length > 1) {
                dummies.push({
                    id: 'dummy-2',
                    vehicle_id: vehicles[1].id,
                    start_date: new Date(new Date(currentDate).setHours(14, 0, 0, 0)),
                    destination: 'Monze Field Project',
                    requester: { full_name: 'Clement Siame' },
                    status: 'approved',
                    duration: 3
                })
            }

            // Dummy 3: 10 AM - 1 PM for third vehicle (if exists)
            if (vehicles.length > 2) {
                dummies.push({
                    id: 'dummy-3',
                    vehicle_id: vehicles[2].id,
                    start_date: new Date(new Date(currentDate).setHours(10, 30, 0, 0)),
                    destination: 'Lusaka Warehouse',
                    requester: { full_name: 'Grace Phiri' },
                    status: 'approved',
                    duration: 2.5
                })
            }

            // Dummy 4: 7 AM - 9 AM for fourth vehicle (if exists)
            if (vehicles.length > 3) {
                dummies.push({
                    id: 'dummy-4',
                    vehicle_id: vehicles[3].id,
                    start_date: new Date(new Date(currentDate).setHours(7, 0, 0, 0)),
                    destination: 'Airport Pickup - VIP',
                    requester: { full_name: 'Driver Standby' },
                    status: 'approved',
                    duration: 2
                })
            }
        }

        return [...realOnDay, ...dummies]
    }, [bookings, currentDate, vehicles])

    return (
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[750px] font-sans">
            {/* Calendar Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm p-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-800 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                            Today
                        </button>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1">{formattedDate}</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Fleet Monitoring</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Quick Date Range Select / Date Picker */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all cursor-pointer">
                            <CalendarIcon size={16} className="text-slate-400" />
                            <input
                                type="date"
                                onChange={handleDateChange}
                                value={currentDate.toISOString().split('T')[0]}
                                className="bg-transparent text-[11px] font-black uppercase tracking-wider outline-none cursor-pointer text-slate-700"
                            />
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-95 group">
                        <Filter size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Range Mode</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Vehicles Column */}
                <div className="w-72 border-r border-slate-200 flex-shrink-0 flex flex-col bg-slate-50/20 backdrop-blur-sm">
                    <div className="h-14 border-b border-slate-200 bg-white/80 flex items-center px-5 sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#EE401D]/10 rounded flex items-center justify-center">
                                <Car size={14} className="text-[#EE401D]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[2.5px] text-slate-500">Fleet Operations</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {vehicles.map(v => (
                            <div key={v.id} className="h-28 p-5 flex flex-col justify-center gap-2 group hover:bg-white transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                        <Car size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black italic text-slate-900 leading-none group-hover:text-[#EE401D] transition-colors">{v.registration}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter">{v.make} {v.model}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${v.status === 'active' || !v.status ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{v.status || 'Internal Active'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden flex flex-col relative bg-slate-50/10">
                    {/* Timeline Header (Hours) */}
                    <div className="h-14 border-b border-slate-200 flex flex-shrink-0 bg-white sticky top-0 z-10 shadow-sm">
                        {hours.map(h => (
                            <div key={h} className="w-40 flex-shrink-0 border-r border-slate-50 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{h > 12 ? h - 12 : h} {h >= 12 ? 'pm' : 'am'}</span>
                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mt-0.5">00:00</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grid Rows */}
                    <div className="flex-1 relative overflow-y-auto">
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {hours.map(h => (
                                <div key={h} className="w-40 h-full border-r border-slate-100 flex-shrink-0"></div>
                            ))}
                        </div>

                        {/* Bookings Overlay */}
                        <div className="relative">
                            {vehicles.map(v => (
                                <div key={v.id} className="h-28 border-b border-slate-50 relative group/row hover:bg-white/40 transition-colors">
                                    {/* Render bookings for this vehicle */}
                                    {dayBookings
                                        .filter(b => b.vehicle_id === v.id)
                                        .map(b => {
                                            const startDate = new Date(b.start_date)
                                            const startHour = startDate.getHours() + startDate.getMinutes() / 60
                                            const duration = b.duration || 2

                                            // Calculate offset from 6 AM (our timeline start)
                                            // w-40 is 160px
                                            const leftOffset = (startHour - 6) * 160
                                            const width = duration * 160

                                            return (
                                                <div
                                                    key={b.id}
                                                    onClick={() => onSelectBooking(b)}
                                                    className="absolute top-4 bottom-4 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-2xl p-3 cursor-pointer hover:border-[#EE401D]/30 hover:scale-[1.02] transition-all flex flex-col justify-between overflow-hidden group/bar group"
                                                    style={{ left: `${leftOffset}px`, width: `${width}px` }}
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#EE401D]"></div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#EE401D] font-black italic text-[10px] shadow-inner">
                                                                {b.requester?.full_name?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black italic text-slate-800 uppercase tracking-tight truncate leading-none">
                                                                    {b.requester?.full_name || 'Fleet Member'}
                                                                </span>
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Confirmed Trip</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-1 px-2 bg-[#EE401D]/5 rounded-lg text-[#EE401D] text-[8px] font-black uppercase">
                                                            Mission
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col mt-2">
                                                        <span className="text-[10px] font-bold text-slate-600 truncate mb-1 group-hover:text-[#EE401D] transition-colors">{b.destination}</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                                <Clock size={10} className="text-[#EE401D]" />
                                                                <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{duration}H Flight</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Summary Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EE401D]"></div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Assignment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Available Slot</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
                    <Info size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Click any assignment block for detailed resource controls</span>
                </div>
            </div>
        </div>
    )
}
