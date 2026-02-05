import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const response = await predictionService.listDataCenters({ page: 1, pageSize: 50 });

        // Map backend DC entitites to frontend 'Record' format
        const records = (response.dataCenters || []).map((dc: any) => ({
            id: `DC-${dc.id || Math.floor(Math.random() * 1000)}`,
            name: dc.name || "Unknown DC",
            status: dc.status || "Unknown",
            wasteHeat: `${dc.capacityMw || 0} MW`,
            date: new Date().toISOString().split('T')[0], // Mock date for now
            region: String(dc.location || "Unknown")
        }));

        return NextResponse.json(records);
    } catch (error) {
        console.error("Records fetch failed:", error);
        // Return empty array on error to trigger empty state instead of crashing
        return NextResponse.json([]);
    }
}
