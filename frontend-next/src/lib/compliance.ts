
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
