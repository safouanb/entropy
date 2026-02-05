
import { NextResponse } from 'next/server';
import { predictionService } from '@/lib/backend-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Seed Data Centers
        const dc1 = { name: "Frankfurt Hyperscale DC 01", location: "Frankfurt, Germany", latitude: 50.1109, longitude: 8.6821, capacityMw: 45.5, status: "ACTIVE" };
        const dc2 = { name: "Munich Edge Node", location: "Munich, Germany", latitude: 48.1351, longitude: 11.5820, capacityMw: 12.0, status: "PLANNED" };
        const dc3 = { name: "Hamburg Port Colo", location: "Hamburg, Germany", latitude: 53.5511, longitude: 9.9937, capacityMw: 28.2, status: "ACTIVE" };

        await predictionService.createDataCenter(dc1 as any).catch(e => console.log("DC1 likely exists", e));
        await predictionService.createDataCenter(dc2 as any).catch(e => console.log("DC2 likely exists", e));
        await predictionService.createDataCenter(dc3 as any).catch(e => console.log("DC3 likely exists", e));

        // Seed Heat Sinks
        const hs1 = { name: "Frankfurt District Heating Grid", location: "Frankfurt", latitude: 50.1150, longitude: 8.6850, demandMw: 150.0 };
        const hs2 = { name: "Munich Residential Area North", location: "Munich", latitude: 48.1400, longitude: 11.5900, demandMw: 40.0 };

        await predictionService.createHeatSink(hs1 as any).catch(e => console.log("HS1 likely exists", e));
        await predictionService.createHeatSink(hs2 as any).catch(e => console.log("HS2 likely exists", e));

        return NextResponse.json({ message: "Seeding initiated. Check server logs for details." });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
