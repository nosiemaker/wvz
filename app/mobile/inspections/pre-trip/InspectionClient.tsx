"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Camera, CheckCircle, XCircle, AlertTriangle, Eye, ListChecks } from "lucide-react"
import { startTrip } from "@/lib/trips"
import VehicleInspectionDiagram from "@/app/admin/vehicles/components/VehicleInspectionDiagram"

export default function InspectionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("tripId") || "manual"
  const vehicleId = searchParams.get("vehicleId") || ""
  const destination = searchParams.get("destination") || ""
  const purpose = searchParams.get("purpose") || ""
  const startLocation = searchParams.get("startLocation") || "Office"
  const startMileageParam = searchParams.get("startMileage") || ""

  const [activeTab, setActiveTab] = useState<'visual' | 'checklist'>('visual')
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
  const [startMileage, setStartMileage] = useState(startMileageParam)

  const handleStatusChange = (id: number, status: boolean) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, status } : item
    ))
  }

  const handlePhotoUpload = (id: number) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, photo: "/placeholder-inspection.jpg" } : item
    ))
  }

  const handleSubmit = async () => {
    const allChecked = checklist.every(item => item.status !== null)
    const hasFailed = checklist.some(item => item.status === false)
    const mileageValue = Number(startMileage)

    if (!allChecked) {
      alert("Please complete all inspection items")
      return
    }

    if (!startMileage || Number.isNaN(mileageValue)) {
      alert("Please enter a valid start odometer reading")
      return
    }

    if (hasFailed) {
      alert("Inspection failed! Vehicle cannot be used. Maintenance required.")
      router.push("/mobile/trips")
    } else {
      try {
        await startTrip({
          vehicleId: vehicleId || null,
          bookingId: bookingId === "manual" ? undefined : bookingId,
          startMileage: mileageValue,
          startLocation: startLocation,
          destination: destination,
          purpose: purpose,
        })
        alert("Pre-trip inspection passed! You can now start the trip.")
        router.push("/mobile/trips")
      } catch (error) {
        console.error(error)
        alert("Failed to start trip after inspection")
      }
    }
  }

  const completedItems = checklist.filter(item => item.status !== null).length
  const passedItems = checklist.filter(item => item.status === true).length
  const failedItems = checklist.filter(item => item.status === false).length

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Pre-Trip Inspection</h1>
            <p className="text-xs text-muted-foreground">Complete before starting trip</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'visual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Eye size={16} /> Visual Exterior
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'checklist' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <ListChecks size={16} /> Checklist
          </button>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-sm text-muted-foreground">{completedItems}/{checklist.length}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: String((completedItems / checklist.length) * 100) + "%" }}
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

        {activeTab === 'visual' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-blue-800 mb-1">Visual Damage Check</h3>
              <p className="text-xs text-blue-600">Tap on the diagram below to mark any visible exterior damage (scratches, dents, etc.).</p>
            </div>
            <VehicleInspectionDiagram />

            <button
              onClick={() => setActiveTab('checklist')}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest mt-4"
            >
              Continue to Checklist
            </button>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Inspection Checklist</h3>
              {checklist.map((item) => (
                <div key={item.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-medium flex-1 text-sm">{item.item}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, true)}
                        className={
                          "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors " +
                          (item.status === true
                            ? "bg-green-600 text-white"
                            : "bg-green-50 text-green-700 hover:bg-green-100")
                        }
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, false)}
                        className={
                          "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors " +
                          (item.status === false
                            ? "bg-red-600 text-white"
                            : "bg-red-50 text-red-700 hover:bg-red-100")
                        }
                      >
                        Fail
                      </button>
                    </div>
                  </div>

                  {item.status === false && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handlePhotoUpload(item.id)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed rounded-lg hover:bg-muted transition-colors text-xs font-bold uppercase text-slate-500"
                      >
                        <Camera className="w-4 h-4" />
                        {item.photo ? "Photo Added" : "Add Photo of Issue"}
                      </button>
                      {item.photo && (
                        <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700 font-bold">
                          ✓ Photo uploaded
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-sm">Start Odometer (KM)</label>
              <input
                type="number"
                value={startMileage}
                onChange={(e) => setStartMileage(e.target.value)}
                className="w-full p-4 border rounded-xl bg-slate-50 font-bold text-lg"
                placeholder="000000"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-sm">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[100px] p-3 border rounded-xl bg-slate-50"
                placeholder="Any additional observations or concerns..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={completedItems !== checklist.length}
              className="w-full bg-[#EE401D] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              Submit Inspection
            </button>

            {failedItems > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-red-900 text-sm uppercase">Critical Issues Detected</p>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    {failedItems} item(s) failed inspection. Vehicle requires maintenance before use.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
