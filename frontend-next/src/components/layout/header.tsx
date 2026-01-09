"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Map, Info, LayoutDashboard, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/about", label: "About", icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const { data: analytics } = useAnalytics();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight">PyRecycleHeat</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Heat Recovery Platform</span>
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
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                icon={Zap}
                value={analytics.total_data_centers || 0}
                label="Sites"
                color="emerald"
              />
              <StatBadge
                icon={TrendingUp}
                value={analytics.total_predictions || 0}
                label="Analyses"
                color="teal"
              />
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-700">Online</span>
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
  icon: React.ElementType;
  value: number;
  label: string;
  color: "emerald" | "teal";
}) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    teal: "text-teal-600 bg-teal-50",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("p-1.5 rounded-lg", colors[color])}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-none">{value}</span>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
