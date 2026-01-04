import InspectionClient from "./InspectionClient";

export function generateStaticParams() {
    return [{ tripId: "1" }];
}

export default function Page() {
    return <InspectionClient />;
}
