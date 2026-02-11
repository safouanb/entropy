"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FileText,
    Search,
    Filter,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Clock,
    Shield,
    Scale,
    Building2,
    Plus,
    ExternalLink,
    Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SqlNullString {
    String: string;
    Valid: boolean;
}

// Real assessment data from backend
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
    verdict: string;
    overall_status: string;
    regulatory_context: string;
    failure_modes?: string[];
}

interface DecisionRecord {
    id: string;
    recordNumber: string;
    projectName: string;
    status: "DRAFT" | "PENDING_REVIEW" | "FINALIZED" | "ARCHIVED";
    complianceVerdict: "COMPLIANT" | "CONDITIONAL" | "NON_COMPLIANT" | "PENDING";
    jurisdiction: string;
    primaryRiskBearer: string;
    createdAt: string;
    finalizedAt?: string;
    investmentRange: string;
    thermalLoad: string;
    originalAssessment: Assessment;
    parsedCompliance?: ComplianceResult;
    parsedScenarios?: any[];
}

function transformAssessmentToRecord(assessment: Assessment): DecisionRecord {
    // Parse JSON results from SqlNullString structure
    let parsedCompliance: ComplianceResult | undefined;
    let parsedScenarios: any[] | undefined;

    try {
        if (assessment.compliance_result?.Valid && assessment.compliance_result.String) {
            parsedCompliance = JSON.parse(assessment.compliance_result.String);
        }
        if (assessment.scenario_results?.Valid && assessment.scenario_results.String) {
            parsedScenarios = JSON.parse(assessment.scenario_results.String);
        }
    } catch (e) {
        console.warn('Failed to parse assessment JSON:', e);
    }

    // Determine compliance verdict from parsed result
    let complianceVerdict: DecisionRecord['complianceVerdict'] = "PENDING";
    if (parsedCompliance) {
        switch (parsedCompliance.overall_status?.toUpperCase()) {
            case "COMPLIANT":
                complianceVerdict = "COMPLIANT";
                break;
            case "CONDITIONAL":
                complianceVerdict = "CONDITIONAL";
                break;
            case "NON_COMPLIANT":
                complianceVerdict = "NON_COMPLIANT";
                break;
        }
    }

    // Map status
    let status: DecisionRecord['status'] = "DRAFT";
    switch (assessment.status?.toLowerCase()) {
        case "completed":
        case "finalized":
            status = "FINALIZED";
            break;
        case "calculating":
        case "pending":
            status = "PENDING_REVIEW";
            break;
        case "draft":
            status = "DRAFT";
            break;
        case "archived":
            status = "ARCHIVED";
            break;
    }

    // Calculate investment range from scenarios
    let investmentRange = "Calculating...";
    if (parsedScenarios && parsedScenarios.length > 0) {
        const investments = parsedScenarios
            .filter(s => s.InvestmentRequiredMinEur && s.InvestmentRequiredMaxEur)
            .map(s => ({ min: s.InvestmentRequiredMinEur, max: s.InvestmentRequiredMaxEur }));

        if (investments.length > 0) {
            const minInvestment = Math.min(...investments.map(i => i.min));
            const maxInvestment = Math.max(...investments.map(i => i.max));
            investmentRange = `€${(minInvestment / 1000000).toFixed(1)}M - €${(maxInvestment / 1000000).toFixed(1)}M`;
        }
    }

    return {
        id: assessment.id.toString(),
        recordNumber: `DR-${new Date(assessment.created_at).getFullYear()}-${assessment.id.toString().padStart(3, '0')}`,
        projectName: assessment.project_name,
        status,
        complianceVerdict,
        jurisdiction: assessment.jurisdiction,
        primaryRiskBearer: "Analysis Required", // TODO: Extract from parsed scenarios
        createdAt: new Date(assessment.created_at).toISOString().split('T')[0],
        finalizedAt: assessment.completed_at?.Valid && assessment.completed_at.String ? new Date(assessment.completed_at.String).toISOString().split('T')[0] : undefined,
        investmentRange,
        thermalLoad: `${(assessment.thermal_load_min_kw / 1000).toFixed(1)}-${(assessment.thermal_load_max_kw / 1000).toFixed(1)} MW`,
        originalAssessment: assessment,
        parsedCompliance,
        parsedScenarios
    };
}

const getStatusIcon = (status: DecisionRecord['status']) => {
    switch (status) {
        case "FINALIZED": return <CheckCircle className="w-4 h-4" />;
        case "PENDING_REVIEW": return <Clock className="w-4 h-4" />;
        case "DRAFT": return <FileText className="w-4 h-4" />;
        case "ARCHIVED": return <Archive className="w-4 h-4" />;
    }
};

const getComplianceIcon = (verdict: DecisionRecord['complianceVerdict']) => {
    switch (verdict) {
        case "COMPLIANT": return <Shield className="w-4 h-4 text-emerald-500" />;
        case "CONDITIONAL": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case "NON_COMPLIANT": return <XCircle className="w-4 h-4 text-red-500" />;
        case "PENDING": return <Clock className="w-4 h-4 text-zinc-500" />;
    }
};

const getStatusColor = (status: DecisionRecord['status']) => {
    switch (status) {
        case "FINALIZED": return "text-emerald-400 bg-emerald-950 border-emerald-800";
        case "PENDING_REVIEW": return "text-amber-400 bg-amber-950 border-amber-800";
        case "DRAFT": return "text-zinc-400 bg-zinc-900 border-zinc-700";
        case "ARCHIVED": return "text-zinc-500 bg-zinc-950 border-zinc-800";
    }
};

export default function DecisionRecordsPage() {
    const [records, setRecords] = useState<DecisionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all");

    // Fetch real assessments from backend
    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/assessments?limit=50&offset=0');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();

                // Transform backend assessments to decision records
                const transformedRecords = (data.assessments || []).map(transformAssessmentToRecord);
                setRecords(transformedRecords);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch assessments:', err);
                setError(err instanceof Error ? err.message : 'Failed to load assessments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const filteredRecords = records.filter(record => {
        const matchesSearch = record.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             record.recordNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || record.status === statusFilter;
        const matchesJurisdiction = jurisdictionFilter === "all" || record.jurisdiction === jurisdictionFilter;

        return matchesSearch && matchesStatus && matchesJurisdiction;
    });

    const stats = {
        totalRecords: records.length,
        finalized: records.filter(r => r.status === "FINALIZED").length,
        pendingReview: records.filter(r => r.status === "PENDING_REVIEW").length,
        compliant: records.filter(r => r.complianceVerdict === "COMPLIANT").length
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                        Decision Records
                    </h1>
                    <p className="text-sm text-zinc-400 font-mono">
                        Legal authority for waste heat recovery compliance
                    </p>
                </div>

                <Link href="/assessment/new">
                    <Button className="bg-white text-black hover:bg-zinc-200 font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        New Assessment
                    </Button>
                </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Total Records</p>
                                <p className="text-2xl font-mono text-white font-semibold">{stats.totalRecords}</p>
                            </div>
                            <FileText className="w-5 h-5 text-zinc-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-950/20 border-emerald-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-400/70 font-mono uppercase tracking-wider">Finalized</p>
                                <p className="text-2xl font-mono text-emerald-400 font-semibold">{stats.finalized}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-950/20 border-amber-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-amber-400/70 font-mono uppercase tracking-wider">Under Review</p>
                                <p className="text-2xl font-mono text-amber-400 font-semibold">{stats.pendingReview}</p>
                            </div>
                            <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-400/70 font-mono uppercase tracking-wider">Compliant</p>
                                <p className="text-2xl font-mono text-blue-400 font-semibold">{stats.compliant}</p>
                            </div>
                            <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    placeholder="Search records, projects, or record numbers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-zinc-600 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48 bg-zinc-900/50 border-zinc-700 font-mono text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="FINALIZED">Finalized</SelectItem>
                                <SelectItem value="PENDING_REVIEW">Under Review</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                            <SelectTrigger className="w-48 bg-zinc-900/50 border-zinc-700 font-mono text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jurisdictions</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="NL">Netherlands</SelectItem>
                                <SelectItem value="BE">Belgium</SelectItem>
                                <SelectItem value="EU">European Union</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                        Active Decision Records ({loading ? '...' : filteredRecords.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center space-x-2 text-zinc-400">
                                <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                                <span className="font-mono text-sm">Loading assessments...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <div className="text-red-400 text-sm font-mono mb-2">Failed to load assessments</div>
                            <div className="text-zinc-500 text-xs font-mono">{error}</div>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {filteredRecords.map((record, index) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors group cursor-pointer"
                                onClick={() => window.open(`/records/${record.id}`, '_blank')}
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(record.status)}
                                        <Badge variant="secondary" className={cn("font-mono text-xs", getStatusColor(record.status))}>
                                            {record.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <p className="font-mono text-xs text-zinc-500 font-medium">
                                                {record.recordNumber}
                                            </p>
                                            <div className="h-1 w-1 bg-zinc-600 rounded-full" />
                                            <p className="font-mono text-xs text-blue-400 uppercase">
                                                {record.jurisdiction}
                                            </p>
                                        </div>
                                        <p className="text-sm text-white font-medium truncate mt-1">
                                            {record.projectName}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500 font-mono">
                                            <span>{record.thermalLoad} thermal</span>
                                            <span>•</span>
                                            <span>{record.investmentRange}</span>
                                            <span>•</span>
                                            <span>Risk: {record.primaryRiskBearer}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        {getComplianceIcon(record.complianceVerdict)}
                                        <span className="text-xs font-mono text-zinc-400">
                                            {record.complianceVerdict}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500 font-mono">
                                            {record.finalizedAt ? `Finalized ${record.finalizedAt}` : `Created ${record.createdAt}`}
                                        </p>
                                    </div>

                                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Empty state */}
            {!loading && !error && filteredRecords.length === 0 && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardContent className="p-12 text-center">
                        <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Records Found</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            {searchQuery || statusFilter !== "all" || jurisdictionFilter !== "all"
                                ? "No decision records match your current filters."
                                : "No decision records exist yet. Create your first assessment to get started."
                            }
                        </p>
                        <Link href="/assessment/new">
                            <Button className="bg-white text-black hover:bg-zinc-200">
                                Create First Record
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}