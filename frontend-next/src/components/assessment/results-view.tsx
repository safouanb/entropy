'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DecisionRecordDocument } from './report-pdf';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, Lock } from 'lucide-react';

import {
    VerdictBanner,
    ScenarioCard,
    RecordHeader,
    RiskTable,
    AuditTrail,
    AccountabilityFooter,
} from '@/components/entropy';

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
}

interface RiskAllocation {
    category: string;
    bearingParty: string;
    mitigationMechanism: string;
    notes: string;
}

const getScenarioLabel = (scenario: string): string => {
    switch (scenario) {
        case 'NO_REUSE': return 'Scenario A: No Heat Reuse';
        case 'DIRECT_REUSE': return 'Scenario B: Direct Reuse';
        case 'REUSE_WITH_MITIGATION': return 'Scenario C: Reuse + Mitigation';
        default: return scenario;
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading Decision Record...</p>
                </div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Record not found.</p>
                    <Link href="/assessment/new" className="text-sm text-gray-500 hover:text-black mt-4 block">
                        ← Create New Record
                    </Link>
                </div>
            </div>
        );
    }

    const scenarios: ReuseScenario[] = assessment.scenario_results
        ? JSON.parse(assessment.scenario_results)
        : [];

    const riskAllocations: RiskAllocation[] = assessment.risk_allocation_json
        ? JSON.parse(assessment.risk_allocation_json)
        : [];

    // Determine overall verdict
    const compliantScenarios = scenarios.filter(s => s.complianceStatus === 'COMPLIANT');
    const conditionalScenarios = scenarios.filter(s => s.complianceStatus === 'CONDITIONAL');

    let overallVerdict: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT' = 'NON_COMPLIANT';
    let verdictScenario = '';

    if (compliantScenarios.length > 0) {
        overallVerdict = 'COMPLIANT';
        verdictScenario = getScenarioLabel(compliantScenarios[0].reuseScenario);
    } else if (conditionalScenarios.length > 0) {
        overallVerdict = 'CONDITIONAL';
        verdictScenario = getScenarioLabel(conditionalScenarios[0].reuseScenario);
    }

    const isFinalized = assessment.status === 'finalized';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/assessment/new" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> New Record
                    </Link>

                    <div className="flex items-center gap-3">
                        {!isFinalized && (
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    if (confirm('Finalize this record? This will lock it permanently.')) {
                                        try {
                                            const res = await fetch(`/api/v1/assessments/${assessment.id}/finalize`, {
                                                method: 'POST'
                                            });
                                            if (res.ok) {
                                                window.location.reload();
                                            }
                                        } catch (e) {
                                            console.error('Failed to finalize', e);
                                        }
                                    }
                                }}
                                className="gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Finalize Record
                            </Button>
                        )}

                        <PDFDownloadLink
                            document={<DecisionRecordDocument data={assessment} />}
                            fileName={`ENTROPY-REC-${assessment.id}.pdf`}
                        >
                            {({ loading: pdfLoading }) => (
                                <Button
                                    disabled={pdfLoading}
                                    className="gap-2 bg-black hover:bg-gray-800"
                                >
                                    <Download className="w-4 h-4" />
                                    {pdfLoading ? 'Preparing...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

                    {/* Record Header */}
                    <RecordHeader
                        recordId={`ENTROPY-REC-${assessment.id}`}
                        projectName={assessment.project_name}
                        jurisdiction={assessment.jurisdiction}
                        version={assessment.version || 1}
                        date={new Date(assessment.created_at).toLocaleDateString()}
                        finalized={isFinalized}
                    />

                    {/* Verdict Banner */}
                    <VerdictBanner
                        verdict={overallVerdict}
                        scenario={verdictScenario}
                        confidence={assessment.confidence_level || 'MEDIUM'}
                        className="mb-8"
                    />

                    {/* Scenarios Section */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                            Scenarios Evaluated
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {scenarios.map((scenario, i) => (
                                <ScenarioCard
                                    key={i}
                                    scenario={scenario.reuseScenario}
                                    status={scenario.complianceStatus}
                                    reason={scenario.complianceReason}
                                    failureMode={scenario.failureMode}
                                    metrics={{
                                        capexMin: scenario.capexMinEur,
                                        capexMax: scenario.capexMaxEur,
                                        paybackMin: scenario.paybackMinYears,
                                        paybackMax: scenario.paybackMaxYears,
                                        irrMin: scenario.irrMinPercent,
                                        irrMax: scenario.irrMaxPercent,
                                        co2Min: scenario.co2AvoidedMinKgYear,
                                        co2Max: scenario.co2AvoidedMaxKgYear,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Risk Table */}
                    <div className="mb-8">
                        <RiskTable allocations={riskAllocations} />
                    </div>

                    {/* Audit Trail */}
                    <AuditTrail
                        entries={[
                            {
                                version: 1,
                                date: new Date(assessment.created_at).toLocaleDateString(),
                                changeSummary: 'Initial record',
                                author: 'Entropy'
                            }
                        ]}
                    />

                    {/* Accountability Footer */}
                    <AccountabilityFooter />
                </div>

                {/* Page Footer */}
                <div className="text-center text-xs text-gray-400 mt-8">
                    Generated by Entropy Decision Engine • Record ID: ENTROPY-REC-{assessment.id}
                </div>
            </div>
        </div>
    );
}
