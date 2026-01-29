"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    CalendarIcon,
    ArrowTopRightOnSquareIcon,
    BoltIcon
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Assessment {
    id: string;
    project_name: string;
    created_at: string;
    thermal_load_min_kw: number;
    thermal_load_max_kw: number;
    jurisdiction: string;
    dc_location_lat: number;
    dc_location_lng: number;
}

export default function DashboardPage() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Fetch assessments (mock or real)
        // For now using the real endpoint structure but handling empty state
        fetch("/api/assessments")
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data)) setAssessments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filtered = assessments.filter(a =>
        a.project_name.toLowerCase().includes(search.toLowerCase()) ||
        a.jurisdiction.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your waste heat compliance records.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-zinc-900/50 border-white/10 h-10 transition-all focus:bg-zinc-900 focus:border-white/20"
                        />
                    </div>
                    <Link href="/assessment/new">
                        <Button className="bg-white text-black hover:bg-zinc-200 font-medium h-10 px-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            New Assessment
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Capacity", value: "245 MW", change: "+12%", color: "text-white" },
                    { label: "Active Projects", value: assessments.length.toString(), change: "+2", color: "text-emerald-400" },
                    { label: "Compliance Rate", value: "94%", change: "+5%", color: "text-white" },
                ].map((metric) => (
                    <Card key={metric.label} className="bg-sidebar border-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                    <h3 className={cn("text-3xl font-bold mt-2 tracking-tight", metric.color)}>{metric.value}</h3>
                                </div>
                                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
                                    {metric.change}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Records</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-8 text-xs">View All</Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-white/5 rounded-xl border border-white/5" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                        <h3 className="text-muted-foreground">No assessments found.</h3>
                        <Link href="/assessment/new" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">Create your first record &rarr;</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filtered.map((item) => (
                            <Link key={item.id} href={`/assessment/${item.id}`}>
                                <div className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-sidebar hover:bg-white/5 transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:from-emerald-950/30 transition-all">
                                            <BoltIcon className="w-5 h-5 text-white/50 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                                {item.project_name}
                                                <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover:opacity-50 -translate-y-0.5 translate-x-0.5 transition-all" />
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {item.jurisdiction} ({item.dc_location_lat.toFixed(2)}, {item.dc_location_lng.toFixed(2)})
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:block text-right">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Capacity</div>
                                            <div className="font-mono text-white/90">{(item.thermal_load_min_kw / 1000).toFixed(1)} - {(item.thermal_load_max_kw / 1000).toFixed(1)} MW</div>
                                        </div>

                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                            COMPLIANT
                                        </Badge>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
