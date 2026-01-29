"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    GlobeEuropeAfricaIcon,
    Squares2X2Icon,
    ScaleIcon,
    DocumentTextIcon,
    MapIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    ArchiveBoxIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/assessment/new", label: "New Assessment", icon: DocumentTextIcon },
    { href: "/records", label: "Records", icon: ArchiveBoxIcon },
    { href: "/map", label: "Infrastructure Map", icon: MapIcon },
    { href: "/compliance", label: "Compliance", icon: ScaleIcon },
    { href: "/analytics", label: "Analytics", icon: ChartBarIcon },
];

const secondaryItems = [
    { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[260px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0 font-satoshi shadow-xl shadow-black/20 z-50">
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-5 border-b border-sidebar-border/60">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/10 group-hover:border-white/20 group-hover:bg-white/15 transition-all">
                        <GlobeEuropeAfricaIcon className="w-5 h-5 text-white/90" />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white tracking-tight leading-none">Entropy</span>
                        <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase mt-0.5">Decision Engine</span>
                    </div>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto no-scrollbar">
                <div>
                    <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30 font-mono">
                        Platform
                    </div>
                    <div className="space-y-0.5">
                        {navItems.map((item) => (
                            <NavItem key={item.href} item={item} pathname={pathname} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30 font-mono">
                        System
                    </div>
                    <div className="space-y-0.5">
                        {secondaryItems.map((item) => (
                            <NavItem key={item.href} item={item} pathname={pathname} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-sidebar-border/60">
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-all duration-200 group text-left border border-transparent hover:border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center shadow-inner">
                        <UserCircleIcon className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white/90 group-hover:text-white truncate">Demo User</span>
                        <span className="text-[11px] text-white/40 truncate">user@entropy.energy</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}

function NavItem({ item, pathname }: { item: any, pathname: string }) {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                    ? "text-white bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5"
                    : "text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent"
            )}
        >
            <Icon className={cn(
                "w-5 h-5 transition-colors duration-200",
                isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
            )} />
            {item.label}
            {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
        </Link>
    );
}
