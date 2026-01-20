'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordHeaderProps {
    recordId: string;
    projectName: string;
    jurisdiction: string;
    version: number;
    date: string;
    finalized?: boolean;
    className?: string;
}

export function RecordHeader({
    recordId,
    projectName,
    jurisdiction,
    version,
    date,
    finalized = false,
    className,
}: RecordHeaderProps) {
    return (
        <div className={cn('border-b-2 border-black pb-6 mb-8', className)}>
            {/* Finalized Banner */}
            {finalized && (
                <div className="bg-black text-white px-4 py-2 -mx-8 -mt-8 mb-6 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        FINALIZED — This record is locked and cannot be modified
                    </span>
                </div>
            )}

            {/* Title */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black mb-1">
                        HEAT REUSE DECISION & COMPLIANCE RECORD
                    </h1>
                    <p className="text-sm text-gray-500">
                        This is not a pitch. This is the product.
                    </p>
                </div>
                {finalized && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded text-sm font-mono">
                        <Lock className="w-3 h-3" />
                        LOCKED
                    </div>
                )}
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm">
                <div>
                    <span className="text-gray-400 mr-2">Record ID:</span>
                    <span className="font-mono font-medium">{recordId}</span>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Project:</span>
                    <span className="font-medium">{projectName}</span>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Jurisdiction:</span>
                    <span className="font-medium">{jurisdiction}</span>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Version:</span>
                    <span className="font-mono font-medium">{version}</span>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Date:</span>
                    <span className="font-mono font-medium">{date}</span>
                </div>
            </div>
        </div>
    );
}
