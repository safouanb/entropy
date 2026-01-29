'use client';

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";

interface VerdictBannerProps {
    verdict: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
    scenario?: string;
    confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
    className?: string;
}

const verdictConfig = {
    COMPLIANT: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        icon: CheckCircle,
        label: 'COMPLIANT',
        glow: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]',
    },
    CONDITIONAL: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        icon: AlertTriangle,
        label: 'CONDITIONALLY COMPLIANT',
        glow: 'shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]',
    },
    NON_COMPLIANT: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        icon: XCircle,
        label: 'NON-COMPLIANT',
        glow: 'shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]',
    },
};

export function VerdictBanner({ verdict, scenario, confidence, className }: VerdictBannerProps) {
    const config = verdictConfig[verdict];
    const Icon = config.icon;

    return (
        <Card className={cn(
            'p-6 border backdrop-blur-sm transition-all',
            config.bg,
            config.border,
            config.glow,
            className
        )}>
            <div className="flex items-start gap-5">
                <div className={cn("p-3 rounded-xl border bg-black/40", config.border, config.text)}>
                    <Shield className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className={cn("text-2xl font-bold tracking-tight flex items-center gap-3", config.text)}>
                                {config.label}
                                <Icon className="w-6 h-6" />
                            </h2>
                        </div>
                        {confidence && (
                            <div className="px-2 py-1 rounded text-xs font-mono border border-white/10 bg-white/5 text-muted-foreground uppercase tracking-wider">
                                Confidence: <span className="text-white">{confidence}</span>
                            </div>
                        )}
                    </div>

                    {scenario && (
                        <p className="text-muted-foreground text-sm font-medium">
                            Based on scenario: <span className="text-white font-mono ml-1">{scenario}</span>
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
