"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    ScaleIcon,
    ShieldCheckIcon,
    GlobeEuropeAfricaIcon,
    BoltIcon,
    DocumentTextIcon,
    BuildingLibraryIcon
} from "@heroicons/react/24/outline";

export default function CompliancePage() {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Compliance Codex</h1>
                <p className="text-muted-foreground mt-1">
                    Regulatory intelligence and automated feasibility tracking.
                </p>
            </div>

            <BentoGrid className="max-w-full mx-auto">
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                    />
                ))}
            </BentoGrid>
        </div>
    );
}

const Skeleton = ({ color = "bg-emerald-500/20" }: { color?: string }) => (
    <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl ${color} [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-white/10`} />
);

const items = [
    {
        title: "EED Article 14",
        description: "Mandatory cost-benefit analysis for installations > 2.5 MW. Automated feasibility checks tailored to the Energy Efficiency Directive.",
        header: <Skeleton />,
        icon: <ScaleIcon className="h-4 w-4" />,
    },
    {
        title: "Wärmeplanungsgesetz (WPG)",
        description: "German Heat Planning Act compliance. Mapping waste heat potential to municipal heating zones.",
        header: <Skeleton color="bg-blue-500/20" />,
        icon: <GlobeEuropeAfricaIcon className="h-4 w-4" />,
    },
    {
        title: "GEG § 71",
        description: "Building Energy Act requirements for 65% renewable heat integration. Validating waste heat as a renewable source.",
        header: <Skeleton color="bg-amber-500/20" />,
        icon: <BuildingLibraryIcon className="h-4 w-4" />,
    },
    {
        title: "EU Taxonomy Alignment",
        description: "verify if your heat recovery project qualifies as 'Subject to Taxonomy' under Climate Change Mitigation (Activity 4.25).",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/50 to-black border border-white/10 p-4 items-center justify-center font-mono text-xs text-emerald-400">
            TAXONOMY_ALIGNED = TRUE
        </div>,
        icon: <ShieldCheckIcon className="h-4 w-4" />,
    },
    {
        title: "CSRD / ESRS E1",
        description: "Corporate Sustainability Reporting Directive. Track Scope 1 & 2 emission reductions for ESG reporting.",
        header: <Skeleton color="bg-purple-500/20" />,
        icon: <DocumentTextIcon className="h-4 w-4" />,
    },
    {
        title: "BImSchG Approvals",
        description: "Federal Immission Control Act. Tracking permitting status and noise/emission compliance constraints.",
        header: <Skeleton color="bg-rose-500/20" />,
        icon: <BoltIcon className="h-4 w-4" />,
    },
    {
        title: "Efficiency First Principle",
        description: "Tracking the 'Efficiency First' principle across all planning stages. Prioritizing demand reduction and recovery over new generation.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom_right,white,transparent)]" />,
        icon: <IconSignature className="h-4 w-4" />,
    },
];

const IconSignature = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
        </svg>
    );
};
