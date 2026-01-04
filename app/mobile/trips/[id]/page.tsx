import TripDetailClient from "./TripDetailClient";

export function generateStaticParams() {
    return [{ id: "1" }];
}

export default function Page() {
    return <TripDetailClient />;
}
