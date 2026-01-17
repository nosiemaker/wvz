"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    ArrowLeft, Save, Truck, Calendar, FileText, Trash2,
    MoreHorizontal, Pencil, Plus, Eye, CheckCircle,
    AlertCircle, Clock, MapPin, AlertTriangle, ChevronDown,
    Gauge, Fuel, Settings, Layers, Wrench, FileCheck, ShieldAlert,
    DollarSign, Activity, ClipboardCheck, History, User, X
} from "lucide-react"
import { getVehicle, updateVehicle } from "@/lib/vehicles"
import { getVehicleTrips } from "@/lib/trips"
import VehicleInspectionDiagram from "../components/VehicleInspectionDiagram"

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'active') return <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Active</span>
    if (status === 'maintenance') return <span className="flex items-center gap-1.5 text-orange-600 font-bold text-xs bg-orange-50 px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>In Shop</span>
    return <span className="flex items-center gap-1.5 text-slate-500 font-bold text-xs bg-slate-100 px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>{status}</span>
}

const WidgetCard = ({ title, countOverdue, countOpen, children, icon: Icon, onAdd, onViewAll }: any) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                {title}
            </h3>
            <div className="flex items-center gap-3">
                {onAdd && <button className="text-[10px] font-black uppercase tracking-widest text-[#EE401D] flex items-center gap-1 hover:underline"><Plus size={12} /> Add</button>}
                {onViewAll && <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">View All</button>}
            </div>
        </div>

        {(countOverdue !== undefined || countOpen !== undefined) && (
            <div className="flex border-b border-slate-100">
                <div className="flex-1 p-3 border-r border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Overdue</span>
                    <span className="text-xl font-black text-slate-800 leading-none">{countOverdue}</span>
                </div>
                <div className="flex-1 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{title === 'Open Issues' ? 'Open' : 'Due Soon'}</span>
                    <span className={`text-xl font-black leading-none ${countOpen > 0 ? 'text-orange-500' : 'text-slate-800'}`}>{countOpen}</span>
                </div>
            </div>
        )}

        <div className="p-0">
            {children}
        </div>
    </div>
)

const InfoRow = ({ label, value, isLink = false }: any) => (
    <div className="flex justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-4 -mx-4">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        {isLink ? (
            <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">{value}</span>
        ) : (
            <span className="text-xs font-bold text-slate-800 text-right">{value || '—'}</span>
        )}
    </div>
)

// --- Main Page Content ---

function ViewVehicleContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const section = searchParams.get("section")

    const [activeTab, setActiveTab] = useState(section || "overview")
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isInspecting, setIsInspecting] = useState(false)
    const [vehicle, setVehicle] = useState<any>(null)
    const [trips, setTrips] = useState<any[]>([])

    // Load Data
    useEffect(() => {
        const load = async () => {
            if (!id) return
            try {
                const vData = await getVehicle(id as string)
                if (vData) setVehicle(vData)
                const tData = await getVehicleTrips(id as string)
                if (tData) setTrips(tData)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [id])

    // Mock Data Generators
    const getMockIssues = () => [
        { id: 5, title: "Brake light", reported: "18 hours ago", by: "Jacob Silva", status: "Open" },
        { id: 6, title: "Wiper blades need replacement", reported: "2 days ago", by: "System Inspection", status: "Open" }
    ]

    const getMockService = () => [
        { id: 124, title: "Engine Oil & Filter Replacement", due: "Due Soon", left: "467 miles remaining" },
        { id: 125, title: "Tire Rotation", due: "Due Soon", left: "467 miles remaining" }
    ]

    const getMockFinancial = () => ({
        purchase_price: "ZMK 450,000",
        purchase_date: "Oct 12, 2023",
        vendor: "Toyota Zambia",
        warranty_exp: "Oct 12, 2026",
        residual_value: "ZMK 280,000",
        monthly_lease: "—",
        lender: "Owned Asset"
    })

    const getMockSensorData = () => [
        { name: "Battery", value: "12.4 V", status: "normal" },
        { name: "Engine Temp", value: "92 °C", status: "normal" },
        { name: "Fuel Level", value: "48 %", status: "normal" },
        { name: "Oil Pressure", value: "32 PSI", status: "normal" },
        { name: "Odometer", value: `${vehicle?.current_mileage?.toLocaleString() || 0} KM`, status: "normal" },
        { name: "GPS Signal", value: "Strong", status: "normal" },
    ]

    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin"></div></div>

    if (isEditing) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-bold">Edit Mode</h2>
                <p className="text-slate-500">Edit functionality would be here. (Simplified for this view)</p>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Back to Dashboard</button>
            </div>
        )
    }

    return (
        <div className="font-sans text-slate-600 bg-slate-50/50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                            {/* Vehicle Image Mock */}
                            <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer">
                                {/* Placeholder Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <Truck size={32} />
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase">
                                    Change Information
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    {vehicle?.registration}
                                    <span className="text-slate-400 font-medium text-lg">[{vehicle?.year} {vehicle?.make} {vehicle?.model}]</span>
                                </h1>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                    {vehicle?.type || 'Car'} • {vehicle?.year} {vehicle?.make} {vehicle?.model} • <span className="font-mono">{vehicle?.vin}</span>
                                </p>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Gauge size={16} className="text-slate-400" />
                                        <span className="text-sm font-black text-slate-700">{vehicle?.current_mileage?.toLocaleString()} KM</span>
                                    </div>
                                    <StatusBadge status={vehicle?.status} />
                                    {vehicle?.office && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            <MapPin size={12} />
                                            {vehicle.office}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#EE401D] cursor-pointer transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-[#EE401D]/10 text-[#EE401D] flex items-center justify-center font-black text-[10px]">
                                            JS
                                        </div>
                                        Jacob Silva (Mock)
                                    </div>
                                    <button className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full hover:bg-slate-50">
                                        Edit Labels
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                                <CheckCircle size={16} /> {/* Placeholder for 'WK' */}
                                <span className="text-[10px] font-black">WK</span>
                            </button>
                            <button className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Eye size={14} className="text-slate-400" />
                                Unwatch
                            </button>
                            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
                                <MoreHorizontal size={16} />
                            </button>
                            <button onClick={() => setIsEditing(true)} className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Pencil size={14} />
                                Edit
                            </button>
                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-emerald-600 shadow-sm flex items-center gap-2">
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-8 mt-8 border-b border-slate-200">
                        {["Overview", "Specs", "Financial", "Sensor Data", "Service History", "Inspections", "Work Orders", "Assignment History"].map((tab) => {
                            const id = tab.toLowerCase().replace(' ', '-')
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === id ? "text-[#EE401D]" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EE401D]" />}
                                </button>
                            )
                        })}
                        <button className="pb-4 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                            More <ChevronDown size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-[1600px] mx-auto p-8">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-8">
                        {/* LEFT COLUMN - Details */}
                        <div className="col-span-12 lg:col-span-7 space-y-8">

                            {/* Details Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Details</h2>
                                    <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">All Fields</span>
                                </div>

                                <div className="space-y-1">
                                    <InfoRow label="Name" value={`${vehicle?.registration} [${vehicle?.year} ${vehicle?.make}]`} />
                                    <InfoRow label="Meter" value={`${vehicle?.current_mileage?.toLocaleString()} KM`} />
                                    <div className="flex justify-between py-3 border-b border-slate-50 px-4 -mx-4 hover:bg-slate-50/50">
                                        <span className="text-xs font-bold text-slate-500">Status</span>
                                        <StatusBadge status={vehicle?.status} />
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-50 px-4 -mx-4 hover:bg-slate-50/50">
                                        <span className="text-xs font-bold text-slate-500">Office Location</span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-[#EE401D] block">{vehicle?.office || 'Assigned to Project'}</span>
                                            <span className="text-[10px] text-slate-400 block">Zambia / Lusaka Region</span>
                                        </div>
                                    </div>
                                    <InfoRow label="Type" value={vehicle?.type || "Car"} isLink />
                                    <InfoRow label="Fuel Type" value={vehicle?.fuel_type} />
                                    <InfoRow label="License Plate" value={vehicle?.registration} />
                                    <InfoRow label="Year" value={vehicle?.year} />
                                    <InfoRow label="Make" value={vehicle?.make} />
                                </div>
                            </div>

                            {/* Linked Assets */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Linked Assets</h2>
                                    <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Link Asset</span>
                                </div>
                                <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    <p className="text-xs font-bold text-slate-400">There are no linked vehicles</p>
                                </div>
                            </div>

                            {/* Last Known Location */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Last Known Location</h2>
                                </div>
                                <div className="aspect-video bg-slate-100 rounded-lg relative overflow-hidden flex items-center justify-center">
                                    <MapPin size={32} className="text-slate-300 mb-2" />
                                    <div className="absolute inset-0 bg-[#EE401D]/5 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center mix-blend-multiply"></div>
                                    <span className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow-sm text-[10px] font-bold text-slate-500">Lusaka Main Office Depot</span>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - Widgets */}
                        <div className="col-span-12 lg:col-span-5 space-y-6">

                            {/* Issues Widget */}
                            <WidgetCard title="Open Issues" countOverdue={0} countOpen={2} onAdd icon={AlertCircle} onViewAll>
                                <div className="divide-y divide-slate-100">
                                    {getMockIssues().map(issue => (
                                        <div key={issue.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start justify-between mb-1">
                                                <span className="text-xs font-bold text-[#EE401D]">#{issue.id} - {issue.title}</span>
                                                <button className="text-[10px] font-bold border border-slate-200 rounded px-2 py-0.5 text-slate-500 hover:bg-white">Resolve</button>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Clock size={10} />
                                                <span>Reported {issue.reported} by <span className="text-[#EE401D]">{issue.by}</span></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </WidgetCard>

                            {/* Service Reminders */}
                            <WidgetCard title="Service Reminders" countOverdue={0} countOpen={2} onAdd icon={Wrench} onViewAll>
                                <div className="divide-y divide-slate-100">
                                    {getMockService().map(item => (
                                        <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start justify-between mb-1">
                                                <span className="text-xs font-bold text-[#EE401D]">#{item.id} - {item.title}</span>
                                                <button className="text-[10px] font-bold border border-slate-200 rounded px-2 py-0.5 text-slate-500 hover:bg-white">Resolve</button>
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 mb-0.5">Every 6 month(s) or 5,000 KM</div>
                                            <div className="text-[10px] font-bold text-orange-500">Due Soon: {item.left}</div>
                                        </div>
                                    ))}
                                </div>
                            </WidgetCard>

                            {/* Renewal Reminders (Empty State Mock) */}
                            <WidgetCard title="Renewal Reminders" countOverdue={0} countOpen={1} onAdd icon={FileCheck} onViewAll>
                                <div className="p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-xs font-bold text-[#EE401D]">Road Tax Expiry</span>
                                        <button className="text-[10px] font-bold border border-slate-200 rounded px-2 py-0.5 text-slate-500 hover:bg-white">Resolve</button>
                                    </div>
                                    <div className="text-[10px] font-bold text-orange-500">Due Soon: 3 weeks from now</div>
                                </div>
                            </WidgetCard>

                        </div>
                    </div>
                )}

                {/* SPECS TAB */}
                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Dimensions Group */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Dimensions</h2>
                                <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Edit</span>
                            </div>
                            <InfoRow label="Width" value="69.3 in" />
                            <InfoRow label="Height" value="58.1 in" />
                            <InfoRow label="Length" value="178.7 in" />
                            <InfoRow label="Interior Volume" value="117.7 ft³" />
                            <InfoRow label="Passenger Volume" value="93.1 ft³" />
                            <InfoRow label="Cargo Volume" value="24.6 ft³" />
                            <InfoRow label="Ground Clearance" value="5.1 in" />
                        </div>

                        {/* Engine Group */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Engine</h2>
                                <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Edit</span>
                            </div>
                            <InfoRow label="Engine Description" value="1.8L Hybrid I4 121hp" />
                            <InfoRow label="Engine Brand" value="Toyota" />
                            <InfoRow label="Aspiration" value="Naturally Aspirated" />
                            <InfoRow label="Block Type" value="I" />
                            <InfoRow label="Bore" value="3.17 in" />
                            <InfoRow label="Cam Type" value="DOHC" />
                            <InfoRow label="Compression" value="13.0" />
                            <InfoRow label="Cylinders" value="4" />
                            <InfoRow label="Displacement" value="1.8 L" />
                            <InfoRow label="Fuel Induction" value="Sequential Multiport Fuel Injection" />
                            <InfoRow label="Max HP" value="121" />
                        </div>

                        {/* Weight Group */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Weight</h2>
                                <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Edit</span>
                            </div>
                            <InfoRow label="Curb Weight" value="3,075 lb" />
                            <InfoRow label="Gross Vehicle Weight Rating" value="—" />
                        </div>
                    </div>
                )}

                {/* FINANCIAL TAB */}
                {activeTab === 'financial' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <DollarSign size={20} className="text-slate-400" /> Purchase Info
                                </h2>
                                <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Edit</span>
                            </div>
                            <InfoRow label="Purchase Price" value={getMockFinancial().purchase_price} />
                            <InfoRow label="Purchase Date" value={getMockFinancial().purchase_date} />
                            <InfoRow label="Vendor" value={getMockFinancial().vendor} />
                            <InfoRow label="Warranty Expiry" value={getMockFinancial().warranty_exp} />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Loan / Lease</h2>
                                <span className="text-xs font-bold text-[#EE401D] cursor-pointer hover:underline">Edit</span>
                            </div>
                            <InfoRow label="Ownership" value={getMockFinancial().lender} />
                            <InfoRow label="Residual Value" value={getMockFinancial().residual_value} />
                            <InfoRow label="Monthly Payment" value={getMockFinancial().monthly_lease} />
                        </div>
                    </div>
                )}

                {/* SENSOR DATA TAB */}
                {activeTab === 'sensor-data' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <Activity size={20} className="text-slate-400" /> Telematics Snapshots
                            </h2>
                            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wide">Refresh Data</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {getMockSensorData().map(sensor => (
                                <div key={sensor.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{sensor.name}</span>
                                    <span className="text-xl font-black text-slate-800">{sensor.value}</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase mt-1 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Okay
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
                            Data updated from geotab device • 2 minutes ago
                        </p>
                    </div>
                )}

                {/* SERVICE HISTORY TAB */}
                {activeTab === 'service-history' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <Wrench size={20} className="text-slate-400" /> Service Log
                            </h2>
                            <button className="px-4 py-2 bg-[#EE401D] text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                <Plus size={16} /> Add Entry
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Task</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Meter</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-800">Jan 15, 2024</td>
                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">Oil & Filter Change (5000km)</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">Toyota Service Centre</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">5,000 km</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">ZMK 2,500</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-800">Nov 20, 2023</td>
                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">Brake Pad Inspection & Replacement (Front)</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">AutoStop Garage</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">4,200 km</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">ZMK 1,800</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* INSPECTIONS TAB */}
                {activeTab === 'inspections' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <ClipboardCheck size={20} className="text-slate-400" /> Inspection History
                            </h2>
                            {!isInspecting ? (
                                <button
                                    onClick={() => setIsInspecting(true)}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2"
                                >
                                    Start Inspection
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsInspecting(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-slate-200"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            )}
                        </div>
                        {isInspecting ? (
                            <div className="p-6 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Perform Digital Inspection</h3>
                                        <p className="text-xs text-slate-500 font-medium">Tap map to log defects. Pre-trip check recommended.</p>
                                    </div>
                                    <button className="px-5 py-2 bg-[#EE401D] text-white rounded-lg text-xs font-black uppercase tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-xl hover:translate-y-[-1px] transition-all">Submit Inspection</button>
                                </div>
                                <VehicleInspectionDiagram />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted By</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Failed</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">Today, 8:00 AM</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">Daily Pre-Trip Inspection</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">JS</div> Jacob Silva
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400">0</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-black uppercase">Pass</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">Yesterday, 7:45 AM</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">Daily Pre-Trip Inspection</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">JS</div> Jacob Silva
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400">0</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-black uppercase">Pass</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">Jan 12, 2024</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">Weekly Safety Inspection</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">WK</div> W. Kalimukwa
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-orange-500">1</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-black uppercase">Fail</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* WORK ORDERS TAB */}
                {activeTab === 'work-orders' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <ShieldAlert size={20} className="text-slate-400" /> Work Orders
                            </h2>
                            <button className="px-4 py-2 bg-[#EE401D] text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                <Plus size={16} /> Create Work Order
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">WO #</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-xs font-bold text-[#EE401D]">WO-1024</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-black uppercase">Completed</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">Windshield Crack Repair</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">PG Glass</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">ZMK 1,450</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="p-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                            No Active Work Orders
                        </div>
                    </div>
                )}

                {/* ASSIGNMENT HISTORY TAB */}
                {activeTab === 'assignment-history' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <History size={20} className="text-slate-400" /> Assignment Log
                            </h2>
                        </div>
                        {trips.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Distance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {trips.map((trip) => (
                                        <tr key={trip.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                                {new Date(trip.start_time).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {trip.users?.full_name?.charAt(0) || <User size={12} />}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{trip.users?.full_name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                                {trip.start_location} <span className="text-slate-300 mx-1">→</span> {trip.destination}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">
                                                {trip.end_mileage && trip.start_mileage ? (trip.end_mileage - trip.start_mileage) : '-'} <span className="text-[9px] text-slate-400 font-bold">KM</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            // Mock Data if trips are empty for demo
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Distance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                            Jan 16, 2024, 08:30 AM
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">JS</div>
                                                <span className="text-xs font-bold text-slate-700">Jacob Silva</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                            Lusaka Office <span className="text-slate-300 mx-1">→</span> Airport
                                        </td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">
                                            45 <span className="text-[9px] text-slate-400 font-bold">KM</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                            Jan 14, 2024, 14:15 PM
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">WK</div>
                                                <span className="text-xs font-bold text-slate-700">W. Kalimukwa</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                            Lusaka Office <span className="text-slate-300 mx-1">→</span> Kafue Site
                                        </td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800 text-right">
                                            120 <span className="text-[9px] text-slate-400 font-bold">KM</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}

export default function ViewVehiclePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-500">Loading Fleet Asset...</p>
                </div>
            </div>
        }>
            <ViewVehicleContent />
        </Suspense>
    )
}
