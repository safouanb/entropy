'use client';

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerdictBannerProps {
    verdict: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
    scenario?: string;
    confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
    className?: string;
}

const verdictConfig = {
    COMPLIANT: {
        bg: 'bg-emerald-600',
        text: 'text-white',
        icon: CheckCircle,
        label: 'COMPLIANT',
    },
    CONDITIONAL: {
        bg: 'bg-amber-500',
        text: 'text-black',
        icon: AlertTriangle,
        label: 'CONDITIONALLY COMPLIANT',
    },
    NON_COMPLIANT: {
        bg: 'bg-red-600',
        text: 'text-white',
        icon: XCircle,
        label: 'NON-COMPLIANT',
    },
};

export function VerdictBanner({ verdict, scenario, confidence, className }: VerdictBannerProps) {
    const config = verdictConfig[verdict];
    const Icon = config.icon;

    return (
        <div className={cn(
            'rounded-lg p-8',
            config.bg,
            config.text,
            className
        )}>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                    <Shield className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6" />
                        <h2 className="text-3xl font-bold tracking-tight">
                            VERDICT: {config.label}
                        </h2>
                    </div>
                    {scenario && (
                        <p className="text-lg opacity-90">
                            via {scenario}
                        </p>
                    )}
                    {confidence && (
                        <p className="mt-3 text-sm opacity-75 font-mono">
                            Confidence: {confidence}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
