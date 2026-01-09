"use client";

import {
  BoltIcon,
  ArrowTrendingUpIcon,
  GlobeEuropeAfricaIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useAnalytics } from "@/hooks";
import { formatCurrency, formatNumber } from "@/lib/constants";

export function HeroSection() {
  const { data: analytics } = useAnalytics();

  return (
    <div className="relative overflow-hidden bg-slate-900 pt-16 pb-32">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Heat Recovery Analysis Platform</span>
          </div> */}

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Turn Waste Heat Into{" "}
            <span className="text-emerald-400">
              Sustainable Value
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Calculate potential savings from data center heat recovery projects.
            Get detailed financial analysis, ROI projections, and carbon impact assessments.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              Start Analysis
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            <StatItem
              icon={BoltIcon}
              value={formatNumber(analytics?.totalDataCenters || 0)}
              label="Active Sites"
            />
            <StatItem
              icon={ArrowTrendingUpIcon}
              value={formatNumber(analytics?.totalPredictions || 0)}
              label="Predictions Made"
            />
            <StatItem
              icon={GlobeEuropeAfricaIcon}
              value={analytics?.avgAnnualSavings ? formatCurrency(analytics.avgAnnualSavings) : "$0"}
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
      <div className="text-left">
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
