'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";

interface AuditEntry {
    version: number;
    date: string;
    changeSummary: string;
    author: string;
}

interface AuditTrailProps {
    steps: AuditEntry[];
    className?: string;
}

export function AuditTrail({ steps, className }: AuditTrailProps) {
    if (!steps || steps.length === 0) {
        return null;
    }

    return (
        <div className={cn('border border-white/10 rounded-xl overflow-hidden bg-zinc-900/30', className)}>
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Version History
                </h3>
            </div>

            <div className="divide-y divide-white/5">
                {steps.map((entry, index) => (
                    <div
                        key={index}
                        className="px-6 py-4 flex items-center justify-between group hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="font-mono text-white/70 border-white/10 bg-white/5">
                                v{entry.version}.0
                            </Badge>
                            <div>
                                <p className="text-sm text-white font-medium">{entry.changeSummary}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{entry.author} • {entry.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 bg-emerald-500/5 border-t border-emerald-500/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-xs text-emerald-400 font-mono opacity-80">
                    Cryptographically verifiable audit log
                </p>
            </div>
        </div>
    );
}
