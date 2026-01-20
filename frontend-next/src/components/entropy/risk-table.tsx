'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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
            <div className={cn('border border-gray-200 rounded-lg p-6 bg-gray-50', className)}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Risk & Responsibility Allocation
                </h3>
                <p className="text-sm text-gray-500">
                    Risk allocation will be determined based on selected implementation pathway.
                </p>
            </div>
        );
    }

    return (
        <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Risk & Responsibility Allocation
                </h3>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Risk Category
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Bearing Party
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Mitigation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {allocations.map((risk, index) => (
                        <tr
                            key={index}
                            className={cn(
                                'border-b border-gray-100',
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            )}
                        >
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {categoryLabels[risk.category] || risk.category}
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-700">
                                {partyLabels[risk.bearingParty] || risk.bearingParty}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {risk.mitigationMechanism.replace(/_/g, ' ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                <p className="text-xs text-amber-800">
                    ⚠️ This section is critical for contract and financing discussions. All allocations must be explicit.
                </p>
            </div>
        </div>
    );
}
