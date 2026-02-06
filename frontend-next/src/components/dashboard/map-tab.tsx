"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/lib/backend-client";
import dynamic from "next/dynamic";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const HeatMapClient = dynamic(() => import("@/components/map/map-client"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-muted rounded-lg">
      <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" />
      Loading map...
    </div>
  ),
});

export function MapTab() {
  // Fetch data for the map
  const { data: dcData, isLoading: dcLoading } = useQuery({
    queryKey: ["data-centers-dashboard"],
    queryFn: () => predictionService.listDataCenters({ pageSize: 100 }),
  });

  const { data: sinksData, isLoading: sinksLoading } = useQuery({
    queryKey: ["heat-sinks-dashboard"],
    queryFn: () => predictionService.listHeatSinks({ pageSize: 100 }),
  });

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <div style={{ height: "500px" }}>
          {dcLoading || sinksLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" />
              Loading Geospatial Data...
            </div>
          ) : (
            <HeatMapClient
              dataCenters={(dcData as any)?.dataCenters || []}
              heatSinks={(sinksData as any)?.heatSinks || []}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
