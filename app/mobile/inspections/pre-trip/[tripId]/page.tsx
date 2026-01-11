import { Suspense } from "react"
import InspectionClient from "./InspectionClient"

export function generateStaticParams() {
    return [{ tripId: "1" }];
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <InspectionClient />
        </Suspense>
    )
}
