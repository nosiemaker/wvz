"use client"

import { useState } from "react"
import { Search, Filter, Download, Calendar } from "lucide-react"

// Dummy Data
const serviceHistoryData = [
    { id: 1, vehicle: "Toyota Hilux #04", task: "Engine Oil & Filter Replacement", cost: 1450.00, date: "2025-10-15" },
    { id: 2, vehicle: "Ford Ranger #12", task: "Engine Air Filter Replacement", cost: 850.50, date: "2025-10-14" },
    { id: 3, vehicle: "Land Cruiser #07", task: "Tire Rotation & Alignment", cost: 2300.00, date: "2025-10-12" },
    { id: 4, vehicle: "Nissan Navara #03", task: "Transmission Fluid Drain & Refill", cost: 4500.25, date: "2025-10-10" },
    { id: 5, vehicle: "Isuzu D-Max #09", task: "Engine Air Filter Replacement", cost: 850.50, date: "2025-10-09" },
    { id: 6, vehicle: "Mitsubishi Triton #06", task: "Spark Plug Replacement", cost: 3200.75, date: "2025-10-08" },
    { id: 7, vehicle: "Toyota Hilux #02", task: "Brake Pad Replacement (Front)", cost: 1800.00, date: "2025-10-05" },
    { id: 8, vehicle: "Ford Ranger #05", task: "Battery Replacement", cost: 2100.00, date: "2025-10-03" },
    { id: 9, vehicle: "Land Cruiser #01", task: "Coolant Flush & Refill", cost: 1250.00, date: "2025-10-01" },
    { id: 10, vehicle: "Toyota Fortuner #11", task: "Wiper Blade Replacement", cost: 450.00, date: "2025-09-28" },
    { id: 11, vehicle: "Nissan Hardbody #08", task: "Suspension Inspection", cost: 600.00, date: "2025-09-25" },
    { id: 12, vehicle: "Mazda BT-50 #10", task: "Fuel Filter Replacement", cost: 1100.00, date: "2025-09-22" },
]

export default function ServiceHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = serviceHistoryData.filter(item =>
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.task.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZM', {
            style: 'currency',
            currency: 'ZMW',
            minimumFractionDigits: 2
        }).format(amount)
    }

    return (
        <div className="space-y-6 pb-12 font-sans text-slate-600 bg-slate-50 min-h-screen p-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service History</h1>
                    <p className="text-sm font-medium text-slate-400"> comprehensive log of all maintenance activities and costs.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">
                        <Download size={16} />
                        <span>Export Log</span>
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search vehicle or task..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Calendar size={16} />
                        <span>Last 30 Days</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Service Task</th>
                                <th className="px-6 py-4 text-center">Date</th>
                                <th className="px-6 py-4 text-right">Cost (ZMW)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700">{item.vehicle}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">{item.task}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{item.date}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-black text-slate-800">{formatCurrency(item.cost)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No service records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Showing {filteredData.length} Records</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 hover:bg-slate-50 rounded">Prev</button>
                        <button className="px-3 py-1 hover:bg-slate-50 rounded text-slate-900">1</button>
                        <button className="px-3 py-1 hover:bg-slate-50 rounded">2</button>
                        <button className="px-3 py-1 hover:bg-slate-50 rounded">Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
