"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

type RouteViewerProps = {
    start: [number, number]
    dest: [number, number]
}

function MapBounds({ points }: { points: [number, number][] }) {
    const map = useMap()

    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points)
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [points, map])

    return null
}

export default function RouteViewer({ start, dest }: RouteViewerProps) {
    const [route, setRoute] = useState<[number, number][]>([])
    const [distance, setDistance] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
                const res = await fetch(url)
                const data = await res.json()

                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])
                    setRoute(coordinates)
                    setDistance(Math.round((data.routes[0].distance / 1000) * 10) / 10)
                }
            } catch (err) {
                console.error("Failed to fetch route:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchRoute()
    }, [start, dest])

    // Need to cast components because react-leaflet v5 has some type issues with Next.js/React 19
    const MapContainerAny = MapContainer as any
    const TileLayerAny = TileLayer as any
    const MarkerAny = Marker as any
    const PolylineAny = Polyline as any

    return (
        <div className="space-y-4">
            <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border relative z-0">
                <MapContainerAny center={start} zoom={13} className="h-full w-full">
                    <TileLayerAny
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapBounds points={[start, dest, ...route] as [number, number][]} />

                    <MarkerAny position={start}>
                        <Popup>Start Location</Popup>
                    </MarkerAny>

                    <MarkerAny position={dest}>
                        <Popup>Destination</Popup>
                    </MarkerAny>

                    {route.length > 0 && (
                        <PolylineAny positions={route} color="#EE401D" weight={4} opacity={0.7} />
                    )}
                </MapContainerAny>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase font-black">Approx. Road Distance</p>
                        <p className="font-bold text-lg">{distance !== null ? `${distance} km` : "Calculating..."}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
