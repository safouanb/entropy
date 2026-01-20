'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DecisionRecordDocument } from './report-pdf';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface AssessmentResultsViewProps {
    id: string;
}

interface ReuseScenario {
    reuseScenario: 'NO_REUSE' | 'DIRECT_REUSE' | 'REUSE_WITH_MITIGATION';
    ownershipModel: string;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'CONDITIONAL';
    complianceReason: string;
    failureMode: string;
    riskOwner: string;
    capexMinEur: number;
    capexMaxEur: number;
    opexMinEurYear: number;
    opexMaxEurYear: number;
    paybackMinYears: number;
    paybackMaxYears: number;
    irrMinPercent: number;
    irrMaxPercent: number;
    co2AvoidedMinKgYear: number;
    co2AvoidedMaxKgYear: number;
    regulatoryExposure?: string;
    mitigationType?: string;
}

const getScenarioLabel = (scenario: string): string => {
    switch (scenario) {
        case 'NO_REUSE': return 'Scenario A: No Heat Reuse';
        case 'DIRECT_REUSE': return 'Scenario B: Direct Reuse';
        case 'REUSE_WITH_MITIGATION': return 'Scenario C: Reuse + Mitigation';
        default: return scenario;
    }
};

const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
        case 'NO_REUSE': return XCircle;
        case 'DIRECT_REUSE': return AlertTriangle;
        case 'REUSE_WITH_MITIGATION': return CheckCircle;
        default: return AlertTriangle;
    }
};

const getStatusColors = (status: string) => {
    switch (status) {
        case 'COMPLIANT':
            return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', badge: 'bg-green-500' };
        case 'NON_COMPLIANT':
            return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', badge: 'bg-red-500' };
        case 'CONDITIONAL':
            return { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', badge: 'bg-amber-500' };
        default:
            return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-500' };
    }
};

export function AssessmentResultsView({ id }: AssessmentResultsViewProps) {
    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const res = await fetch(`/api/v1/assessments/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAssessment(data);
                }
            } catch (error) {
                console.error("Failed to fetch assessment", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessment();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-gray-500">Loading Decision Record...</div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="p-8 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-500">Assessment not found.</p>
            </div>
        );
    }

    const scenarios: ReuseScenario[] = assessment.scenario_results
        ? JSON.parse(assessment.scenario_results)
        : [];
    const compliance = assessment.compliance_result
        ? JSON.parse(assessment.compliance_result)
        : { status: 'UNKNOWN', reasoning: [] };

    // Determine overall verdict
    const compliantScenarios = scenarios.filter(s => s.complianceStatus === 'COMPLIANT');
    const overallVerdict = compliantScenarios.length > 0 ? 'COMPLIANT' : 'NON_COMPLIANT';
    const verdictColors = getStatusColors(overallVerdict);

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            {/* Back Link */}
            <div className="mb-6">
                <Link href="/assessment/new" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Start New Assessment
                </Link>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                        Heat Reuse Decision & Compliance Record
                    </h1>
                    <p className="text-gray-500">
                        Project: {assessment.project_name} | Record ID: ENTROPY-REC-{assessment.id}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        This is not a pitch. This is the product.
                    </p>
                </div>

                <PDFDownloadLink
                    document={<DecisionRecordDocument data={assessment} />}
                    fileName={`entropy_decision_record_${assessment.id}.pdf`}
                >
                    {({ loading: pdfLoading }) => (
                        <Button disabled={pdfLoading} className="gap-2 bg-gray-900 hover:bg-gray-800">
                            <Download className="w-4 h-4" />
                            {pdfLoading ? 'Preparing...' : 'Download Official Record'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Overall Verdict Card */}
            <div className={`rounded-xl border-2 p-6 mb-8 ${verdictColors.bg} ${verdictColors.border}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${verdictColors.badge}`}>
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className={`text-2xl font-bold mb-2 ${verdictColors.text}`}>
                            VERDICT: {overallVerdict}
                        </h2>
                        <p className={`text-sm ${verdictColors.text}`}>
                            {compliantScenarios.length > 0
                                ? `Compliance achievable via: ${compliantScenarios.map(s => getScenarioLabel(s.reuseScenario)).join(', ')}`
                                : 'No viable path to compliance under current assumptions.'}
                        </p>
                        {assessment.confidence_level && (
                            <p className="text-xs text-gray-500 mt-2">
                                Confidence Level: {assessment.confidence_level}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Regulatory Context */}
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Regulatory Framework
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Applicable Law:</span>
                        <span className="ml-2 font-medium">{compliance.applicableLaw || assessment.applicable_regulation}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Jurisdiction:</span>
                        <span className="ml-2 font-medium">{assessment.jurisdiction}</span>
                    </div>
                </div>
                {compliance.reasoning && compliance.reasoning.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Regulatory Context:</p>
                        {compliance.reasoning.map((r: string, i: number) => (
                            <p key={i} className="text-sm text-gray-700 mb-1">• {r}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Scenarios */}
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Scenarios Evaluated
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {scenarios.map((scenario, i) => {
                    const colors = getStatusColors(scenario.complianceStatus);
                    const ScenarioIcon = getScenarioIcon(scenario.reuseScenario);
                    const isNoReuse = scenario.reuseScenario === 'NO_REUSE';

                    return (
                        <div
                            key={i}
                            className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-5 transition-all hover:shadow-md`}
                        >
                            {/* Scenario Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ScenarioIcon className={`w-5 h-5 ${colors.text}`} />
                                    <h4 className={`font-semibold ${colors.text}`}>
                                        {getScenarioLabel(scenario.reuseScenario).split(': ')[0]}
                                    </h4>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${colors.badge} text-white`}>
                                    {scenario.complianceStatus}
                                </span>
                            </div>

                            <p className="text-sm font-medium text-gray-900 mb-2">
                                {getScenarioLabel(scenario.reuseScenario).split(': ')[1]}
                            </p>

                            <p className="text-xs text-gray-600 mb-4">
                                {scenario.complianceReason}
                            </p>

                            {scenario.failureMode && (
                                <p className="text-xs text-red-600 mb-4 flex items-start gap-1">
                                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {scenario.failureMode}
                                </p>
                            )}

                            {!isNoReuse && (
                                <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">CAPEX</span>
                                        <span className="font-medium">
                                            €{(scenario.capexMinEur / 1000).toFixed(0)}k - €{(scenario.capexMaxEur / 1000).toFixed(0)}k
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payback</span>
                                        <span className="font-medium">
                                            {scenario.paybackMinYears.toFixed(1)} - {scenario.paybackMaxYears.toFixed(1)} yrs
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">IRR</span>
                                        <span className="font-medium">
                                            {scenario.irrMinPercent.toFixed(1)}% - {scenario.irrMaxPercent.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">CO₂ Avoided</span>
                                        <span className="font-medium">
                                            {(scenario.co2AvoidedMinKgYear / 1000).toFixed(0)} t/yr
                                        </span>
                                    </div>
                                </div>
                            )}

                            {isNoReuse && scenario.regulatoryExposure && (
                                <div className="border-t pt-4 mt-4">
                                    <p className="text-xs text-red-600">
                                        {scenario.regulatoryExposure}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Accountability Footer */}
            <div className="bg-gray-900 text-white rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-2">Entropy Accountability Statement</h4>
                        <p className="text-sm text-gray-300">
                            Entropy determines what is defensible, not what must be built. We don't just model scenarios —
                            we stand behind one. This record represents our assessment of compliance pathways and we take
                            responsibility for the decision layer between policy intent and infrastructure execution.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t">
                Generated by Entropy Decision Engine • Record ID: ENTROPY-REC-{assessment.id}
            </div>
        </div>
    );
}
