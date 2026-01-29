"use client";

import React, { useState, useEffect } from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";

// Mock Data
// Types
interface RecordType {
    id: string;
    name: string;
    status: string;
    wasteHeat: string;
    date: string;
    region: string;
}

export default function RecordsPage() {
    const [search, setSearch] = useState("");
    const [records, setRecords] = useState<RecordType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/records")
            .then(res => res.json())
            .then(data => {
                setRecords(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch records:", err);
                setLoading(false);
            })
    }, []);

    const filtered = records.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.region.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Records Registry</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Centralized storage for all thermal waste assessments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black">
                        <DocumentTextIcon className="w-4 h-4" />
                        New Record
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        placeholder="Search by ID, Name or Region..."
                        className="pl-10 h-10 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-6 w-px bg-white/10" />
                <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
                    <FunnelIcon className="w-4 h-4" />
                    Filters
                </Button>
            </div>

            {/* Records Grid */}
            <div className="grid gap-3">
                {loading ? (
                    // Skeleton Loading
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="py-12">
                        <EmptyState
                            title="No records found"
                            description={search ? `No records match "${search}"` : "Get started by creating your first thermal record."}
                            actionLabel="Create Record"
                            onAction={() => console.log("Create action")}
                        />
                    </div>
                ) : (
                    filtered.map((record) => (
                        <SpotlightCard key={record.id} className="p-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-white/30 font-mono text-xs shadow-inner">
                                    {(record.region || "Unknown").substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                        {record.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                        <span className="font-mono text-white/30">{record.id}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="w-3 h-3" /> {record.region}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 md:gap-12">
                                <div className="hidden md:block text-right">
                                    <span className="block text-[10px] uppercase tracking-wider text-white/30">Waste Heat</span>
                                    <span className="font-mono text-emerald-400 font-medium">{record.wasteHeat}</span>
                                </div>

                                <div className="hidden md:block text-right">
                                    <span className="block text-[10px] uppercase tracking-wider text-white/30">Date</span>
                                    <span className="flex items-center gap-1 text-white/60">
                                        <ClockIcon className="w-3 h-3" /> {record.date}
                                    </span>
                                </div>

                                <div className="w-24 flex justify-end">
                                    <RecordStatus status={record.status} />
                                </div>
                            </div>
                        </SpotlightCard>
                    ))
                )}
            </div>
        </div>
    );
}

function RecordStatus({ status }: { status: string }) {
    if (status === "Compliant") {
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">Compliant</Badge>;
    }
    if (status === "Non-Compliant") {
        return <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">Non-Compliant</Badge>;
    }
    return <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20">{status}</Badge>;
}
