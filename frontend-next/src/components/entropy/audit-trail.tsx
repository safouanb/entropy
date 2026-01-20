'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AuditEntry {
    version: number;
    date: string;
    changeSummary: string;
    author: string;
}

interface AuditTrailProps {
    entries: AuditEntry[];
    className?: string;
}

export function AuditTrail({ entries, className }: AuditTrailProps) {
    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Audit Trail
                </h3>
            </div>

            <div className="divide-y divide-gray-100">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className="px-4 py-3 flex items-center gap-6 text-sm"
                    >
                        <span className="font-mono font-bold text-gray-900 w-8">
                            v{entry.version}
                        </span>
                        <span className="font-mono text-gray-500 w-24">
                            {entry.date}
                        </span>
                        <span className="text-gray-700 flex-1">
                            {entry.changeSummary}
                        </span>
                        <span className="text-gray-400 text-right">
                            {entry.author}
                        </span>
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-400 font-mono">
                    All changes preserved
                </p>
            </div>
        </div>
    );
}
