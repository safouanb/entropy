'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RiskAllocation {
    category: string;
    bearingParty: string;
    mitigationMechanism: string;
    notes?: string;
}

interface RiskTableProps {
    allocations: RiskAllocation[];
    className?: string;
}

const categoryLabels: Record<string, string> = {
    SUPPLY_VARIABILITY: 'Supply Variability',
    DEMAND_VARIABILITY: 'Demand Variability',
    LIFETIME_MISMATCH: 'Lifetime Mismatch',
    PERFORMANCE_DEGRADATION: 'Performance Risk',
    REGULATORY_CHANGE: 'Regulatory Change',
};

const partyLabels: Record<string, string> = {
    DC_OPERATOR: 'DC Operator',
    OFFTAKER: 'Offtaker',
    ESCO: 'ESCO',
    SHARED: 'Shared',
};

export function RiskTable({ allocations, className }: RiskTableProps) {
    if (!allocations || allocations.length === 0) {
        return (
            <div className={cn('border border-white/10 rounded-lg p-6 bg-white/5', className)}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Risk & Responsibility Allocation
                </h3>
                <p className="text-sm text-muted-foreground">
                    Risk allocation will be determined based on selected implementation pathway.
                </p>
            </div>
        );
    }

    return (
        <div className={cn('border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50', className)}>
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Risk Assessment Matrix
                </h3>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                    {allocations.length} Risks Identified
                </Badge>
            </div>

            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Category</TableHead>
                        <TableHead className="text-muted-foreground">Bearing Party</TableHead>
                        <TableHead className="text-muted-foreground">Mitigation Strategy</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allocations.map((risk, index) => (
                        <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="font-medium text-white">
                                {categoryLabels[risk.category] || risk.category}
                            </TableCell>
                            <TableCell>
                                <span className={cn(
                                    "px-2 py-1 rounded text-xs font-mono",
                                    risk.bearingParty === 'DC_OPERATOR' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                        risk.bearingParty === 'OFFTAKER' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                            'bg-zinc-800 text-zinc-300 border border-white/10'
                                )}>
                                    {partyLabels[risk.bearingParty] || risk.bearingParty}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {risk.mitigationMechanism.replace(/_/g, ' ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="px-4 py-3 bg-amber-500/10 border-t border-amber-500/20">
                <p className="text-xs text-amber-400 font-medium">
                    ⚠️ This section is critical for contract and financing discussions.
                </p>
            </div>
        </div>
    );
}
