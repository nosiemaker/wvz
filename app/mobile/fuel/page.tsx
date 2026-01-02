"use client"

import { useState } from "react"
import { Fuel, User, Calendar, RotateCw } from "lucide-react"

interface FuelEntry {
    id: string
    station: string
    driver: string
    date: string
    odometer: string
    amount: string
}

export default function FuelPage() {
    const [fuelEntries] = useState<FuelEntry[]>([
        {
            id: "1",
            station: "Puma Twinpalm Servic",
            driver: "Ruth Zulu",
            date: "11/11/25",
            odometer: "35173 KM",
            amount: "34 L",
        },
        {
            id: "2",
            station: "TOTAL- Great East Ro",
            driver: "Ruth Zulu",
            date: "21/10/25",
            odometer: "34819 KM",
            amount: "14 L",
        },
    ])

    return (
        <div className="bg-white min-h-screen">
            <div className="divide-y divide-slate-100">
                {fuelEntries.map((entry) => (
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
                                    {entry.driver}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-black" />
                                <span className="text-[15px] font-[900] italic tracking-tight text-slate-400">
                                    {entry.date} at {entry.odometer}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-between min-h-[100px] py-1">
                            <RotateCw size={24} className="text-[#00897B] stroke-[3px]" />
                            <div className="text-[34px] font-[900] italic text-slate-500/80 mt-auto tracking-tighter">
                                {entry.amount}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
