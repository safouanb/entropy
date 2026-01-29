"use client";

import { useState } from "react";
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
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/assessment", label: "Assessments", icon: DocumentTextIcon }, // Was New Assessment, but Assessments covers list.
    { href: "/assessment/new", label: "New Project", icon: PlusIcon }, // Explicit new action
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
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0 font-satoshi shadow-xl shadow-black/20 z-50 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center px-6 border-b border-sidebar-border/40 relative group/header">
                <Link href="/" className="flex items-center gap-3 group overflow-hidden">
                    <div className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all shadow-neumorphic-inner">
                        <GlobeEuropeAfricaIcon className="w-5 h-5 text-white/90" />
                    </div>

                    <div className={cn(
                        "flex flex-col transition-opacity duration-300",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100 min-w-0"
                    )}>
                        <span className="font-bold text-lg text-white tracking-tight leading-none font-instrument italic">Entropy</span>
                    </div>
                </Link>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-zinc-500 transition-all shadow-lg z-50",
                        isCollapsed ? "rotate-180" : ""
                    )}
                >
                    <ChevronLeftIcon className="w-3 h-3" />
                </button>
            </div>

            {/* Search (Only visible when expanded) */}
            <div className={cn(
                "px-4 py-6 transition-all duration-300 overflow-hidden",
                isCollapsed ? "h-0 opacity-0 py-0" : "h-auto opacity-100"
            )}>
                <div className="relative group">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar py-2">
                <div>
                    {!isCollapsed && (
                        <div className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30 font-mono animate-in fade-in duration-300">
                            Main Menu
                        </div>
                    )}
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} />
                        ))}
                    </div>
                </div>

                <div>
                    {!isCollapsed && (
                        <div className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30 font-mono animate-in fade-in duration-300">
                            System
                        </div>
                    )}
                    <div className="space-y-1">
                        {secondaryItems.map((item) => (
                            <NavItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-sidebar-border/40">
                <button className={cn(
                    "flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-200 group text-left border border-transparent hover:border-white/5 outline-none focus:bg-white/5",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 border-2 border-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                        <UserCircleIcon className="w-5 h-5 text-white/70" />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col flex-1 min-w-0 animate-in fade-in duration-300">
                            <span className="text-sm font-semibold text-white/90 group-hover:text-white truncate">Demo User</span>
                            <span className="text-[11px] text-white/40 truncate">user@entropy.energy</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}

function NavItem({ item, pathname, isCollapsed }: { item: any, pathname: string, isCollapsed: boolean }) {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)); // Fix logic: Dashboard '/' shouldn't match everything if explicitly defined

    // Correction for Dashboard logic if dashboard path is /dashboard
    const isDashboard = item.href === "/dashboard";
    const highlight = isActive;

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isCollapsed ? "justify-center px-2" : "",
                highlight
                    ? "text-white bg-white/5 shadow-neumorphic-inner border border-white/5"
                    : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent"
            )}
            title={isCollapsed ? item.label : undefined}
        >
            <Icon className={cn(
                "w-5 h-5 transition-colors duration-200 flex-shrink-0",
                highlight ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
            )} />

            {!isCollapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                </span>
            )}

            {highlight && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
        </Link>
    );
}
