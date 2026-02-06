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
}

// Mock data - replace with actual API call
const mockRecords: DecisionRecord[] = [
    {
        id: "dr-001",
        recordNumber: "DR-2026-001",
        projectName: "Amsterdam Hyperscale DC → Residential District 4",
        status: "FINALIZED",
        complianceVerdict: "COMPLIANT",
        jurisdiction: "NL",
        primaryRiskBearer: "District Heating Authority",
        createdAt: "2026-02-01",
        finalizedAt: "2026-02-04",
        investmentRange: "€2.1M - €3.4M",
        thermalLoad: "1.2-2.8 MW"
    },
    {
        id: "dr-002",
        recordNumber: "DR-2026-002",
        projectName: "Frankfurt Enterprise DC → Industrial Park West",
        status: "PENDING_REVIEW",
        complianceVerdict: "CONDITIONAL",
        jurisdiction: "DE",
        primaryRiskBearer: "Data Center Operator",
        createdAt: "2026-01-28",
        investmentRange: "€4.2M - €6.8M",
        thermalLoad: "3.1-5.7 MW"
    },
    {
        id: "dr-003",
        recordNumber: "DR-2026-003",
        projectName: "Brussels Colocation Hub → University Campus",
        status: "DRAFT",
        complianceVerdict: "PENDING",
        jurisdiction: "BE",
        primaryRiskBearer: "Third Party Operator",
        createdAt: "2026-02-05",
        investmentRange: "€1.8M - €2.9M",
        thermalLoad: "0.8-1.4 MW"
    }
];

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
    const [records] = useState<DecisionRecord[]>(mockRecords);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all");

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
                        Active Decision Records ({filteredRecords.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {filteredRecords.map((record, index) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors group cursor-pointer"
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
                </CardContent>
            </Card>

            {/* Empty state */}
            {filteredRecords.length === 0 && (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardContent className="p-12 text-center">
                        <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Records Found</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            No decision records match your current filters.
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