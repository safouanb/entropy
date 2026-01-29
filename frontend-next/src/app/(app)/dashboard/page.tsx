"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    GlobeEuropeAfricaIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    BoltIcon
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getIconForType(type: string) {
    switch (type) {
        case "crawling": return <GlobeEuropeAfricaIcon className="w-5 h-5 text-blue-400" />;
        case "approval": return <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />;
        case "market": return <ArrowTrendingUpIcon className="w-5 h-5 text-amber-400" />;
        default: return <ClockIcon className="w-5 h-5 text-zinc-400" />;
    }
}

export default function ExecutiveDashboard() {
    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Executive Overview</h1>
                <p className="text-muted-foreground mt-1">High-level operational intelligence.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Global Status */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <GlobeEuropeAfricaIcon className="w-24 h-24 text-blue-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Global View</Badge>
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tight">3 Regions</div>
                        <div className="text-sm text-muted-foreground mt-1">Active Operations</div>

                        <div className="mt-8">
                            <Link href="/map">
                                <Button variant="outline" className="w-full justify-between group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                                    View Infrastructure Map
                                    <GlobeEuropeAfricaIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Compliance Health */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheckIcon className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Compliance Health</Badge>
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tight">94%</div>
                        <div className="text-sm text-muted-foreground mt-1">Regulatory Adherence</div>

                        <div className="mt-8">
                            <Link href="/compliance">
                                <Button variant="outline" className="w-full justify-between group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                                    Compliance Dashboard
                                    <ShieldCheckIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Economic Impact */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowTrendingUpIcon className="w-24 h-24 text-amber-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">Financial Impact</Badge>
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tight">€2.4M</div>
                        <div className="text-sm text-muted-foreground mt-1">Projected Annual Savings</div>

                        <div className="mt-8">
                            <Link href="/analytics">
                                <Button variant="outline" className="w-full justify-between group-hover:bg-amber-500/10 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all">
                                    Financial Analytics
                                    <ArrowTrendingUpIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed (Mock) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Live Activity Stream</h3>
                        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">View Full Log</Button>
                    </div>

                    <div className="space-y-2">
                        {[
                            { time: "10 min ago", user: "System", action: "Automatic crawl of Frankfurt_DC_04 regulations updated.", icon: GlobeEuropeAfricaIcon },
                            { time: "2 hours ago", user: "Admin", action: "Approved new conceptual design for Munich Alpha.", icon: ShieldCheckIcon },
                            { time: "5 hours ago", user: "System", action: "Energy price forecast updated from ENTSO-E.", icon: ArrowTrendingUpIcon },
                            { time: "Yesterday", user: "User_Demo", action: "Created new assessment: Berlin Edge Node.", icon: ClockIcon },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <item.icon className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-zinc-300">{item.action}</div>
                                    <div className="text-xs text-zinc-500 mt-1">{item.user} • {item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 space-y-3">
                        <Link href="/assessment/new">
                            <Button className="w-full bg-white text-black hover:bg-zinc-200">Start New Assessment</Button>
                        </Link>
                        <Link href="/records">
                            <Button variant="outline" className="w-full">Browse Records</Button>
                        </Link>
                        <div className="pt-4 border-t border-white/5">
                            <div className="text-xs text-muted-foreground mb-2">System Status</div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">API Gateway</span>
                                <span className="text-emerald-500 font-mono">ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-zinc-400">Database</span>
                                <span className="text-emerald-500 font-mono">CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
