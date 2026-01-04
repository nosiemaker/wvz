import VehicleDetailClient from "./VehicleDetailClient";

// Static export requires generateStaticParams for dynamic routes
export function generateStaticParams() {
    // Return at least one param or an empty list if handled purely client-side
    // For Capacitor, we just need the build to pass.
    return [{ id: "1" }];
}

export default function Page() {
    return <VehicleDetailClient />;
}
