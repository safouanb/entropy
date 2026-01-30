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
import { EmptyState } from "@/components/ui/empty-state";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrambleText } from "@/components/ui/scramble-text";
import { motion } from "framer-motion";
import MagicBento from "@/components/ui/magic-bento";
import CountUp from "@/components/CountUp";
import MagnetLines from "@/components/MagnetLines";
import Galaxy from "@/components/Galaxy";

function getIconForType(type: string) {
    switch (type) {
        case "crawling": return <GlobeEuropeAfricaIcon className="w-5 h-5 text-blue-400" />;
        case "approval": return <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />;
        case "market": return <ArrowTrendingUpIcon className="w-5 h-5 text-amber-400" />;
        default: return <ClockIcon className="w-5 h-5 text-zinc-400" />;
    }
}

const dashboardCards = [
    {
        color: '#0a0a0a',
        title: 'Global Infrastructure',
        description: '3 active regions, 15 data centers operational',
        label: 'Operations',
        icon: GlobeEuropeAfricaIcon
    },
    {
        color: '#0a0a0a',
        title: 'Compliance Health',
        description: '94% regulatory adherence across all systems',
        label: 'Safety',
        icon: ShieldCheckIcon
    },
    {
        color: '#0a0a0a',
        title: 'Economic Impact',
        description: '€2.4M projected annual savings from optimization',
        label: 'Finance',
        icon: ArrowTrendingUpIcon
    },
    {
        color: '#0a0a0a',
        title: 'Heat Recovery',
        description: 'Advanced thermal management and reuse systems',
        label: 'Technology',
        icon: BoltIcon
    },
    {
        color: '#0a0a0a',
        title: 'Analytics Engine',
        description: 'Real-time performance monitoring and insights',
        label: 'Intelligence',
        icon: ClockIcon
    },
    {
        color: '#0a0a0a',
        title: 'Risk Assessment',
        description: 'Automated compliance and safety evaluation',
        label: 'Security',
        icon: ShieldCheckIcon
    }
];

export default function ExecutiveDashboard() {
    return (
        <div className="space-y-8 pb-20">
            {/* Clean header with key metrics */}
            <div className="flex items-start justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Executive Overview
                    </h1>
                    <p className="text-white/60">Operational intelligence and key metrics.</p>
                </div>

                {/* Key metrics - clean presentation */}
                <div className="flex gap-8 text-right">
                    <div>
                        <div className="text-2xl font-bold text-emerald-400 font-mono">
                            <CountUp to={94} duration={1500} />%
                        </div>
                        <div className="text-sm text-white/60">Compliance</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white font-mono">
                            €<CountUp to={2.4} duration={1500} />M
                        </div>
                        <div className="text-sm text-white/60">Annual Savings</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-400 font-mono">
                            <CountUp to={15} duration={1500} />
                        </div>
                        <div className="text-sm text-white/60">Active Sites</div>
                    </div>
                </div>
            </div>

            {/* Clean dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {dashboardCards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-colors duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                                <card.icon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-emerald-400/60 font-mono uppercase tracking-wider">
                                    {card.label}
                                </div>
                                <h3 className="text-lg font-satoshi font-medium text-white">
                                    {card.title}
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            {card.description}
                        </p>
                    </motion.div>
                ))}
            </div>


            {/* Recent Activity Feed (Mock) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Live Activity Stream</h3>
                        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">View Full Log</Button>
                    </div>

                    <div className="space-y-2">
                        {[116, 117, 118, 119].length === 0 ? ( // NOTE: Hardcoded mock array length check simulation for preview
                            <div className="py-8">
                                <EmptyState
                                    title="No recent activity"
                                    description="System events and user actions will appear here."
                                />
                            </div>
                        ) : (
                            [
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
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm space-y-3">
                        <Link href="/assessment/new">
                            <Button className="w-full bg-white text-black hover:bg-emerald-50 transition-colors duration-300">
                                Start New Assessment
                                <BoltIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/records">
                            <Button variant="outline" className="w-full border-white/20 hover:border-white/30 hover:bg-white/5 transition-colors duration-300">
                                Browse Records
                            </Button>
                        </Link>
                        <div className="pt-4 border-t border-white/10">
                            <div className="text-xs text-white/60 mb-3">System Status</div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">API Gateway</span>
                                <span className="text-emerald-400 font-mono">ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-white/70">Database</span>
                                <span className="text-emerald-400 font-mono">CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
