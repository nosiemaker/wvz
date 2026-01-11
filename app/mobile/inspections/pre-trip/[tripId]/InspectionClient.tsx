"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Camera, CheckCircle, XCircle, AlertTriangle } from "lucide-react"


export default function InspectionClient() {
    const router = useRouter()
    const params = useParams()
    const tripId = params.tripId as string

    const [checklist, setChecklist] = useState([
        { id: 1, item: "Tires (condition & pressure)", status: null as boolean | null, photo: null as string | null },
        { id: 2, item: "Brakes (function test)", status: null as boolean | null, photo: null as string | null },
        { id: 3, item: "Lights (headlights, indicators, brake lights)", status: null as boolean | null, photo: null as string | null },
        { id: 4, item: "Horn", status: null as boolean | null, photo: null as string | null },
        { id: 5, item: "Mirrors (side & rear)", status: null as boolean | null, photo: null as string | null },
        { id: 6, item: "Windshield & wipers", status: null as boolean | null, photo: null as string | null },
        { id: 7, item: "Fluids (oil, coolant, brake fluid)", status: null as boolean | null, photo: null as string | null },
        { id: 8, item: "Fuel level", status: null as boolean | null, photo: null as string | null },
        { id: 9, item: "Safety kit (first aid, fire extinguisher)", status: null as boolean | null, photo: null as string | null },
        { id: 10, item: "Spare tire & tools", status: null as boolean | null, photo: null as string | null },
    ])

    const [notes, setNotes] = useState("")

    const handleStatusChange = (id: number, status: boolean) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, status } : item
        ))
    }

    const handlePhotoUpload = (id: number) => {
        // Mock photo upload
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, photo: "/placeholder-inspection.jpg" } : item
        ))
    }

    const handleSubmit = () => {
        const allChecked = checklist.every(item => item.status !== null)
        const hasFailed = checklist.some(item => item.status === false)

        if (!allChecked) {
            alert("Please complete all inspection items")
            return
        }

        if (hasFailed) {
            alert("Inspection failed! Vehicle cannot be used. Maintenance required.")
            router.push("/mobile/trips")
        } else {
            alert("Pre-trip inspection passed! You can now start the trip.")
            router.push("/mobile/trips")
        }
    }

    const completedItems = checklist.filter(item => item.status !== null).length
    const passedItems = checklist.filter(item => item.status === true).length
    const failedItems = checklist.filter(item => item.status === false).length

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Pre-Trip Inspection</h1>
                        <p className="text-sm text-muted-foreground">Complete before starting trip</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">{completedItems}/{checklist.length}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `zmw{(completedItems / checklist.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{passedItems} Passed</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>{failedItems} Failed</span>
                        </div>
                    </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Inspection Checklist</h3>
                    {checklist.map((item) => (
                        <div key={item.id} className="bg-card border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <p className="font-medium flex-1">{item.item}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusChange(item.id, true)}
                                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors zmw{item.status === true
                                            ? "bg-green-600 text-white"
                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                            }`}
                                    >
                                        Pass
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(item.id, false)}
                                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors zmw{item.status === false
                                            ? "bg-red-600 text-white"
                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                    >
                                        Fail
                                    </button>
                                </div>
                            </div>

                            {item.status === false && (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handlePhotoUpload(item.id)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                        {item.photo ? "Photo Added" : "Add Photo of Issue"}
                                    </button>
                                    {item.photo && (
                                        <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700">
                                            ✓ Photo uploaded
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label className="font-semibold">Additional Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full min-h-[100px] p-3 border rounded-lg bg-background"
                        placeholder="Any additional observations or concerns..."
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={completedItems !== checklist.length}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Inspection
                </button>

                {failedItems > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-900">Critical Issues Detected</p>
                            <p className="text-sm text-red-700">
                                {failedItems} item(s) failed inspection. Vehicle requires maintenance before use.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
