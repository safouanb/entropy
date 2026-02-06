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
    scenario_results?: string;
    compliance_result?: string;
    conclusion?: string;
    created_at: string;
    completed_at?: string;
    confidence_level?: string;
    risk_allocation_json?: string;
}

interface ComplianceResult {
    verdict: string;
    overall_status: string;
    regulatory_context: string;
    failure_modes?: string[];
    regulations?: Array<{
        name: string;
        status: string;
        details: string;
        article?: string;
    }>;
}

interface ScenarioResult {
    ReuseScenario: string;
    OwnershipModel: string;
    ComplianceStatus: string;
    ComplianceReason?: string;
    IRRMinPercent: number;
    IRRMaxPercent: number;
    PaybackMinYears: number;
    PaybackMaxYears: number;
    CapexMinEur: number;
    CapexMaxEur: number;
    InvestmentRequiredMinEur?: number;
    InvestmentRequiredMaxEur?: number;
    CO2AvoidedMinKgYear?: number;
    CO2AvoidedMaxKgYear?: number;
    RequiresHeatPump?: boolean;
    RequiresPipeline?: boolean;
    PipelineLengthKm?: number;
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

                // Parse JSON fields
                try {
                    if (assessmentData.compliance_result) {
                        setParsedCompliance(JSON.parse(assessmentData.compliance_result));
                    }
                    if (assessmentData.scenario_results) {
                        setParsedScenarios(JSON.parse(assessmentData.scenario_results));
                    }
                    if (assessmentData.risk_allocation_json) {
                        setParsedRiskAllocation(JSON.parse(assessmentData.risk_allocation_json));
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
                        <Link href="/dashboard">
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
                    <Link href="/dashboard">
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
                            Decision Record • Version {assessment.version} • {assessment.status === "finalized" ? "Finalized" : "Draft"} {assessment.completed_at ? new Date(assessment.completed_at).toISOString().split('T')[0] : new Date(assessment.created_at).toISOString().split('T')[0]}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
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
                                <p className="text-white font-medium">{assessment.confidence_level || "MEDIUM"}</p>
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

            {/* Compliance Analysis */}
            {parsedCompliance && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                            <Scale className="w-4 h-4 mr-2" />
                            Compliance Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0">
                            {parsedCompliance.regulations?.map((regulation, index) => (
                                <div key={index} className="p-4 border-b border-zinc-800/50 last:border-b-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                {regulation.status === "COMPLIANT" ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                )}
                                                <h4 className="text-white font-medium">{regulation.name}</h4>
                                                <Badge
                                                    className={cn(
                                                        "font-mono text-xs",
                                                        regulation.status === "COMPLIANT"
                                                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                                            : "bg-amber-950 text-amber-400 border-amber-800"
                                                    )}
                                                >
                                                    {regulation.status}
                                                </Badge>
                                            </div>
                                            {regulation.article && (
                                                <p className="text-xs text-zinc-500 font-mono mb-2">{regulation.article}</p>
                                            )}
                                            <p className="text-sm text-zinc-300">{regulation.details}</p>
                                        </div>
                                    </div>
                                </div>
                            )) || (
                                <div className="p-4">
                                    <div className="text-sm text-zinc-400">
                                        Overall Status: <span className="text-white font-mono">{parsedCompliance.overall_status}</span>
                                    </div>
                                    <div className="text-sm text-zinc-300 mt-2">{parsedCompliance.regulatory_context}</div>
                                </div>
                            )}
                        </div>
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
                                const isRecommended = scenario.OwnershipModel === "UTILITY_OWNS" && scenario.ComplianceStatus === "COMPLIANT";
                                return (
                                    <div key={index} className={cn(
                                        "p-4 border-b border-zinc-800/50 last:border-b-0",
                                        isRecommended && "bg-blue-950/20 border-l-4 border-l-blue-500"
                                    )}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <h4 className="text-white font-medium">{scenario.OwnershipModel.replace('_', ' ')}</h4>
                                                    {isRecommended && (
                                                        <Badge className="bg-blue-950 text-blue-400 border-blue-800 font-mono text-xs">
                                                            RECOMMENDED
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-4 gap-6 text-sm">
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">IRR</p>
                                                        <p className="text-white font-mono">{scenario.IRRMinPercent?.toFixed(1)}-{scenario.IRRMaxPercent?.toFixed(1)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">Payback</p>
                                                        <p className="text-white font-mono">{scenario.PaybackMinYears?.toFixed(0)}-{scenario.PaybackMaxYears?.toFixed(0)} years</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">CAPEX</p>
                                                        <p className="text-white font-mono">€{(scenario.CapexMinEur / 1000000).toFixed(1)}-{(scenario.CapexMaxEur / 1000000).toFixed(1)}M</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 font-mono text-xs mb-1">Status</p>
                                                        <p className={cn(
                                                            "font-mono text-xs",
                                                            scenario.ComplianceStatus === "COMPLIANT" ? "text-emerald-400" : "text-amber-400"
                                                        )}>{scenario.ComplianceStatus}</p>
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

            {/* Raw Conclusion */}
            {assessment.conclusion && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                            Analysis Conclusion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-300 leading-relaxed">{assessment.conclusion}</p>
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
                            <span>{assessment.status === "finalized" ? "Finalized" : "Created"}: {new Date(assessment.completed_at || assessment.created_at).toISOString().split('T')[0]}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}