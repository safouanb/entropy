"use client";

import InfiniteMenu from "@/components/ui/infinite-menu";

const regulations = [
    { label: "EED Art 14", link: "/compliance/eed" },
    { label: "Wärmeplanungsgesetz", link: "/compliance/wpg" },
    { label: "GEG § 71", link: "/compliance/geg" },
    { label: "EU Taxonomy", link: "/compliance/taxonomy" },
    { label: "CSRD ESRS E1", link: "/compliance/csrd" },
    { label: "BImSchG", link: "/compliance/bimschg" },
];

export default function CompliancePage() {
    return (
        <div className="min-h-[80vh] flex flex-col">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight">Compliance Codex</h1>
                <p className="text-muted-foreground mt-1">
                    Real-time regulatory tracking. Click a regulation to see the decision logic.
                </p>
            </div>

            <div className="flex-1 relative border border-white/10 rounded-2xl overflow-hidden bg-zinc-950/50">
                <div className="absolute top-4 left-4 z-20">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        Live Matrix
                    </span>
                </div>
                <InfiniteMenu items={regulations} />
            </div>
        </div>
    );
}
