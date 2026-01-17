"use client"

import React, { useState } from 'react'
import { Plus, X, AlertCircle, Maximize2, Minimize2, Box, Map } from 'lucide-react'
import Vehicle3DModel from './Vehicle3DModel'

type DamagePoint = {
    id: number
    x?: number
    y?: number
    position3D?: [number, number, number]
    type: 'scratch' | 'dent' | 'crack' | 'missing' | 'other'
    notes?: string
}

export default function VehicleInspectionDiagram() {
    const [damagePoints, setDamagePoints] = useState<DamagePoint[]>([])
    const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only add point if not clicking an existing one
        if ((e.target as HTMLElement).closest('.damage-point')) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const newPoint: DamagePoint = {
            id: Date.now(),
            x,
            y,
            type: 'scratch',
            notes: ''
        }

        setDamagePoints([...damagePoints, newPoint])
        setSelectedPoint(newPoint.id)
    }

    const handle3DPointAdd = (position: [number, number, number]) => {
        const newPoint: DamagePoint = {
            id: Date.now(),
            position3D: position,
            type: 'scratch',
            notes: ''
        }
        setDamagePoints([...damagePoints, newPoint])
        setSelectedPoint(newPoint.id)
    }

    const removePoint = (id: number) => {
        setDamagePoints(damagePoints.filter(p => p.id !== id))
        setSelectedPoint(null)
    }

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* View Toggle & Controls */}
            <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                    <button
                        onClick={() => setViewMode('2d')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${viewMode === '2d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Map size={16} /> 2D Diagram
                    </button>
                    <button
                        onClick={() => setViewMode('3d')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${viewMode === '3d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Box size={16} /> 3D View
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFullScreen}
                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                    >
                        {isFullScreen ? <><Minimize2 size={14} /> Exit Full Screen</> : <><Maximize2 size={14} /> Full Screen</>}
                    </button>
                </div>
            </div>

            {/* Interactive Area */}
            <div className={`transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50 bg-white p-4 flex flex-col' : 'flex-1'}`}>
                <div className={`bg-slate-50 border border-slate-200 rounded-xl relative select-none overflow-hidden ${isFullScreen ? 'flex-1 flex flex-col' : 'h-[500px]'}`}>

                    {viewMode === '2d' ? (
                        <div className={`w-full h-full flex flex-col p-4 md:p-8`}>
                            <div className="text-center mb-4 text-slate-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 flex-shrink-0">
                                <span>Tap diagram to mark damage</span>
                                {!isFullScreen && (
                                    <span className="md:hidden text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">↔ Scroll to zoom</span>
                                )}
                            </div>

                            {/* Diagram Container - Scrollable Wrapper */}
                            <div className={`w-full overflow-x-auto ${isFullScreen ? 'flex-1 flex items-center justify-center bg-slate-100/50 rounded-lg overflow-y-auto' : 'pb-4'}`}>
                                <div
                                    className={`relative bg-white rounded-lg shadow-sm border border-slate-100 cursor-crosshair overflow-hidden mx-auto ${isFullScreen ? 'min-w-[1200px] w-full aspect-[2/1] scale-100 origin-center' : 'min-w-[1200px] lg:min-w-0 w-full aspect-[2/1]'}`}
                                    onClick={handleMapClick}
                                >
                                    {/* SVG Schematic - Unrolled Car View */}
                                    <svg className="w-full h-full pointer-events-none opacity-90" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">

                                        {/* STYLE DEFINITIONS */}
                                        <defs>
                                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                                                <feOffset dx="1" dy="1" result="offsetblur" />
                                                <feComponentTransfer>
                                                    <feFuncA type="linear" slope="0.3" />
                                                </feComponentTransfer>
                                                <feMerge>
                                                    <feMergeNode />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        <g stroke="#1e293b" strokeWidth="3" fill="none" transform="translate(50, 20)">

                                            {/* TOP VIEW (Center) */}
                                            <g transform="translate(300, 50)">
                                                {/* Main Body */}
                                                <path d="M 30,0 L 170,0 L 190,40 L 190,260 L 170,300 L 30,300 L 10,260 L 10,40 Z" fill="#eff6ff" />
                                                {/* Windshields */}
                                                <path d="M 30,60 L 170,60 L 165,90 L 35,90 Z" fill="#dbeafe" />
                                                <path d="M 35,220 L 165,220 L 170,250 L 30,250 Z" fill="#dbeafe" />
                                                {/* Roof */}
                                                <rect x="40" y="100" width="120" height="110" rx="10" stroke="#94a3b8" strokeDasharray="5,5" />
                                            </g>

                                            {/* DRIVER SIDE (Top) */}
                                            <g transform="translate(100, 20) scale(0.8)">
                                                <path d="M 10,60 L 40,60 L 70,20 L 180,20 L 230,60 L 280,60 L 280,100 L 10,100 Z" fill="#f8fafc" />
                                                {/* Windows */}
                                                <path d="M 75,25 L 125,25 L 125,55 L 45,55 Z" fill="#e2e8f0" />
                                                <path d="M 130,25 L 175,25 L 220,55 L 130,55 Z" fill="#e2e8f0" />
                                                {/* Wheels */}
                                                <circle cx="60" cy="100" r="18" fill="#94a3b8" />
                                                <circle cx="230" cy="100" r="18" fill="#94a3b8" />
                                            </g>

                                            {/* PASSENGER SIDE (Bottom) */}
                                            <g transform="translate(100, 280) scale(0.8)">
                                                <path d="M 10,60 L 40,60 L 70,20 L 180,20 L 230,60 L 280,60 L 280,100 L 10,100 Z" fill="#f8fafc" />
                                                {/* Windows */}
                                                <path d="M 75,25 L 125,25 L 125,55 L 45,55 Z" fill="#e2e8f0" />
                                                <path d="M 130,25 L 175,25 L 220,55 L 130,55 Z" fill="#e2e8f0" />
                                                {/* Wheels */}
                                                <circle cx="60" cy="100" r="18" fill="#94a3b8" />
                                                <circle cx="230" cy="100" r="18" fill="#94a3b8" />
                                            </g>

                                            {/* FRONT VIEW (Left) */}
                                            <g transform="translate(0, 150) scale(0.8)">
                                                <path d="M 20,20 L 100,20 L 110,50 L 110,90 L 10,90 L 10,50 Z" fill="#f1f5f9" />
                                                <rect x="25" y="30" width="70" height="15" fill="#cbd5e1" /> {/* Grille */}
                                                <circle cx="15" cy="65" r="8" fill="#e2e8f0" /> {/* Lights */}
                                                <circle cx="105" cy="65" r="8" fill="#e2e8f0" />
                                            </g>

                                            {/* REAR VIEW (Right) */}
                                            <g transform="translate(600, 150) scale(0.8)">
                                                <path d="M 20,20 L 100,20 L 110,50 L 110,90 L 10,90 L 10,50 Z" fill="#f1f5f9" />
                                                <rect x="25" y="30" width="70" height="20" fill="#e2e8f0" /> {/* Window */}
                                                <rect x="10" y="60" width="15" height="10" fill="#fecaca" /> {/* Lights */}
                                                <rect x="95" y="60" width="15" height="10" fill="#fecaca" />
                                            </g>

                                            {/* Connection Lines (Optional visual guide) */}
                                            <path d="M 330,60 L 320,100" stroke="#e2e8f0" strokeDasharray="4,4" />
                                            <path d="M 330,290 L 320,260" stroke="#e2e8f0" strokeDasharray="4,4" />

                                        </g>

                                        {/* Labels */}
                                        <text x="120" y="120" fontSize="12" fill="#94a3b8" fontWeight="bold">DRIVER SIDE</text>
                                        <text x="120" y="270" fontSize="12" fill="#94a3b8" fontWeight="bold">PASSENGER SIDE</text>
                                        <text x="380" y="40" fontSize="12" fill="#94a3b8" fontWeight="bold">FRONT</text>
                                        <text x="380" y="380" fontSize="12" fill="#94a3b8" fontWeight="bold">REAR</text>
                                    </svg>

                                    {/* Placed Markers */}
                                    {damagePoints.filter(p => p.x !== undefined).map((point) => (
                                        <div
                                            key={point.id}
                                            className={`damage-point absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 cursor-pointer shadow-lg transition-transform hover:scale-125 z-10 flex items-center justify-center ${selectedPoint === point.id
                                                ? 'bg-[#EE401D] border-white text-white z-20 scale-110'
                                                : 'bg-white/80 border-[#EE401D] text-[#EE401D]'
                                                }`}
                                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedPoint(point.id)
                                            }}
                                        >
                                            <span className="text-[10px] font-black">{damagePoints.findIndex(p => p.id === point.id) + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex gap-4 justify-center flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#EE401D]"></div>
                                    <span className="text-xs font-bold text-slate-500">Damage Detected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
                                    <span className="text-xs font-bold text-slate-400">Clean Area</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full p-4 flex flex-col">
                            <Vehicle3DModel
                                points={damagePoints.filter(p => p.position3D !== undefined).map((p) => ({
                                    id: p.id,
                                    position: p.position3D!,
                                    note: p.notes
                                }))}
                                onAddPoint={handle3DPointAdd}
                                onSelectPoint={setSelectedPoint}
                                selectedPointId={selectedPoint}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Inputs / Details Column - Now Full Width Below */}
            <div className="w-full space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-[#EE401D]" /> Damage Log
                    </h3>

                    {damagePoints.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-xs font-bold text-slate-400">No damage points marked.</p>
                            <p className="text-[10px] text-slate-400 mt-1">Tap the diagram to add issues.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {damagePoints.map((point, idx) => (
                                <div
                                    key={point.id}
                                    className={`p-3 rounded-lg border transition-all ${selectedPoint === point.id
                                            ? 'bg-orange-50 border-orange-200 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-[#EE401D] bg-white border border-orange-100 px-1.5 py-0.5 rounded-md">
                                                Issue #{idx + 1}
                                            </span>
                                            {point.position3D ? (
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded"><Box size={10} /> 3D</span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded"><Map size={10} /> 2D</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removePoint(point.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full p-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Type</label>
                                            <select
                                                className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-1.5 focus:border-[#EE401D] outline-none"
                                                value={point.type}
                                                onChange={(e) => {
                                                    setDamagePoints(damagePoints.map(p =>
                                                        p.id === point.id ? { ...p, type: e.target.value as any } : p
                                                    ))
                                                }}
                                            >
                                                <option value="scratch">Scratch / Scuff</option>
                                                <option value="dent">Dent / Ding</option>
                                                <option value="crack">Crack / Chip</option>
                                                <option value="missing">Missing Part</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driver Notes</label>
                                            <input
                                                type="text"
                                                placeholder="Describe damage..."
                                                className="w-full text-xs font-medium bg-slate-50 border-none rounded p-1.5 focus:ring-1 focus:ring-[#EE401D]"
                                                value={point.notes}
                                                onChange={(e) => {
                                                    setDamagePoints(damagePoints.map(p =>
                                                        p.id === point.id ? { ...p, notes: e.target.value } : p
                                                    ))
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
