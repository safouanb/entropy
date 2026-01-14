
export type ComplianceStatus = "MANDATORY" | "VOLUNTARY" | "EXEMPT";

export type Jurisdiction = "EU" | "DE" | "NL";

export interface ComplianceRequest {
    jurisdiction: Jurisdiction;
    totalItLoadKw: number;
    planDate: string; // ISO date string
    heatRecoveryReady: boolean;
}

export interface ComplianceResult {
    status: ComplianceStatus;
    applicableLaw: string;
    complianceDeadline?: string;
    reasoning: string[];
    remediationSteps: string[];
}

export async function checkCompliance(req: ComplianceRequest): Promise<ComplianceResult> {
    const res = await fetch("/api/compliance/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    });

    if (!res.ok) {
        throw new Error("Failed to check compliance");
    }

    return res.json();
}

import { predictionService } from "./backend-client";

export async function saveDataCenter(req: ComplianceRequest, name: string): Promise<any> {
    const payload = {
        name: name,
        location: {
            latitude: 52.3676, // Default to Amsterdam for MVP if no geo input
            longitude: 4.9041
        },
        totalItLoadKw: req.totalItLoadKw,
        heatRecoveryEnabled: req.heatRecoveryReady,
        operatingHoursYear: 8760,
        dcType: "hyperscale", // Default
    };

    return predictionService.createDataCenter(payload);
}
