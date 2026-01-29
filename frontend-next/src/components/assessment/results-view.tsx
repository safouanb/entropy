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

export interface AssessmentResultsViewProps {
    id: string;
}

export interface ReuseScenario {
    reuseScenario: 'NO_REUSE' | 'DIRECT_REUSE' | 'REUSE_WITH_MITIGATION';
    ownershipModel: string;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'CONDITIONAL';
    complianceReason: string;
    failureMode: string;
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

export interface RiskAllocation {
    category: string;
    bearingParty: string;
    mitigationMechanism: string;
    notes: string;
}

const getScenarioLabel = (scenario: string): string => {
    switch (scenario) {
        case 'NO_REUSE': return 'No Heat Reuse';
        case 'DIRECT_REUSE': return 'Direct Reuse';
        case 'REUSE_WITH_MITIGATION': return 'Reuse + Mitigation';
        default: return scenario;
    }
};

export function AssessmentResultsView({ id }: AssessmentResultsViewProps) {
    const [record, setRecord] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAssessment(id);
                setRecord(data);
                if (data.scenarios && data.scenarios.length > 0) {
                    const compliant = data.scenarios.find((s: ReuseScenario) => s.complianceStatus === 'COMPLIANT');
                    setSelectedScenario(compliant ? compliant.reuseScenario : data.scenarios[0].reuseScenario);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!record) {
        return (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                <h3 className="text-muted-foreground">Record not found.</h3>
                <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">Back to Dashboard &rarr;</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex gap-3">
                    <PDFDownloadLink
                        document={<DecisionRecordDocument data={record} />}
                        fileName={`decision-record-${id}.pdf`}
                    >
                        {({ loading: pdfLoading }) => (
                            <Button disabled={pdfLoading} variant="outline" className="border-white/10 hover:bg-white/5">
                                <Download className="w-4 h-4 mr-2" />
                                {pdfLoading ? 'Preparing PDF...' : 'Download PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                    <Button disabled className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-not-allowed">
                        <Lock className="w-3 h-3 mr-2" /> Blockchain Commit (Coming Soon)
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <RecordHeader
                    recordId={record.id}
                    projectName={record.projectName}
                    jurisdiction={record.jurisdiction}
                    version={1}
                    date={record.generatedAt}
                />
            </div>

            <VerdictBanner
                verdict={record.finalVerdict}
                confidence={record.confidenceLevel}
                scenario={getScenarioLabel(selectedScenario || '')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(record.scenarios || []).map((scenario: ReuseScenario) => (
                    <ScenarioCard
                        key={scenario.reuseScenario}
                        scenario={scenario.reuseScenario as any}
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
                        isSelected={selectedScenario === scenario.reuseScenario}
                        onClick={() => setSelectedScenario(scenario.reuseScenario)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RiskTable allocations={record.riskAllocations} />
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">Audit Trail & Compliance</h3>
                    <AuditTrail steps={record.auditTrail} />
                </div>
            </div>

            <AccountabilityFooter
                officerName={record.accountability?.officerName || 'Unknown'}
                timestamp={record.accountability?.timestamp || record.generatedAt}
                signatureHash={record.accountability?.signatureHash || 'pending_generation'}
            />
        </div>
    );
}

const fetchAssessment = async (id: string) => {
    const res = await fetch(`/api/assessments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};
