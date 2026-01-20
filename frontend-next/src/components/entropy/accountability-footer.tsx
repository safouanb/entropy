'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountabilityFooterProps {
    className?: string;
}

export function AccountabilityFooter({ className }: AccountabilityFooterProps) {
    return (
        <div className={cn(
            'bg-black text-white rounded-lg p-6 mt-8',
            className
        )}>
            <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                    <h4 className="font-bold mb-2">
                        Entropy Accountability Statement
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Entropy determines what is defensible, not what must be built.
                        We take responsibility for the decision layer between policy intent
                        and infrastructure execution.
                    </p>
                    <p className="text-sm text-gray-400 mt-3 italic">
                        We don't just model scenarios — we stand behind one.
                    </p>
                </div>
            </div>
        </div>
    );
}
