import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const dynamic = 'force-dynamic';

interface SqlNullString {
    String: string;
    Valid: boolean;
}

interface Assessment {
    id: number;
    version: number;
    project_name: string;
    dc_location_lat: number;
    dc_location_lng: number;
    thermal_load_min_kw: number;
    thermal_load_max_kw: number;
    jurisdiction: string;
    applicable_regulation: string;
    status: string;
    scenario_results?: SqlNullString;
    compliance_result?: SqlNullString;
    conclusion?: SqlNullString;
    created_at: string;
    completed_at?: SqlNullString;
    confidence_level?: SqlNullString;
}

interface ComplianceResult {
    status: string;
    overall_status?: string;
    applicableLaw: string;
    reasoning: string[];
}

interface ScenarioResult {
    reuseScenario: string;
    ownershipModel: string;
    complianceStatus: string;
    investmentRequiredMinEur?: number;
    investmentRequiredMaxEur?: number;
}

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/assessments`);
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const { assessments = [] }: { assessments: Assessment[] } = await response.json();

        // Transform assessments to decision records format
        const records = assessments.map((assessment) => {
            const recordNumber = `DR-${new Date(assessment.created_at).getFullYear()}-${assessment.id.toString().padStart(3, '0')}`;
            const thermalLoadRange = `${(assessment.thermal_load_min_kw / 1000).toFixed(1)}-${(assessment.thermal_load_max_kw / 1000).toFixed(1)} MW`;

            // Parse compliance result from SqlNullString structure
            let parsedCompliance: ComplianceResult | undefined;
            try {
                if (assessment.compliance_result?.Valid && assessment.compliance_result.String) {
                    parsedCompliance = JSON.parse(assessment.compliance_result.String);
                }
            } catch (e) {
                console.warn('Failed to parse compliance JSON:', e);
            }

            // Parse scenario results from SqlNullString structure
            let parsedScenarios: ScenarioResult[] = [];
            try {
                if (assessment.scenario_results?.Valid && assessment.scenario_results.String) {
                    parsedScenarios = JSON.parse(assessment.scenario_results.String);
                }
            } catch (e) {
                console.warn('Failed to parse scenario JSON:', e);
            }

            // Determine compliance verdict
            let complianceVerdict = "PENDING";
            if (parsedCompliance?.status) {
                switch (parsedCompliance.status.toUpperCase()) {
                    case "COMPLIANT":
                    case "MANDATORY":
                        complianceVerdict = parsedCompliance.status.toUpperCase() === "COMPLIANT" ? "COMPLIANT" : "NON_COMPLIANT";
                        break;
                    case "CONDITIONAL":
                        complianceVerdict = "CONDITIONAL";
                        break;
                    case "NON_COMPLIANT":
                        complianceVerdict = "NON_COMPLIANT";
                        break;
                }
            }

            // Calculate investment range
            let investmentRange = "Analysis Pending";
            if (parsedScenarios.length > 0) {
                const investments = parsedScenarios
                    .filter(s => s.investmentRequiredMinEur && s.investmentRequiredMaxEur)
                    .map(s => ({ min: s.investmentRequiredMinEur!, max: s.investmentRequiredMaxEur! }));

                if (investments.length > 0) {
                    const minInvestment = Math.min(...investments.map(i => i.min));
                    const maxInvestment = Math.max(...investments.map(i => i.max));
                    investmentRange = `€${(minInvestment / 1000000).toFixed(1)}M - €${(maxInvestment / 1000000).toFixed(1)}M`;
                }
            }

            return {
                id: assessment.id.toString(),
                recordNumber,
                projectName: assessment.project_name,
                status: assessment.status.toUpperCase(),
                complianceVerdict,
                jurisdiction: assessment.jurisdiction,
                thermalLoadRange,
                investmentRange,
                createdAt: assessment.created_at,
                finalizedAt: assessment.completed_at?.Valid && assessment.completed_at.String ? assessment.completed_at.String : null,
                version: "1.0"
            };
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error("Records fetch failed:", error);
        // Return empty array on error to trigger empty state instead of crashing
        return NextResponse.json([]);
    }
}
