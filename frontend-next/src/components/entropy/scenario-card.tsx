'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScenarioCardProps {
    scenario: 'NO_REUSE' | 'DIRECT_REUSE' | 'REUSE_WITH_MITIGATION';
    status: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
    reason: string;
    failureMode?: string;
    metrics?: {
        capexMin: number;
        capexMax: number;
        paybackMin: number;
        paybackMax: number;
        irrMin: number;
        irrMax: number;
        co2Min: number;
        co2Max: number;
    };
    className?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const scenarioLabels: Record<string, { short: string; full: string; color: string }> = {
    NO_REUSE: { short: 'A', full: 'No Heat Reuse', color: 'bg-zinc-800' },
    DIRECT_REUSE: { short: 'B', full: 'Direct Reuse', color: 'bg-indigo-500' },
    REUSE_WITH_MITIGATION: { short: 'C', full: 'Reuse + Mitigation', color: 'bg-purple-500' },
};

const statusConfig = {
    COMPLIANT: {
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: CheckCircle,
    },
    CONDITIONAL: {
        text: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: AlertTriangle,
    },
    NON_COMPLIANT: {
        text: 'text-red-400',
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: XCircle,
    },
};

const formatCurrency = (min: number, max: number): string => {
    if (min === 0 && max === 0) return '€0';
    return `€${(min / 1000).toFixed(0)}k – €${(max / 1000).toFixed(0)}k`;
};

const formatYears = (min: number, max: number): string => {
    if (min === 0 && max === 0) return 'N/A';
    return `${min.toFixed(1)} – ${max.toFixed(1)} yrs`;
};

export function ScenarioCard({
    scenario,
    status,
    reason,
    failureMode,
    metrics,
    className,
    isSelected,
    onClick
}: ScenarioCardProps) {
    const labels = scenarioLabels[scenario];
    const config = statusConfig[status];
    const isNoReuse = scenario === 'NO_REUSE';

    return (
        <Card
            className={cn(
                'group relative transition-all duration-300 cursor-pointer overflow-hidden',
                isSelected
                    ? 'ring-2 ring-blue-500 border-transparent bg-blue-950/10'
                    : 'hover:border-white/20 hover:bg-white/5',
                className
            )}
            onClick={onClick}
        >
            <CardContent className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-inner", labels.color)}>
                            {labels.short}
                        </div>
                        <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors">
                            {labels.full}
                        </h3>
                    </div>
                    <Badge variant="outline" className={cn("font-mono text-[10px] tracking-wider uppercase", config.badge)}>
                        {status.replace('_', '-')}
                    </Badge>
                </div>

                {/* Status Indicator Bar */}
                <div className={cn("h-0.5 w-full rounded-full opacity-20",
                    status === 'COMPLIANT' ? 'bg-emerald-500' :
                        status === 'CONDITIONAL' ? 'bg-amber-500' : 'bg-red-500'
                )} />

                {/* Reason */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason}
                </p>

                {/* Failure Mode */}
                {failureMode && (
                    <div className="flex items-start gap-2.5 p-3 rounded-md bg-red-500/5 border border-red-500/10">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300/90 font-medium">
                            {failureMode}
                        </p>
                    </div>
                )}

                {/* Metrics */}
                {!isNoReuse && metrics && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
                        <Metric label="CAPEX" value={formatCurrency(metrics.capexMin, metrics.capexMax)} />
                        <Metric label="Payback" value={formatYears(metrics.paybackMin, metrics.paybackMax)} />
                        <Metric label="IRR" value={`${metrics.irrMin.toFixed(1)}% – ${metrics.irrMax.toFixed(1)}%`} highlight />
                        <Metric label="CO₂ Saved" value={`${(metrics.co2Min / 1000).toFixed(0)} t/yr`} />
                    </div>
                )}
            </CardContent>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ArrowRight className="w-4 h-4 text-white/50" />
            </div>
        </Card>
    );
}

function Metric({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">{label}</span>
            <span className={cn("font-mono text-sm text-white/90", highlight && "text-blue-400 font-semibold")}>{value}</span>
        </div>
    );
}
