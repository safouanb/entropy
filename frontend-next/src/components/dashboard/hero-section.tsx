"use client";

import { Zap, TrendingUp, Leaf, ArrowRight } from "lucide-react";
import { useAnalytics } from "@/hooks";
import { formatCurrency, formatNumber } from "@/lib/constants";

export function HeroSection() {
  const { data: analytics } = useAnalytics();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Heat Recovery Analysis Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Turn Waste Heat Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Sustainable Value
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl">
            Calculate potential savings from data center heat recovery projects.
            Get detailed financial analysis, ROI projections, and carbon impact assessments.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <StatItem
              icon={Zap}
              value={formatNumber(analytics?.total_data_centers || 0)}
              label="Active Sites"
            />
            <StatItem
              icon={TrendingUp}
              value={formatNumber(analytics?.total_predictions || 0)}
              label="Predictions Made"
            />
            <StatItem
              icon={Leaf}
              value={analytics?.avg_annual_savings ? formatCurrency(analytics.avg_annual_savings) : "$0"}
              label="Avg. Annual Savings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
