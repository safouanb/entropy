"use client";

// import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet generic marker icon missing
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const dcIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const sinkIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Location {
    latitude: number;
    longitude: number;
}
interface MapNode {
    id: number | string;
    name: string;
    location?: Location;
    [key: string]: any;
}

interface MapProps {
    dataCenters: MapNode[];
    heatSinks: MapNode[];
}

export default function HeatMapClient({ dataCenters, heatSinks }: MapProps) {
    // Default center (Netherlands)
    const center: [number, number] = [52.1326, 5.2913];

    return (
        <MapContainer center={center} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {dataCenters.map((dc) => (
                <Marker
                    key={`dc-${dc.id}`}
                    position={[dc.location?.latitude || 52, dc.location?.longitude || 5]}
                    icon={dcIcon}
                >
                    <Popup>
                        <strong>{dc.name}</strong><br />
                        Type: Data Center (Supply)<br />
                        Load: {dc.totalItLoadKw} kW
                    </Popup>
                </Marker>
            ))}

            {heatSinks.map((sink) => (
                <Marker
                    key={`sink-${sink.id}`}
                    position={[sink.location?.latitude || 52, sink.location?.longitude || 5]}
                    icon={sinkIcon}
                >
                    <Popup>
                        <strong>{sink.name}</strong><br />
                        Type: {sink.sinkType} (Demand)<br />
                        Capacity: {sink.capacityMw} MW
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
