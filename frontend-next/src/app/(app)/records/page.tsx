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
    Zap,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DecisionRecord {
    id: string;
    recordNumber: string;
    projectName: string;
    status: string;
    complianceVerdict: string;
    jurisdiction: string;
    createdAt: string;
    finalizedAt?: string;
    version: string;
    thermalLoadRange: string;
    investmentRange: string;
    primaryRiskBearer?: string;
}

export default function RecordsListPage() {
    const [records, setRecords] = useState<DecisionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/records');
                if (!response.ok) {
                    throw new Error(`Failed to fetch records: ${response.status}`);
                }
                const data = await response.json();
                setRecords(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch records:', err);
                setError(err instanceof Error ? err.message : 'Failed to load records');
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    // Filter records based on search term
    const filteredRecords = records.filter(record =>
        record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 pb-20">
                <div className="flex items-center justify-center h-64">
                    <div className="inline-flex items-center space-x-2 text-zinc-400">
                        <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                        <span className="font-mono text-sm">Loading decision records...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header with Legal/Professional Styling */}
            <div className="border-b border-zinc-800 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <div className="border-l border-zinc-700 pl-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <Scale className="w-8 h-8 text-amber-500" />
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight">Decision Records Registry</h1>
                                    <p className="text-sm text-zinc-400 font-mono">
                                        Enterprise Decision Authority • {records.length} Official Records
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href="/assessment/new">
                            <Button variant="outline" size="sm" className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/20">
                                <FileText className="w-4 h-4 mr-2" />
                                New Assessment
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Search records by project, jurisdiction, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Registry Statistics */}
            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Calculator className="w-5 h-5 text-amber-500 mr-2" />
                    Registry Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(() => {
                        const compliantCount = records.filter(r => r.complianceVerdict === "COMPLIANT").length;
                        const conditionalCount = records.filter(r => r.complianceVerdict === "CONDITIONAL").length;
                        const nonCompliantCount = records.filter(r => r.complianceVerdict === "NON_COMPLIANT").length;
                        const finalizedCount = records.filter(r => r.status === "FINALIZED").length;

                        return [
                            { label: "Total Registered", value: records.length.toString(), color: "text-white", icon: FileText },
                            { label: "Compliant Decisions", value: compliantCount.toString(), color: "text-emerald-400", icon: CheckCircle },
                            { label: "Conditional Reviews", value: conditionalCount.toString(), color: "text-amber-400", icon: AlertTriangle },
                            { label: "Finalized Records", value: finalizedCount.toString(), color: "text-blue-400", icon: Shield }
                        ];
                    })().map((stat) => (
                        <div key={stat.label} className="text-center border-r border-zinc-700 last:border-r-0 pr-6 last:pr-0">
                            <div className="flex justify-center mb-2">
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className={cn("text-3xl font-bold font-mono", stat.color)}>{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Records List */}
            {error ? (
                <Card className="bg-zinc-950/50 border-red-800/50">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="text-red-400 text-lg font-mono mb-2">Failed to Load Records</div>
                            <div className="text-zinc-500 text-sm font-mono mb-4">{error}</div>
                            <Button
                                variant="outline"
                                className="border-zinc-700 text-zinc-300"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredRecords.length === 0 ? (
                <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardContent className="p-12">
                        <div className="text-center">
                            <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No Records Found</h3>
                            <p className="text-zinc-400 mb-4">
                                {searchTerm ?
                                    `No records match "${searchTerm}". Try adjusting your search.` :
                                    "No decision records have been created yet."
                                }
                            </p>
                            {!searchTerm && (
                                <Link href="/assessment/new">
                                    <Button className="bg-white text-black hover:bg-zinc-200">
                                        Create First Assessment
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredRecords.map((record) => (
                        <Link key={record.id} href={`/records/${record.id}`}>
                            <div className="bg-zinc-950/70 border-l-4 border-l-amber-600 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer group hover:bg-zinc-900/70">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-800 rounded-lg flex items-center justify-center">
                                                        <Scale className="w-6 h-6 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-mono">
                                                            {record.recordNumber}
                                                        </h3>
                                                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Official Decision Record</p>
                                                    </div>
                                                    <Badge className={cn(
                                                        "font-mono text-xs ml-4",
                                                        record.status === "FINALIZED"
                                                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                                            : record.status === "COMPLETED"
                                                            ? "bg-blue-950 text-blue-400 border-blue-800"
                                                            : "bg-amber-950 text-amber-400 border-amber-800"
                                                    )}>
                                                        {record.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-medium text-white mb-4 group-hover:text-amber-300 transition-colors">
                                                {record.projectName}
                                            </h4>

                                            <div className="bg-zinc-900/30 border border-zinc-800 rounded p-4 mb-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Jurisdiction</p>
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="w-3 h-3 text-amber-500" />
                                                            <span className="text-white font-mono">{record.jurisdiction}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Thermal Load</p>
                                                        <div className="flex items-center space-x-1">
                                                            <Thermometer className="w-3 h-3 text-amber-500" />
                                                            <span className="text-white font-mono">{record.thermalLoadRange}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Investment</p>
                                                        <div className="flex items-center space-x-1">
                                                            <Euro className="w-3 h-3 text-amber-500" />
                                                            <span className="text-white font-mono">{record.investmentRange}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Registered</p>
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="w-3 h-3 text-amber-500" />
                                                            <span className="text-white font-mono">{new Date(record.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end space-y-3 ml-6">
                                            <div className="flex items-center space-x-2">
                                                {record.complianceVerdict === "COMPLIANT" ? (
                                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                                ) : record.complianceVerdict === "CONDITIONAL" ? (
                                                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                                                ) : (
                                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                                )}
                                                <Badge className={cn(
                                                    "font-mono font-bold",
                                                    record.complianceVerdict === "COMPLIANT"
                                                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                                        : record.complianceVerdict === "CONDITIONAL"
                                                        ? "bg-amber-950 text-amber-400 border-amber-800"
                                                        : "bg-red-950 text-red-400 border-red-800"
                                                )}>
                                                    {record.complianceVerdict}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500 font-mono">View Details →</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Official Registry Footer */}
            <div className="border-t border-zinc-800 pt-6 mt-8">
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Scale className="w-4 h-4 text-amber-500" />
                                <span className="text-amber-400">Entropy Decision Engine</span>
                                <span className="text-zinc-600">•</span>
                                <span>Official Registry</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FileText className="w-3 h-3" />
                                <span>{filteredRecords.length} of {records.length} records displayed</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3" />
                                <span>Registry last synchronized: {new Date().toISOString().split('T')[0]}</span>
                            </div>
                            <Badge variant="outline" className="border-amber-700/50 text-amber-400 font-mono text-xs">
                                OFFICIAL
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}