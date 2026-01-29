"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    GlobeEuropeAfricaIcon,
    MapIcon,
    Squares2X2Icon,
    ScaleIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
    { href: "/assessment/new", label: "New Assessment", icon: DocumentTextIcon },
    { href: "/", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/compliance", label: "Compliance", icon: ScaleIcon },
    { href: "/map", label: "Map", icon: MapIcon },
];

const secondaryItems = [
    { href: "/about", label: "About", icon: InformationCircleIcon },
    { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[240px] h-screen bg-sidebar border-r border-white/5 flex flex-col sticky top-0">
            {/* Header / Logo */}
            <div className="h-14 flex items-center px-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                        <GlobeEuropeAfricaIcon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="font-instrument italic text-white/90 text-lg tracking-tight">Entropy</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-0.5">
                <div className="px-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
                    Platform
                </div>
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} />
                ))}

                <div className="px-2 mt-8 mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
                    System
                </div>
                {secondaryItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} />
                ))}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border border-white/10" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white/90 group-hover:text-white">User Account</span>
                        <span className="text-[10px] text-white/40">entropy@example.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ item, pathname }: { item: any, pathname: string }) {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 group font-satoshi",
                isActive
                    ? "bg-white/5 text-white/90"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.02]"
            )}
        >
            <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70")} />
            {item.label}
        </Link>
    );
}
