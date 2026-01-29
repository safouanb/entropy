"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GlobeEuropeAfricaIcon,
  MapIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks";

const navItems = [
  { href: "/assessment/new", label: "New Assessment", icon: DocumentTextIcon },
  { href: "/", label: "Dashboard", icon: Squares2X2Icon },
  { href: "/compliance", label: "Compliance", icon: ScaleIcon },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/about", label: "About", icon: InformationCircleIcon },
];

export function Header() {
  const pathname = usePathname();
  const { data: analytics } = useAnalytics();

  // Hide the app header on the landing page (it has its own nav)
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-white/10">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
            <GlobeEuropeAfricaIcon className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight text-white font-instrument italic">Entropy</span>
            <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase font-satoshi">Heat Recovery Platform</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-satoshi",
                  isActive
                    ? "bg-white/10 text-white shadow-lg shadow-emerald-900/20 border border-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {analytics && (
            <div className="hidden lg:flex items-center gap-6">
              <StatBadge
                icon={BoltIcon}
                value={analytics.totalDataCenters || 0}
                label="Sites"
                color="emerald"
              />
              <StatBadge
                icon={ArrowTrendingUpIcon}
                value={analytics.totalPredictions || 0}
                label="Analyses"
                color="teal"
              />
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-medium text-emerald-400 font-satoshi">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatBadge({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: "emerald" | "teal";
}) {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    teal: "text-teal-400 bg-teal-500/10",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("p-1.5 rounded-lg border border-white/5", colors[color])}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-none text-white/90 font-satoshi">{value}</span>
        <span className="text-[10px] text-white/40 font-satoshi">{label}</span>
      </div>
    </div>
  );
}
