"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Zap, Leaf, Thermometer, TrendingUp, Clock, Award } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent, INVESTMENT_GRADE_COLORS } from "@/lib/constants";
import type { PredictionResult } from "@/types";

interface ResultsTabProps {
  prediction: PredictionResult | null;
}

export function ResultsTab({ prediction }: ResultsTabProps) {
  if (!prediction) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <p className="text-muted-foreground">
            No prediction results yet. Run a calculation from the Calculate tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { financial_metrics, savings_metrics, energy_metrics, heat_recovery_metrics, carbon_metrics } = prediction;
  const grade = financial_metrics?.investment_grade || "N/A";
  const gradeColors = INVESTMENT_GRADE_COLORS[grade] || { bg: "bg-gray-100", text: "text-gray-800" };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prediction Results: {prediction.scenario_name}</CardTitle>
              <CardDescription>
                Analysis period: {prediction.analysis_years} years at {formatPercent(prediction.discount_rate)} discount rate
              </CardDescription>
            </div>
            <Badge className={`${gradeColors.bg} ${gradeColors.text} text-lg px-3 py-1`}>
              Grade {grade}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Annual Savings"
          value={formatCurrency(savings_metrics?.net_annual_savings || 0)}
          icon={DollarSign}
          description="Net annual savings"
          highlight
        />
        <MetricCard
          title="NPV"
          value={formatCurrency(financial_metrics?.net_present_value || 0)}
          icon={TrendingUp}
          description="Net Present Value"
        />
        <MetricCard
          title="IRR"
          value={formatPercent(financial_metrics?.internal_rate_of_return || 0)}
          icon={Award}
          description="Internal Rate of Return"
        />
        <MetricCard
          title="Payback Period"
          value={`${formatNumber(financial_metrics?.simple_payback_years || 0, 1)} years`}
          icon={Clock}
          description="Simple payback"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Heat Recovery"
          value={`${formatNumber((heat_recovery_metrics?.annual_heat_recovery_kwh || 0) / 1000)} MWh`}
          icon={Thermometer}
          description="Annual heat recovery"
        />
        <MetricCard
          title="Energy Waste Heat"
          value={`${formatNumber(energy_metrics?.waste_heat_kw || 0)} kW`}
          icon={Zap}
          description="Available waste heat"
        />
        <MetricCard
          title="CO2 Avoided"
          value={`${formatNumber((carbon_metrics?.annual_co2_reduction_kg || 0) / 1000)} tons`}
          icon={Leaf}
          description="Annual CO2 reduction"
        />
        <MetricCard
          title="Gas Savings"
          value={formatCurrency(heat_recovery_metrics?.annual_gas_cost_savings || 0)}
          icon={DollarSign}
          description="Annual gas cost savings"
        />
      </div>

      {prediction.yearly_breakdown && prediction.yearly_breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yearly Cash Flow Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Year</th>
                    <th className="text-right py-2">Cash Inflow</th>
                    <th className="text-right py-2">Cash Outflow</th>
                    <th className="text-right py-2">Net Cash Flow</th>
                    <th className="text-right py-2">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {prediction.yearly_breakdown.map((year) => (
                    <tr key={year.year} className="border-b">
                      <td className="py-2">{year.year}</td>
                      <td className="text-right py-2">{formatCurrency(year.cash_inflow)}</td>
                      <td className="text-right py-2">{formatCurrency(year.cash_outflow)}</td>
                      <td className="text-right py-2">{formatCurrency(year.net_cash_flow)}</td>
                      <td className="text-right py-2">{formatCurrency(year.cumulative_cash_flow)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  highlight?: boolean;
}

function MetricCard({ title, value, icon: Icon, description, highlight }: MetricCardProps) {
  return (
    <Card className={highlight ? "border-emerald-500 bg-emerald-50/50" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${highlight ? "text-emerald-600" : "text-muted-foreground"}`} />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <div className={`text-2xl font-bold mt-2 ${highlight ? "text-emerald-700" : ""}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
