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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Executive Overview</h1>
                <p className="text-muted-foreground mt-1">High-level operational intelligence.</p>
            </div>

            {/* Magic Bento Grid */}
            <div className="relative">
                <MagicBento
                    cards={dashboardCards}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={400}
                    particleCount={8}
                    glowColor="16, 185, 129"
                />
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
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-semibold text-white">
                        <ScrambleText
                            text="Quick Actions"
                            autoStart={false}
                            scrambleSpeed={50}
                            scrambledLetterCount={3}
                        />
                    </h3>
                    <SpotlightCard
                        spotlightColor="rgba(168, 85, 247, 0.15)"
                        className="p-4 bg-gradient-to-br from-zinc-900 to-black border-white/10 space-y-3"
                    >
                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Link href="/assessment/new">
                                <Button className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
                                    <motion.span
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Start New Assessment
                                    </motion.span>
                                    <BoltIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Link href="/records">
                                <Button variant="outline" className="w-full hover:bg-white/5 transition-all duration-300">
                                    <motion.span
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Browse Records
                                    </motion.span>
                                </Button>
                            </Link>
                        </motion.div>
                        <div className="pt-4 border-t border-white/5">
                            <div className="text-xs text-muted-foreground mb-2">
                                <ScrambleText
                                    text="System Status"
                                    autoStart={false}
                                    scrambleSpeed={30}
                                    scrambledLetterCount={2}
                                />
                            </div>
                            <motion.div
                                className="flex items-center justify-between text-sm"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-zinc-400">API Gateway</span>
                                <motion.span
                                    className="text-emerald-500 font-mono"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ONLINE
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="flex items-center justify-between text-sm mt-1"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-zinc-400">Database</span>
                                <motion.span
                                    className="text-emerald-500 font-mono"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                    CONNECTED
                                </motion.span>
                            </motion.div>
                        </div>
                    </SpotlightCard>
                </motion.div>
            </div>
        </div>
    );
}
