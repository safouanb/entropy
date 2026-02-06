"use client";

import React, { useState } from "react";
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

// Mock decision record data
const mockRecord = {
    id: "dr-001",
    recordNumber: "DR-2026-001",
    projectName: "Amsterdam Hyperscale DC → Residential District 4",
    status: "FINALIZED",
    complianceVerdict: "COMPLIANT",
    jurisdiction: "NL",
    primaryRiskBearer: "District Heating Authority",
    createdAt: "2026-02-01",
    finalizedAt: "2026-02-04",
    version: "1.0",

    // Executive Summary
    executiveSummary: {
        verdict: "COMPLIANT - Direct Reuse Recommended",
        primaryRiskBearer: "District Heating Authority",
        investmentRequired: "€2.1M - €3.4M",
        regulatoryBasis: "EED Article 14, Netherlands Environmental Code"
    },

    // Technical Analysis
    technicalAnalysis: {
        heatLoad: "1.2-2.8 MW thermal",
        pipeline: "2.3km, DN300 pre-insulated",
        temperatureCompatibility: "Native (no heat pump required)",
        efficiency: "92% thermal efficiency expected"
    },

    // Compliance Analysis
    complianceAnalysis: [
        {
            regulation: "EU Energy Efficiency Directive",
            status: "COMPLIANT",
            article: "Article 14 - Cogeneration and district heating",
            details: "Project meets requirements for waste heat recovery from data centers >20MW"
        },
        {
            regulation: "Netherlands Environmental Code",
            status: "COMPLIANT",
            article: "Chapter 9 - Energy efficiency",
            details: "Compliant with national implementation of EED requirements"
        },
        {
            regulation: "Municipal Heat Ordinance Amsterdam",
            status: "CONDITIONAL",
            article: "Section 4.2 - District heating connections",
            details: "Building permit required within 180 days of project commencement"
        }
    ],

    // Risk Allocation
    riskAllocation: [
        {
            riskType: "Technical Risk",
            owner: "District Heating Authority",
            description: "Pipeline construction, heat exchanger performance, system integration"
        },
        {
            riskType: "Regulatory Risk",
            owner: "Shared (documented mitigation)",
            description: "Permit delays, regulatory changes, compliance maintenance"
        },
        {
            riskType: "Commercial Risk",
            owner: "Data Center Operator",
            description: "Operational continuity, backup cooling, service level agreements"
        }
    ],

    // Financial Scenarios
    financialScenarios: [
        {
            model: "DC_OWNS",
            irr: "8.2-12.4%",
            payback: "7-12 years",
            npv: "€1.2M - €2.8M",
            recommended: false
        },
        {
            model: "UTILITY_OWNS",
            irr: "12.1-18.7%",
            payback: "5-8 years",
            npv: "€2.4M - €4.1M",
            recommended: true
        },
        {
            model: "THIRD_PARTY",
            irr: "15.2-22.3%",
            payback: "4-6 years",
            npv: "€3.1M - €5.2M",
            recommended: false
        }
    ],

    // Citations
    citations: [
        "[1] EU Energy Efficiency Directive (2012/27/EU), Article 14",
        "[2] Netherlands Environmental and Planning Act (Omgevingswet)",
        "[3] Amsterdam Heat Transition Plan 2030",
        "[4] ASHRAE Standard 90.1 - Energy Standard for Buildings",
        "[5] Dutch Technical Agreement BRL 5421 - District Heating Systems"
    ]
};

export default function DecisionRecordDetailPage() {
    const record = mockRecord;

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
                            {record.recordNumber}
                        </h1>
                        <p className="text-sm text-zinc-400 font-mono">
                            Decision Record • Version {record.version} • Finalized {record.finalizedAt}
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
                    <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 font-mono">
                        FINALIZED
                    </Badge>
                </div>
            </div>

            {/* Project Title */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-medium text-white mb-2">
                                {record.projectName}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-zinc-400 font-mono">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{record.jurisdiction}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Thermometer className="w-4 h-4" />
                                    <span>{record.technicalAnalysis.heatLoad}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Euro className="w-4 h-4" />
                                    <span>{record.executiveSummary.investmentRequired}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 font-mono">
                                COMPLIANT
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
                                <p className="text-white font-medium">{record.executiveSummary.verdict}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Primary Risk Bearer</p>
                                <p className="text-white font-medium">{record.executiveSummary.primaryRiskBearer}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Investment Required</p>
                                <p className="text-white font-medium font-mono">{record.executiveSummary.investmentRequired}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Regulatory Basis</p>
                                <p className="text-white font-medium">{record.executiveSummary.regulatoryBasis}</p>
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
                                <p className="text-white font-mono">{record.technicalAnalysis.heatLoad}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Pipeline Specification</p>
                                <p className="text-white font-mono">{record.technicalAnalysis.pipeline}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Temperature Compatibility</p>
                                <p className="text-white font-mono">{record.technicalAnalysis.temperatureCompatibility}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">System Efficiency</p>
                                <p className="text-white font-mono">{record.technicalAnalysis.efficiency}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Analysis */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                        <Scale className="w-4 h-4 mr-2" />
                        Compliance Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {record.complianceAnalysis.map((item, index) => (
                            <div key={index} className="p-4 border-b border-zinc-800/50 last:border-b-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {item.status === "COMPLIANT" ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            )}
                                            <h4 className="text-white font-medium">{item.regulation}</h4>
                                            <Badge
                                                className={cn(
                                                    "font-mono text-xs",
                                                    item.status === "COMPLIANT"
                                                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                                        : "bg-amber-950 text-amber-400 border-amber-800"
                                                )}
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-zinc-500 font-mono mb-2">{item.article}</p>
                                        <p className="text-sm text-zinc-300">{item.details}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Risk Allocation */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Risk Allocation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {record.riskAllocation.map((risk, index) => (
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

            {/* Financial Scenarios */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Financial Scenarios
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {record.financialScenarios.map((scenario, index) => (
                            <div key={index} className={cn(
                                "p-4 border-b border-zinc-800/50 last:border-b-0",
                                scenario.recommended && "bg-blue-950/20 border-l-4 border-l-blue-500"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <h4 className="text-white font-medium">{scenario.model.replace('_', ' ')}</h4>
                                            {scenario.recommended && (
                                                <Badge className="bg-blue-950 text-blue-400 border-blue-800 font-mono text-xs">
                                                    RECOMMENDED
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 gap-6 text-sm">
                                            <div>
                                                <p className="text-zinc-500 font-mono text-xs mb-1">IRR</p>
                                                <p className="text-white font-mono">{scenario.irr}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 font-mono text-xs mb-1">Payback</p>
                                                <p className="text-white font-mono">{scenario.payback}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 font-mono text-xs mb-1">NPV</p>
                                                <p className="text-white font-mono">{scenario.npv}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Citations & References */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                        Citations & References
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {record.citations.map((citation, index) => (
                            <p key={index} className="text-xs text-zinc-400 font-mono leading-relaxed">
                                {citation}
                            </p>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Document Footer */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <div className="flex items-center space-x-4">
                            <span>Generated by Entropy Decision Engine</span>
                            <span>•</span>
                            <span>Document ID: {record.recordNumber}</span>
                            <span>•</span>
                            <span>Version {record.version}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>Finalized: {record.finalizedAt}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}