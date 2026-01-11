"use client"

import { Suspense } from "react"
import InspectionClient from "./InspectionClient"

export default function PostTripIndex() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <InspectionClient />
        </Suspense>
    )
}
