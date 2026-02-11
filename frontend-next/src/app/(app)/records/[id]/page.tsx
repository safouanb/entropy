"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    FileText,
    Shield,
    Scale,
    Building2,
    ArrowLeft,
    Download,
    Share2,
    AlertTriangle,
    CheckCircle,
    Calculator,
    MapPin,
    Clock,
    Euro,
    Thermometer,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportRecordToPDF } from "@/lib/pdf-export";

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
    risk_allocation_json?: SqlNullString;
}

interface ComplianceResult {
    verdict: string;
    overall_status: string;
    regulatory_context: string;
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
    disclaimer: string;
    failure_modes?: string[];
    regulations?: Array<{
        name: string;
        status: string;
        details: string;
        article?: string;
    }>;
}

interface ScenarioResult {
    reuseScenario: string;
    ownershipModel: string;
    complianceStatus: string;
    complianceReason?: string;
    irrMinPercent: number;
    irrMaxPercent: number;
    paybackMinYears: number;
    paybackMaxYears: number;
    capexMinEur: number;
    capexMaxEur: number;
    investmentRequiredMinEur?: number;
    investmentRequiredMaxEur?: number;
    co2AvoidedMinKgYear?: number;
    co2AvoidedMaxKgYear?: number;
    requiresHeatPump?: boolean;
    requiresPipeline?: boolean;
    pipelineLengthKm?: number;
}

interface RiskAllocation {
    riskType: string;
    owner: string;
    description: string;
}

export default function DecisionRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [assessmentId, setAssessmentId] = useState<string>("");
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [parsedCompliance, setParsedCompliance] = useState<ComplianceResult | null>(null);
    const [parsedScenarios, setParsedScenarios] = useState<ScenarioResult[]>([]);
    const [parsedRiskAllocation, setParsedRiskAllocation] = useState<RiskAllocation[]>([]);

    useEffect(() => {
        const getParamsAndFetch = async () => {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                setAssessmentId(id);

                setLoading(true);
                const response = await fetch(`/api/assessments/${id}`);
                if (!response.ok) {
                    throw new Error(`Assessment not found (${response.status})`);
                }
                const assessmentData = await response.json();
                setAssessment(assessmentData);

                // Parse JSON fields (handle SqlNullString format)
                try {
                    if (assessmentData.compliance_result?.Valid && assessmentData.compliance_result.String) {
                        setParsedCompliance(JSON.parse(assessmentData.compliance_result.String));
                    }
                    if (assessmentData.scenario_results?.Valid && assessmentData.scenario_results.String) {
                        setParsedScenarios(JSON.parse(assessmentData.scenario_results.String));
                    }
                    if (assessmentData.risk_allocation_json?.Valid && assessmentData.risk_allocation_json.String) {
                        setParsedRiskAllocation(JSON.parse(assessmentData.risk_allocation_json.String));
                    }
                } catch (parseError) {
                    console.warn('Failed to parse assessment JSON:', parseError);
                }

                setError(null);
            } catch (err) {
                console.error('Failed to fetch assessment:', err);
                setError(err instanceof Error ? err.message : 'Failed to load assessment');
            } finally {
                setLoading(false);
            }
        };

        getParamsAndFetch();
    }, [params]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
                <div className="flex items-center justify-center h-64">
                    <div className="inline-flex items-center space-x-2 text-zinc-400">
                        <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                        <span className="font-mono text-sm">Loading decision record...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-400 text-lg font-mono mb-2">Record Not Found</div>
                        <div className="text-zinc-500 text-sm font-mono mb-4">{error}</div>
                        <Link href="/records">
                            <Button variant="outline" className="border-zinc-700 text-zinc-300">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Records
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const recordNumber = `DR-${new Date(assessment.created_at).getFullYear()}-${assessment.id.toString().padStart(3, '0')}`;
    const thermalLoadRange = `${(assessment.thermal_load_min_kw / 1000).toFixed(1)}-${(assessment.thermal_load_max_kw / 1000).toFixed(1)} MW`;

    const handleExportPDF = () => {
        const recordData = {
            recordNumber,
            projectName: assessment.project_name,
            status: assessment.status.toUpperCase(),
            complianceVerdict: overallCompliance,
            jurisdiction: assessment.jurisdiction,
            thermalLoadRange,
            investmentRange,
            createdAt: assessment.created_at,
            finalizedAt: assessment.completed_at?.Valid && assessment.completed_at.String ? assessment.completed_at.String : undefined
        };
        exportRecordToPDF(recordData);
    };

    // Determine overall compliance status
    let overallCompliance = "PENDING";
    if (parsedCompliance?.overall_status) {
        overallCompliance = parsedCompliance.overall_status.toUpperCase();
    }

    // Calculate investment ranges from scenarios
    let investmentRange = "Analysis Pending";
    if (parsedScenarios.length > 0) {
        const investments = parsedScenarios
            .filter(s => s.InvestmentRequiredMinEur && s.InvestmentRequiredMaxEur)
            .map(s => ({ min: s.InvestmentRequiredMinEur!, max: s.InvestmentRequiredMaxEur! }));

        if (investments.length > 0) {
            const minInvestment = Math.min(...investments.map(i => i.min));
            const maxInvestment = Math.max(...investments.map(i => i.max));
            investmentRange = `€${(minInvestment / 1000000).toFixed(1)}M - €${(maxInvestment / 1000000).toFixed(1)}M`;
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/records">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Records
                        </Button>
                    </Link>
                    <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">
                            {recordNumber}
                        </h1>
                        <p className="text-sm text-zinc-400 font-mono">
                            Decision Record • Version {assessment.version} • {assessment.status === "finalized" ? "Finalized" : "Draft"} {assessment.completed_at?.Valid && assessment.completed_at.String ? new Date(assessment.completed_at.String).toISOString().split('T')[0] : new Date(assessment.created_at).toISOString().split('T')[0]}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/20"
                        onClick={handleExportPDF}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                    <Badge className={cn(
                        "font-mono",
                        assessment.status === "finalized"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : assessment.status === "completed"
                            ? "bg-blue-950 text-blue-400 border-blue-800"
                            : "bg-amber-950 text-amber-400 border-amber-800"
                    )}>
                        {assessment.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            {/* Project Title */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-medium text-white mb-2">
                                {assessment.project_name}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-zinc-400 font-mono">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{assessment.jurisdiction}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Thermometer className="w-4 h-4" />
                                    <span>{thermalLoadRange} thermal</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Euro className="w-4 h-4" />
                                    <span>{investmentRange}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {overallCompliance === "COMPLIANT" ? (
                                <Shield className="w-5 h-5 text-emerald-500" />
                            ) : overallCompliance === "CONDITIONAL" ? (
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                            <Badge className={cn(
                                "font-mono",
                                overallCompliance === "COMPLIANT"
                                    ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                    : overallCompliance === "CONDITIONAL"
                                    ? "bg-amber-950 text-amber-400 border-amber-800"
                                    : "bg-red-950 text-red-400 border-red-800"
                            )}>
                                {overallCompliance}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Executive Summary */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                        Executive Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Verdict</p>
                                <p className="text-white font-medium">
                                    {overallCompliance === "COMPLIANT" ? "COMPLIANT - Heat Recovery Recommended" :
                                     overallCompliance === "CONDITIONAL" ? "CONDITIONAL - Review Required" :
                                     "NON-COMPLIANT - Not Recommended"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Regulatory Basis</p>
                                <p className="text-white font-medium">{parsedCompliance?.regulatory_context || assessment.applicable_regulation}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Investment Required</p>
                                <p className="text-white font-medium font-mono">{investmentRange}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Confidence Level</p>
                                <p className="text-white font-medium">{assessment.confidence_level?.Valid && assessment.confidence_level.String ? assessment.confidence_level.String : "MEDIUM"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Technical Analysis */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Technical Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Heat Load Range</p>
                                <p className="text-white font-mono">{thermalLoadRange} thermal</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Location</p>
                                <p className="text-white font-mono">{assessment.dc_location_lat.toFixed(4)}, {assessment.dc_location_lng.toFixed(4)}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Assessment Period</p>
                                <p className="text-white font-mono">Created {new Date(assessment.created_at).toISOString().split('T')[0]}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Status</p>
                                <p className="text-white font-mono">{assessment.status.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legal Compliance Analysis */}
            {parsedCompliance && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                            <Scale className="w-4 h-4 mr-2" />
                            Legal Compliance Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {/* Applicable Law */}
                        <div>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">Applicable Law</p>
                            <p className="text-white font-medium">{parsedCompliance.applicableLaw}</p>
                            <p className="text-sm text-zinc-400 mt-1">Status: <span className="font-mono text-amber-400">MANDATORY COMPLIANCE REQUIRED</span></p>
                        </div>

                        {/* Regulatory Requirements */}
                        <div>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-3">Regulatory Requirements</p>
                            <div className="space-y-2">
                                {parsedCompliance.reasoning?.map((reason, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-zinc-300 leading-relaxed">{reason}</p>
                                    </div>
                                )) || []}
                            </div>
                        </div>

                        {/* Remediation Steps */}
                        {parsedCompliance.remediationSteps && parsedCompliance.remediationSteps.length > 0 && (
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-3">Required Actions</p>
                                <div className="space-y-2">
                                    {parsedCompliance.remediationSteps.map((step, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-950/20 rounded border border-blue-800/50">
                                            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-zinc-300 leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Risk Allocation */}
            {parsedRiskAllocation.length > 0 && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Risk Allocation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0">
                            {parsedRiskAllocation.map((risk, index) => (
                                <div key={index} className="p-4 border-b border-zinc-800/50 last:border-b-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white font-medium">{risk.riskType}</h4>
                                                <Badge className="bg-blue-950 text-blue-400 border-blue-800 font-mono text-xs">
                                                    {risk.owner}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-zinc-300">{risk.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Financial Scenarios */}
            {parsedScenarios.length > 0 && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                            <Calculator className="w-4 h-4 mr-2" />
                            Financial Scenarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0">
                            {parsedScenarios.map((scenario, index) => {
                                const isRecommended = scenario.ownershipModel === "UTILITY_OWNS" && scenario.complianceStatus === "COMPLIANT";
                                return (
                                    <div key={index} className={cn(
                                        "p-4 border-b border-zinc-800/50 last:border-b-0",
                                        isRecommended && "bg-blue-950/20 border-l-4 border-l-blue-500"
                                    )}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <h4 className="text-white font-medium">{scenario.ownershipModel.replace('_', ' ')}</h4>
                                                    {isRecommended && (
                                                        <Badge className="bg-blue-950 text-blue-400 border-blue-800 font-mono text-xs">
                                                            RECOMMENDED
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-4 gap-6 text-sm">
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">IRR</p>
                                                        <p className="text-white font-mono">{scenario.irrMinPercent?.toFixed(1)}-{scenario.irrMaxPercent?.toFixed(1)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">Payback</p>
                                                        <p className="text-white font-mono">{scenario.paybackMinYears?.toFixed(0)}-{scenario.paybackMaxYears?.toFixed(0)} years</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">CAPEX</p>
                                                        <p className="text-white font-mono">€{(scenario.capexMinEur / 1000000).toFixed(1)}-{(scenario.capexMaxEur / 1000000).toFixed(1)}M</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">Status</p>
                                                        <p className={cn(
                                                            "font-mono text-xs",
                                                            scenario.complianceStatus === "COMPLIANT" ? "text-emerald-400" : "text-amber-400"
                                                        )}>{scenario.complianceStatus}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Legal Citations & References */}
            {parsedCompliance?.citations && parsedCompliance.citations.length > 0 && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Legal Citations & References
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0">
                            {parsedCompliance.citations.map((citation, index) => (
                                <div key={index} className="p-4 border-b border-zinc-800/50 last:border-b-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <Scale className="w-4 h-4 text-amber-500" />
                                                <h4 className="text-white font-medium">{citation.law}</h4>
                                                <Badge className="bg-amber-950 text-amber-400 border-amber-800 font-mono text-xs">
                                                    {citation.section}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed mb-3">{citation.summary}</p>
                                            <a
                                                href={citation.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono"
                                            >
                                                <span>{citation.url}</span>
                                                <ArrowLeft className="w-3 h-3 rotate-135" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Legal Disclaimer */}
            {parsedCompliance?.disclaimer && (
                <Card className="bg-amber-950/20 border-amber-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-amber-400 font-mono uppercase tracking-wider mb-1">Legal Disclaimer</p>
                                <p className="text-sm text-amber-200/90 leading-relaxed">{parsedCompliance.disclaimer}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analysis Conclusion */}
            {assessment.conclusion?.Valid && assessment.conclusion.String && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                            Final Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-300 leading-relaxed font-mono">{assessment.conclusion.String}</p>
                    </CardContent>
                </Card>
            )}

            {/* Document Footer */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <div className="flex items-center space-x-4">
                            <span>Generated by Entropy Decision Engine</span>
                            <span>•</span>
                            <span>Document ID: {recordNumber}</span>
                            <span>•</span>
                            <span>Version {assessment.version}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>{assessment.status === "finalized" ? "Finalized" : "Created"}: {assessment.completed_at?.Valid && assessment.completed_at.String ? new Date(assessment.completed_at.String).toISOString().split('T')[0] : new Date(assessment.created_at).toISOString().split('T')[0]}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}