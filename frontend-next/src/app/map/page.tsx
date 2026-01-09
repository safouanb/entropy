"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-muted">
        Loading map...
      </div>
    ),
  }
);

export default function MapPage() {
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight - 56);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="h-[calc(100vh-56px)]">
      <MapContainer height={height} />
    </div>
  );
}
