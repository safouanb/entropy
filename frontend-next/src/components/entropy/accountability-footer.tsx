'use client';

import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";

interface AccountabilityFooterProps {
    officerName?: string;
    timestamp?: string;
    signatureHash?: string;
    className?: string;
}

export function AccountabilityFooter({
    officerName,
    timestamp,
    signatureHash,
    className
}: AccountabilityFooterProps) {
    return (
        <Card className={cn(
            'bg-zinc-950 border-zinc-800 relative overflow-hidden',
            className
        )}>
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="p-8 flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                    <Shield className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                            Entropy Accountability Statement
                        </h4>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                            Entropy determines what is defensible, not what must be built.
                            We take responsibility for the decision layer between policy intent
                            and infrastructure execution.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                        {officerName && (
                            <div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Compliance Officer</span>
                                <span className="text-sm font-mono text-zinc-300">{officerName}</span>
                            </div>
                        )}
                        {timestamp && (
                            <div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Timestamp</span>
                                <span className="text-sm font-mono text-zinc-300">{timestamp}</span>
                            </div>
                        )}
                        {signatureHash && (
                            <div className="flex-1 min-w-[200px]">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Signature Hash
                                </span>
                                <span className="text-xs font-mono text-zinc-400 break-all">{signatureHash}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
