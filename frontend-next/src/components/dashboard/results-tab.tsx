"use client";

import { DollarSign, Zap, Leaf, Thermometer, TrendingUp, Clock, Award, BarChart3, Calculator } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/constants";
import type { PredictionResult } from "@/types";

interface ResultsTabProps {
  prediction: PredictionResult | null;
}

export function ResultsTab({ prediction }: ResultsTabProps) {
  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <Calculator className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-500 max-w-md">
          Run a calculation from the Calculate tab to see your heat recovery savings prediction here.
        </p>
      </div>
    );
  }

  const { financialMetrics, savingsMetrics, energyMetrics, heatRecoveryMetrics, carbonMetrics } = prediction;
  const grade = financialMetrics?.investmentGrade || "N/A";

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-500";
      case "B": return "bg-blue-500";
      case "C": return "bg-amber-500";
      case "D": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl bg-slate-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-emerald-400 text-sm font-medium mb-1">Prediction Results</p>
            <h2 className="text-2xl font-bold text-white">{prediction.scenarioName}</h2>
            <p className="text-slate-400 mt-1">
              {prediction.analysisYears} year analysis at {formatPercent(prediction.discountRate)} discount rate
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-xl ${getGradeColor(grade)}`}>
              <p className="text-white/80 text-xs font-medium">Investment Grade</p>
              <p className="text-white text-3xl font-bold">{grade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics - Primary Row */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Financial Performance</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Annual Savings"
            value={formatCurrency(savingsMetrics?.netAnnualSavings || 0)}
            icon={DollarSign}
            description="Net annual savings"
            variant="primary"
          />
          <MetricCard
            title="NPV"
            value={formatCurrency(financialMetrics?.netPresentValue || 0)}
            icon={TrendingUp}
            description="Net Present Value"
          />
          <MetricCard
            title="IRR"
            value={formatPercent(financialMetrics?.internalRateOfReturn || 0)}
            icon={Award}
            description="Internal Rate of Return"
          />
          <MetricCard
            title="Payback Period"
            value={`${formatNumber(financialMetrics?.simplePaybackYears || 0, 1)} years`}
            icon={Clock}
            description="Simple payback"
          />
        </div>
      </div>

      {/* Energy & Environmental Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-teal-100">
            <Leaf className="h-4 w-4 text-teal-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Energy & Environmental Impact</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Heat Recovery"
            value={`${formatNumber((heatRecoveryMetrics?.annualHeatRecoveryKwh || 0) / 1000)} MWh`}
            icon={Thermometer}
            description="Annual heat recovery"
            variant="teal"
          />
          <MetricCard
            title="Waste Heat Available"
            value={`${formatNumber(energyMetrics?.wasteHeatKw || 0)} kW`}
            icon={Zap}
            description="Available waste heat"
          />
          <MetricCard
            title="CO2 Avoided"
            value={`${formatNumber((carbonMetrics?.annualCo2ReductionKg || 0) / 1000)} tons`}
            icon={Leaf}
            description="Annual CO2 reduction"
            variant="green"
          />
          <MetricCard
            title="Gas Savings"
            value={formatCurrency(heatRecoveryMetrics?.annualGasCostSavings || 0)}
            icon={DollarSign}
            description="Annual gas cost savings"
          />
        </div>
      </div>

      {/* Cash Flow Table */}
      {prediction.yearlyBreakdown && prediction.yearlyBreakdown.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Yearly Cash Flow Breakdown</h3>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Year</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Cash Inflow</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Cash Outflow</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Net Cash Flow</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {prediction.yearlyBreakdown.map((year) => (
                    <tr
                      key={year.year}
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${year.cumulativeCashFlow >= 0 ? "bg-emerald-50/50" : ""
                        }`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">Year {year.year}</td>
                      <td className="text-right py-4 px-6 text-emerald-600 font-medium">
                        {formatCurrency(year.cashInflow)}
                      </td>
                      <td className="text-right py-4 px-6 text-red-500">
                        {formatCurrency(year.cashOutflow)}
                      </td>
                      <td className={`text-right py-4 px-6 font-medium ${year.netCashFlow >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}>
                        {formatCurrency(year.netCashFlow)}
                      </td>
                      <td className={`text-right py-4 px-6 font-semibold ${year.cumulativeCashFlow >= 0 ? "text-emerald-700" : "text-red-600"
                        }`}>
                        {formatCurrency(year.cumulativeCashFlow)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  variant?: "default" | "primary" | "teal" | "green";
}

function MetricCard({ title, value, icon: Icon, description, variant = "default" }: MetricCardProps) {
  const variants = {
    default: {
      card: "border-gray-200 bg-white hover:border-gray-300",
      icon: "bg-gray-100 text-gray-600",
      value: "text-gray-900",
    },
    primary: {
      card: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
      icon: "bg-emerald-500 text-white",
      value: "text-emerald-700",
    },
    teal: {
      card: "border-teal-200 bg-teal-50 hover:border-teal-300",
      icon: "bg-teal-500 text-white",
      value: "text-teal-700",
    },
    green: {
      card: "border-green-200 bg-green-50 hover:border-green-300",
      icon: "bg-green-500 text-white",
      value: "text-green-700",
    },
  };

  const style = variants[variant];

  return (
    <div className={`p-5 rounded-xl border transition-all hover:shadow-md ${style.card}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${style.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${style.value}`}>
        {value}
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
