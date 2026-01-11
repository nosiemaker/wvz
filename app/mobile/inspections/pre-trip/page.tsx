"use client"

import { Suspense } from "react"
import InspectionClient from "./InspectionClient"

export default function PreTripIndex() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <InspectionClient />
        </Suspense>
    )
}
