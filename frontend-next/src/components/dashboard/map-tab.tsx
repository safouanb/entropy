"use client";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] flex items-center justify-center bg-muted rounded-lg">
        Loading map...
      </div>
    ),
  }
);

export function MapTab() {
  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <MapContainer height={500} />
      </CardContent>
    </Card>
  );
}
