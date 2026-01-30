
import React from "react";
import { CubeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
    title = "No items found",
    description = "There are no items to display at this time.",
    actionLabel,
    onAction,
    icon: Icon = CubeIcon
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 ring-offset-4 ring-offset-black">
                <Icon className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
