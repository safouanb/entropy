'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

const scenarioLabels: Record<string, { short: string; full: string }> = {
    NO_REUSE: { short: 'A', full: 'No Heat Reuse' },
    DIRECT_REUSE: { short: 'B', full: 'Direct Reuse' },
    REUSE_WITH_MITIGATION: { short: 'C', full: 'Reuse + Mitigation' },
};

const statusConfig = {
    COMPLIANT: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-700',
        badge: 'bg-emerald-600',
        icon: CheckCircle,
    },
    CONDITIONAL: {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-700',
        badge: 'bg-amber-500',
        icon: AlertTriangle,
    },
    NON_COMPLIANT: {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-700',
        badge: 'bg-red-600',
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
}: ScenarioCardProps) {
    const labels = scenarioLabels[scenario];
    const config = statusConfig[status];
    const Icon = config.icon;
    const isNoReuse = scenario === 'NO_REUSE';

    return (
        <div className={cn(
            'rounded-lg border-2 p-5 transition-all hover:shadow-md',
            config.border,
            config.bg,
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                        {labels.short}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                        {labels.full}
                    </h3>
                </div>
                <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded text-white',
                    config.badge
                )}>
                    {status.replace('_', '-')}
                </span>
            </div>

            {/* Reason */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {reason}
            </p>

            {/* Failure Mode */}
            {failureMode && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-white/50 rounded border border-gray-200">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">
                        {failureMode}
                    </p>
                </div>
            )}

            {/* Metrics (only for reuse scenarios) */}
            {!isNoReuse && metrics && (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CAPEX</span>
                        <span className="font-mono font-medium">
                            {formatCurrency(metrics.capexMin, metrics.capexMax)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payback</span>
                        <span className="font-mono font-medium">
                            {formatYears(metrics.paybackMin, metrics.paybackMax)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">IRR</span>
                        <span className="font-mono font-medium">
                            {metrics.irrMin.toFixed(1)}% – {metrics.irrMax.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CO₂ Avoided</span>
                        <span className="font-mono font-medium">
                            {(metrics.co2Min / 1000).toFixed(0)} t/yr
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
