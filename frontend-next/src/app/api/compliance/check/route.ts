import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL || "http://localhost:8080";

interface ComplianceRequest {
    jurisdiction: "EU" | "DE" | "NL";
    totalItLoadKw: number;
    planDate: string; // ISO date string
    heatRecoveryReady: boolean;
}

interface ComplianceResult {
    status: "MANDATORY" | "VOLUNTARY" | "EXEMPT";
    applicableLaw: string;
    complianceDeadline?: string;
    reasoning: string[];
    remediationSteps: string[];
}

export async function POST(request: NextRequest) {
    try {
        const body: ComplianceRequest = await request.json();

        // Call the Go backend gRPC endpoint
        const response = await fetch(
            `${BACKEND_URL}/pyrecycleheat.v1.PredictionService/CheckCompliance`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend compliance check failed:", errorData);
            return NextResponse.json(
                { error: errorData.message || "Compliance check failed" },
                { status: response.status }
            );
        }

        const result: ComplianceResult = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Compliance check error:", error);
        return NextResponse.json(
            { error: "Failed to check compliance" },
            { status: 500 }
        );
    }
}
