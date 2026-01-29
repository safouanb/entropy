"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

// --- Types ---

type ComplianceStatus = "COMPLIANT" | "WARNING" | "NON_COMPLIANT" | "PENDING";

interface RegulationItem {
    id: string;
    regulation: string;
    description: string;
    status: ComplianceStatus;
    lastChecked: string;
    metric: string;
    nextAction: string;
}

interface AuditLogItem {
    id: string;
    timestamp: string; // ISO string
    event: string;
    user: string;
    status: "SUCCESS" | "FAILURE" | "INFO";
    detail: string;
}

// --- Mock Data ---

const regulations: RegulationItem[] = [
    {
        id: "EED-14",
        regulation: "EED Art. 14 Assessment",
        description: "Cost-Benefit Analysis for waste heat recovery",
        status: "COMPLIANT",
        lastChecked: "2024-03-15T10:00:00Z",
        metric: "15.2 MW (Threshold: >2.5MW)",
        nextAction: "Annual Review in Q1 2025"
    },
    {
        id: "WPG-ZONE",
        regulation: "Heating Planning Act (WPG)",
        description: "District heating connection priority zone check",
        status: "WARNING",
        lastChecked: "2024-03-14T15:30:00Z",
        metric: "Zone 4-A (Priority)",
        nextAction: "Submit Connection Plan by Q3"
    },
    {
        id: "GEG-71",
        regulation: "GEG § 71",
        description: "Renewable energy share requirements for new systems",
        status: "NON_COMPLIANT",
        lastChecked: "2024-03-16T09:15:00Z",
        metric: "45% RE (Target: 65%)",
        nextAction: "Retrofit Plan Required Immediate"
    },
    {
        id: "EU-TAX",
        regulation: "EU Taxonomy Reg. 2020/852",
        description: "Substantial Contribution & DNSH Criteria",
        status: "COMPLIANT",
        lastChecked: "2024-03-16T11:00:00Z",
        metric: "Aligned",
        nextAction: "Sustainability Report Integration"
    },
    {
        id: "CSRD-E1",
        regulation: "CSRD / ESRS E1",
        description: "Climate change mitigation reporting",
        status: "PENDING",
        lastChecked: "2024-03-01T08:00:00Z",
        metric: "-570 tCO2e (Est.)",
        nextAction: "Data Verification"
    },
    {
        id: "BIMSCHG",
        regulation: "BImSchG Permit",
        description: "Federal Immission Control Act compliance",
        status: "WARNING",
        lastChecked: "2024-02-28T14:20:00Z",
        metric: "Noise Level Variance",
        nextAction: "Acoustic Survey Required"
    }
];

const auditLogs: AuditLogItem[] = [
    { id: "log-1", timestamp: "2024-03-16T11:00:00Z", event: "Taxonomy Check", user: "system", status: "SUCCESS", detail: "Validated DNSH criteria for Water Protection." },
    { id: "log-2", timestamp: "2024-03-16T09:15:00Z", event: "GEG Threshold Alert", user: "system", status: "FAILURE", detail: "Renewable share calculated at 45%, below 65% mandatory target." },
    { id: "log-3", timestamp: "2024-03-15T10:00:00Z", event: "CBA Simulation", user: "admin", status: "SUCCESS", detail: "EED Art. 14 assessment completed. NPV positive." },
    { id: "log-4", timestamp: "2024-03-14T15:30:00Z", event: "Zone Lookup", user: "system", status: "INFO", detail: "Property identified in Fernwärme Vorranggebiet Zone 4-A." },
    { id: "log-5", timestamp: "2024-03-10T08:45:00Z", event: "Data Ingestion", user: "field_agent_1", status: "SUCCESS", detail: "Uploaded Q1 consumption data for Plant B." },
];

// --- Components ---

const StatusBadge = ({ status }: { status: ComplianceStatus }) => {
    switch (status) {
        case "COMPLIANT":
            return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"><CheckCircleIcon className="w-3 h-3 mr-1" /> Compliant</Badge>;
        case "WARNING":
            return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"><ExclamationTriangleIcon className="w-3 h-3 mr-1" /> Warning</Badge>;
        case "NON_COMPLIANT":
            return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"><ExclamationTriangleIcon className="w-3 h-3 mr-1" /> Non-Compliant</Badge>;
        case "PENDING":
            return <Badge variant="outline" className="text-muted-foreground"><ClockIcon className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
};

const LogStatusBadge = ({ status }: { status: AuditLogItem['status'] }) => {
    switch (status) {
        case "SUCCESS": return <span className="text-emerald-500 text-xs font-mono">SUCCESS</span>;
        case "FAILURE": return <span className="text-rose-500 text-xs font-mono">FAILURE</span>;
        case "INFO": return <span className="text-blue-400 text-xs font-mono">INFO</span>;
    }
};

export default function CompliancePage() {
    const [activeTab, setActiveTab] = useState<"regulations" | "audit">("regulations");

    // Stats
    const totalCheck = regulations.length;
    const compliantCount = regulations.filter(r => r.status === "COMPLIANT").length;
    const warningCount = regulations.filter(r => r.status === "WARNING").length;
    const failedCount = regulations.filter(r => r.status === "NON_COMPLIANT").length;

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Compliance Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Regulatory monitoring and audit trail.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-zinc-900/50 text-zinc-400 font-mono py-1.5">
                        <ShieldCheckIcon className="w-3.5 h-3.5 mr-2" />
                        System Status: ACTIVE
                    </Badge>
                    <button className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <div className="text-sm text-zinc-500 font-medium">Total Regulations</div>
                    <div className="text-2xl font-bold text-white mt-1">{totalCheck}</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <div className="text-sm text-emerald-500/70 font-medium">Compliant</div>
                    <div className="text-2xl font-bold text-emerald-500 mt-1">{compliantCount}</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <div className="text-sm text-amber-500/70 font-medium">Warnings</div>
                    <div className="text-2xl font-bold text-amber-500 mt-1">{warningCount}</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <div className="text-sm text-rose-500/70 font-medium">Non-Compliant</div>
                    <div className="text-2xl font-bold text-rose-500 mt-1">{failedCount}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("regulations")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors border-b-2",
                            activeTab === "regulations"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-muted-foreground hover:text-white"
                        )}
                    >
                        Active Regulations
                    </button>
                    <button
                        onClick={() => setActiveTab("audit")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors border-b-2",
                            activeTab === "audit"
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-muted-foreground hover:text-white"
                        )}
                    >
                        Audit Log
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === "regulations" && (
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/30">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="w-[300px] text-zinc-400">Regulation</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-zinc-400">Key Metric</TableHead>
                                    <TableHead className="text-zinc-400">Last Verified</TableHead>
                                    <TableHead className="text-right text-zinc-400">Action Required</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {regulations.map((item) => (
                                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                        <TableCell>
                                            <div className="font-medium text-white">{item.regulation}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-zinc-300">
                                            {item.metric}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(item.lastChecked).toLocaleDateString()}
                                            <span className="text-xs text-zinc-600 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {new Date(item.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-white/80">
                                            {item.nextAction}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/30">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="w-[180px] text-zinc-400">Timestamp</TableHead>
                                    <TableHead className="w-[150px] text-zinc-400">Event Type</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-zinc-400">Detail</TableHead>
                                    <TableHead className="text-right text-zinc-400">User/System</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {new Date(log.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-zinc-300">
                                            {log.event}
                                        </TableCell>
                                        <TableCell>
                                            <LogStatusBadge status={log.status} />
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-400">
                                            {log.detail}
                                        </TableCell>
                                        <TableCell className="text-right text-xs font-mono text-zinc-500">
                                            {log.user}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
