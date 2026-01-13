"use client";

import {
  BoltIcon,
  ArrowTrendingUpIcon,
  GlobeEuropeAfricaIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAnalytics } from "@/hooks";
import { formatCurrency, formatNumber } from "@/lib/constants";

export function HeroSection() {
  const { data: analytics } = useAnalytics();

  return (
    <div className="relative bg-slate-900 pt-24 pb-40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="text-emerald-400 font-medium mb-4 tracking-wide text-sm uppercase">
            Waste Heat Intelligence
          </p>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            The missing layer between
            <br />
            <span className="text-slate-400">data centers</span> and
            <br />
            <span className="text-slate-400">district heating.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
            We turn complex heat recovery engineering into standardized,
            computable decisions. Get ROI projections, carbon impact,
            and bankable analysis in minutes.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
            >
              Start Analysis
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-slate-300 font-medium hover:text-white transition-colors"
            >
              How it works
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-12 pt-8 border-t border-slate-800">
            <Stat
              value={formatNumber(analytics?.totalDataCenters || 0)}
              label="Active sites"
            />
            <Stat
              value={formatNumber(analytics?.totalPredictions || 0)}
              label="Analyses run"
            />
            <Stat
              value={analytics?.avgAnnualSavings ? formatCurrency(analytics.avgAnnualSavings) : "$0"}
              label="Avg. annual savings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
