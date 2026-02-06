"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet generic marker icon missing with fallback
let iconDefaultUrl: string;
let iconRetinaUrl: string;
let shadowUrl: string;

try {
    iconDefaultUrl = '/leaflet/marker-icon.png';
    iconRetinaUrl = '/leaflet/marker-icon-2x.png';
    shadowUrl = '/leaflet/marker-shadow.png';
} catch (e) {
    iconDefaultUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iIzMzNzNkYyIvPgo8L3N2Zz4K';
    iconRetinaUrl = iconDefaultUrl;
    shadowUrl = '';
}

// @ts-ignore
if (typeof window !== 'undefined' && L.Icon.Default.prototype._getIconUrl) {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl: iconDefaultUrl,
    shadowUrl,
});

// Memoized custom icons to prevent recreation on every render
const createDcIcon = () => new L.DivIcon({
    html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    className: 'custom-div-icon'
});

const createSinkIcon = () => new L.DivIcon({
    html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    className: 'custom-div-icon'
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

// MapCleanup component to handle memory leaks
function MapCleanup() {
    const map = useMap();

    useEffect(() => {
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map]);

    return null;
}

export default function HeatMapClient({ dataCenters, heatSinks }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);

    // Default center (Netherlands)
    const center: [number, number] = [52.1326, 5.2913];

    // Memoize icons to prevent recreation
    const dcIcon = useMemo(() => createDcIcon(), []);
    const sinkIcon = useMemo(() => createSinkIcon(), []);

    // Memoize filtered data to prevent unnecessary re-renders
    const validDataCenters = useMemo(() =>
        dataCenters.filter(dc => dc.location?.latitude && dc.location?.longitude),
        [dataCenters]
    );

    const validHeatSinks = useMemo(() =>
        heatSinks.filter(sink => sink.location?.latitude && sink.location?.longitude),
        [heatSinks]
    );

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
            ref={mapRef}
            preferCanvas={true}
        >
            <MapCleanup />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={18}
                tileSize={256}
            />

            {validDataCenters.map((dc) => (
                <Marker
                    key={`dc-${dc.id}`}
                    position={[dc.location!.latitude, dc.location!.longitude]}
                    icon={dcIcon}
                >
                    <Popup>
                        <strong>{dc.name}</strong><br />
                        Type: Data Center (Supply)<br />
                        Load: {dc.totalItLoadKw} kW
                    </Popup>
                </Marker>
            ))}

            {validHeatSinks.map((sink) => (
                <Marker
                    key={`sink-${sink.id}`}
                    position={[sink.location!.latitude, sink.location!.longitude]}
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
