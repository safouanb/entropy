import { NextRequest, NextResponse } from "next/server";

// Direct SQLite access via backend API proxy
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Transform camelCase frontend fields to snake_case for backend
        const payload = {
            project_name: body.projectName,
            dc_location_lat: body.dcLocationLat,
            dc_location_lng: body.dcLocationLng,
            thermal_load_min_kw: body.thermalLoadMinKw,
            thermal_load_max_kw: body.thermalLoadMaxKw,
            availability_profile: body.availabilityProfile,
            uptime_constraint: body.uptimeConstraint,
            existing_cooling: body.existingCooling ? 1 : 0,
            investment_willingness: body.investmentWillingness,
            distance_to_offtaker_km: body.distanceToOfftakerKm,
            heat_demand_profile: body.heatDemandProfile,
            supply_temp_required_c: body.supplyTempRequiredC,
            existing_dh_infra: body.existingDHInfra ? 1 : 0,
            jurisdiction: body.jurisdiction,
            applicable_regulation: body.applicableRegulation,
            time_horizon_years: body.timeHorizonYears,
        };

        const res = await fetch(`${BACKEND_URL}/api/v1/assessments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend error:", errorText);
            return NextResponse.json({ error: "Failed to create assessment" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Assessment creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const limit = searchParams.get("limit") || "50";
        const offset = searchParams.get("offset") || "0";

        let url = `${BACKEND_URL}/api/v1/assessments?limit=${limit}&offset=${offset}`;
        if (status) {
            url += `&status=${status}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch assessments" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Assessment list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
