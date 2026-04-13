"use client";

import "leaflet/dist/leaflet.css";

import { divIcon, type LatLngExpression } from "leaflet";
import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";

export interface AddressCoordinates {
  lat: number;
  lng: number;
}

interface AddressMapProps {
  center: AddressCoordinates;
  markerPosition: AddressCoordinates | null;
  onSelectPosition: (coordinates: AddressCoordinates) => void;
}

const DEFAULT_ZOOM = 13;

function MapUpdater({ center }: { center: AddressCoordinates }) {
  const map = useMap();
  map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  return null;
}

function MapSelectionHandler({
  onSelectPosition
}: {
  onSelectPosition: (coordinates: AddressCoordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onSelectPosition({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    }
  });

  return null;
}

export function AddressMap({
  center,
  markerPosition,
  onSelectPosition
}: AddressMapProps) {
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "shipping-map-pin",
        html: '<span class="shipping-map-pin__dot"></span>',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      }),
    []
  );

  const mapCenter: LatLngExpression = [center.lat, center.lng];

  return (
    <div className="overflow-hidden rounded-[1rem] border border-line">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-[236px] w-full bg-[#f7efe7]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        <MapSelectionHandler onSelectPosition={onSelectPosition} />
        {markerPosition ? (
          <Marker
            position={[markerPosition.lat, markerPosition.lng]}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const nextLatLng = event.target.getLatLng();
                onSelectPosition({
                  lat: nextLatLng.lat,
                  lng: nextLatLng.lng
                });
              }
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
