import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const dynamic = 'force-dynamic';

interface SqlNullString {
    String: string;
    Valid: boolean;
}

interface Assessment {
    id: number;
    project_name: string;
    jurisdiction: string;
    compliance_result?: SqlNullString;
    conclusion?: SqlNullString;
    created_at: string;
}

interface ComplianceResult {
    status: string;
    applicableLaw: string;
    reasoning: string[];
    remediationSteps: string[];
    citations: Array<{
        law: string;
        section: string;
        summary: string;
        url: string;
    }>;
}

export async function GET() {
    try {
        // Fetch real assessments from backend
        const response = await fetch(`${BACKEND_URL}/api/v1/assessments`);
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const { assessments = [] }: { assessments: Assessment[] } = await response.json();

        // Extract real compliance data from assessments
        const regulations: any[] = [];
        const auditLogs: any[] = [];
        const jurisdictionCounts: { [key: string]: { compliant: number; nonCompliant: number; total: number } } = {};

        assessments.forEach((assessment) => {
            // Initialize jurisdiction tracking
            if (!jurisdictionCounts[assessment.jurisdiction]) {
                jurisdictionCounts[assessment.jurisdiction] = { compliant: 0, nonCompliant: 0, total: 0 };
            }
            jurisdictionCounts[assessment.jurisdiction].total++;

            // Parse compliance result
            let parsedCompliance: ComplianceResult | null = null;
            if (assessment.compliance_result?.Valid && assessment.compliance_result.String) {
                try {
                    parsedCompliance = JSON.parse(assessment.compliance_result.String);
                } catch (e) {
                    console.warn('Failed to parse compliance result:', e);
                }
            }

            // Determine compliance status
            let status = "PENDING";
            let verdict = "Analysis Pending";

            if (assessment.conclusion?.Valid && assessment.conclusion.String) {
                if (assessment.conclusion.String.includes("VERDICT: COMPLIANT")) {
                    status = "COMPLIANT";
                    verdict = "Compliant with regulations";
                    jurisdictionCounts[assessment.jurisdiction].compliant++;
                } else if (assessment.conclusion.String.includes("VERDICT: NON_COMPLIANT")) {
                    status = "NON_COMPLIANT";
                    verdict = "Non-compliant - action required";
                    jurisdictionCounts[assessment.jurisdiction].nonCompliant++;
                }
            } else if (parsedCompliance?.status === "MANDATORY") {
                status = "NON_COMPLIANT";
                verdict = "Mandatory requirements not met";
                jurisdictionCounts[assessment.jurisdiction].nonCompliant++;
            }

            // Add regulation entry for this assessment
            regulations.push({
                id: `assessment-${assessment.id}`,
                regulation: parsedCompliance?.applicableLaw || `${assessment.jurisdiction} Regulations`,
                description: `${assessment.project_name} compliance assessment`,
                status,
                lastChecked: assessment.created_at,
                metric: verdict,
                nextAction: status === "NON_COMPLIANT" ? "Remediation required" : "Maintain compliance"
            });

            // Add audit log entry
            auditLogs.push({
                id: `log-${assessment.id}`,
                timestamp: assessment.created_at,
                event: "Compliance Assessment",
                user: "system",
                status: status === "COMPLIANT" ? "SUCCESS" : status === "NON_COMPLIANT" ? "FAILURE" : "INFO",
                detail: `${assessment.project_name}: ${verdict}`
            });

            // Add specific regulatory requirements as separate entries
            if (parsedCompliance?.reasoning) {
                parsedCompliance.reasoning.forEach((reason, index) => {
                    if (reason.includes("§") || reason.includes("Art.")) {
                        // Extract section reference
                        const sectionMatch = reason.match(/(§\d+|Art\. \d+|EnEfG)/);
                        const section = sectionMatch ? sectionMatch[0] : `Req-${index + 1}`;

                        regulations.push({
                            id: `${assessment.id}-${index}`,
                            regulation: `${parsedCompliance.applicableLaw} ${section}`,
                            description: reason.substring(0, 100) + (reason.length > 100 ? '...' : ''),
                            status: status,
                            lastChecked: assessment.created_at,
                            metric: "Assessment-based",
                            nextAction: status === "NON_COMPLIANT" ? "Required action" : "Monitor"
                        });
                    }
                });
            }
        });

        // Add jurisdiction summary regulations
        Object.entries(jurisdictionCounts).forEach(([jurisdiction, counts]) => {
            const complianceRate = counts.total > 0 ? (counts.compliant / counts.total * 100).toFixed(0) : "0";

            regulations.unshift({
                id: `jurisdiction-${jurisdiction}`,
                regulation: `${jurisdiction} Overall Compliance`,
                description: `Jurisdiction-wide compliance monitoring for ${counts.total} projects`,
                status: counts.nonCompliant === 0 ? "COMPLIANT" : counts.nonCompliant > counts.compliant ? "NON_COMPLIANT" : "WARNING",
                lastChecked: new Date().toISOString(),
                metric: `${complianceRate}% compliant (${counts.compliant}/${counts.total})`,
                nextAction: counts.nonCompliant > 0 ? `Address ${counts.nonCompliant} non-compliant projects` : "Continue monitoring"
            });
        });

        // Sort by most recent
        auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({
            regulations: regulations.slice(0, 20), // Limit to 20 most relevant
            auditLogs: auditLogs.slice(0, 15) // Limit to 15 most recent
        });

    } catch (error) {
        console.error('Failed to fetch compliance data:', error);

        // Return minimal fallback
        return NextResponse.json({
            regulations: [{
                id: "error",
                regulation: "Compliance Service",
                description: "Unable to fetch compliance data",
                status: "PENDING",
                lastChecked: new Date().toISOString(),
                metric: "Service unavailable",
                nextAction: "Check backend connection"
            }],
            auditLogs: [{
                id: "error-log",
                timestamp: new Date().toISOString(),
                event: "Service Error",
                user: "system",
                status: "FAILURE",
                detail: "Failed to connect to compliance service"
            }]
        });
    }
}