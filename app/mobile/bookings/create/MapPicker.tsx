"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from "react-leaflet"

type MapPick = { lat: number; lng: number }

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

function MapClickHandler({ onSelect }: { onSelect: (pos: MapPick) => void }) {
  useMapEvents({
    click(event: { latlng: { lat: number; lng: number } }) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })
  return null
}

export default function MapPicker({
  center,
  selectedPos,
  onSelect,
}: {
  center: [number, number]
  selectedPos: MapPick | null
  onSelect: (pos: MapPick) => void
}) {
  const MapContainerAny = MapContainer as unknown as React.ComponentType<any>
  const TileLayerAny = TileLayer as unknown as React.ComponentType<any>
  const CircleMarkerAny = CircleMarker as unknown as React.ComponentType<any>

  return (
    <MapContainerAny center={center} zoom={13} scrollWheelZoom={false} className="h-[260px] w-full relative z-0">
      <TileLayerAny
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <MapClickHandler onSelect={onSelect} />
      {selectedPos && (
        <CircleMarkerAny center={[selectedPos.lat, selectedPos.lng]} radius={8} pathOptions={{ color: "#EE401D" }} />
      )}
    </MapContainerAny>
  )
}
