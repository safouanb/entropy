"use client";

import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/lib/backend-client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// Dynamic import for Map to avoid SSR issues
const HeatMapClient = dynamic(() => import("@/components/map/map-client"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function MapPage() {
    // Fetch All Nodes
    // In a real app we might want a specific endpoint for 'all nodes' or cluster them
    const { data: dcData, isLoading: dcLoading } = useQuery({
        queryKey: ["data-centers-map"],
        queryFn: () => predictionService.listDataCenters({ pageSize: 100 }), // Get up to 100
    });

    // Hack: We don't have a 'listAllSinks' easily accessible without a DC, or we do?
    // Let's use listNearby with a huge radius from center of NL relative to the first DC found or just a mock for now if endpoint limits
    // Actually, `listNearbyHeatSinks` requires a DC ID. 
    // Strategy: For the visual map, let's look at the implementation of `listNearbyHeatSinks` or just fetch sinks relative to the first DC found.

    // BETTER: Using `listNearbyHeatSinks` with a "dummy" DC at center of NL (52.1326, 5.2913) would be ideal if the backend supported arbitrary lat/lon search.
    // Backend `ListNearbyHeatSinks` takes `dataCenterID`. 
    // Ideally we should have `ListHeatSinks` (generic). 
    // Let's check `predictionService` definition again.
    // It has `ListHeatSinks(limit, offset)`. Perfect.

    const { data: sinksData, isLoading: sinksLoading } = useQuery({
        queryKey: ["heat-sinks-map"],
        queryFn: () => predictionService.listHeatSinks({ pageSize: 100 }),
    });

    return (
        <div className="container mx-auto py-6 max-w-7xl h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Heat Network Map</h1>
                    <p className="text-muted-foreground">Visualizing the National Heat Foundation (Supply vs Demand).</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span>Data Centers (Supply)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span>Heat Sinks (Demand)</span>
                    </div>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden border-2">
                <CardContent className="p-0 h-full">
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
                </CardContent>
            </Card>
        </div>
    );
}
