'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AssessmentReportDocument } from './report-pdf';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, FileCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface AssessmentResultsViewProps {
    id: string;
}

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
        return <div className="p-8 text-center">Loading assessment data...</div>;
    }

    if (!assessment) {
        return <div className="p-8 text-center text-red-500">Assessment not found.</div>;
    }

    const scenarios = assessment.scenario_results ? JSON.parse(assessment.scenario_results) : [];
    const compliance = assessment.compliance_result ? JSON.parse(assessment.compliance_result) : { status: 'UNKNOWN' };

    // Determine status color/icon
    let StatusIcon = AlertCircle;
    let statusColor = "text-gray-500";
    let bgStatus = "bg-gray-100";

    if (compliance.status === 'MANDATORY') {
        StatusIcon = AlertTriangle;
        statusColor = "text-amber-600";
        bgStatus = "bg-amber-50";
    } else if (compliance.status === 'EXEMPT') {
        StatusIcon = FileCheck;
        statusColor = "text-green-600";
        bgStatus = "bg-green-50";
    } else if (compliance.status === 'VOLUNTARY') {
        StatusIcon = FileCheck;
        statusColor = "text-blue-600";
        bgStatus = "bg-blue-50";
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <div className="mb-6">
                <Link href="/assessment/new" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Start New Assessment
                </Link>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Feasibility Assessment Result</h1>
                    <p className="text-gray-500">Project: {assessment.project_name} | ID: {assessment.id}</p>
                </div>

                <PDFDownloadLink
                    document={<AssessmentReportDocument data={assessment} />}
                    fileName={`entropy_compliance_record_${assessment.id}.pdf`}
                >
                    {({ blob, url, loading: pdfLoading, error }) => (
                        <Button disabled={pdfLoading} className="gap-2">
                            <Download className="w-4 h-4" />
                            {pdfLoading ? 'Preparing PDF...' : 'Download Official Record'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Compliance Status Card */}
            <div className={`rounded-xl border p-6 mb-8 ${bgStatus}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-white shadow-sm ${statusColor}`}>
                        <StatusIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold mb-2 ${statusColor}`}>
                            Determination: {compliance.status}
                        </h2>
                        <div className="prose prose-sm text-gray-700">
                            {compliance.reasoning && compliance.reasoning.map((r: string, i: number) => (
                                <p key={i} className="mb-1">• {r}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenario Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {scenarios.map((s: any, i: number) => (
                    <div key={i} className="rounded-lg border bg-white shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4 pb-2 border-b">
                            {s.ownershipModel.replace(/_/g, ' ')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">CAPEX</span>
                                <span className="font-medium">€{(s.capexMinEur / 1000).toFixed(0)}k - {(s.capexMaxEur / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payback</span>
                                <span className="font-medium">{s.paybackMinYears.toFixed(1)} - {s.paybackMaxYears.toFixed(1)} yrs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">IRR</span>
                                <span className="font-medium">{s.irrMinPercent.toFixed(1)}% - {s.irrMaxPercent.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">CO2 Avoided</span>
                                <span className="font-medium">{(s.co2AvoidedMinKgYear / 1000).toFixed(0)} t/yr</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-12 border-t pt-6">
                Generated by Entropy V1 Feasibility Engine
            </div>
        </div>
    );
}
