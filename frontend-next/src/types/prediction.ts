export interface EnergyMetrics {
  effective_it_load_kw: number;
  total_power_kw: number;
  annual_energy_kwh: number;
  annual_energy_cost: number;
  waste_heat_kw: number;
}

export interface HeatRecoveryMetrics {
  waste_heat_available_kw: number;
  recoverable_heat_kw: number;
  annual_heat_recovery_kwh: number;
  equivalent_gas_therms: number;
  annual_gas_cost_savings: number;
  co2_avoided_kg_per_year: number;
  distance_efficiency_factor: number;
}

export interface CarbonMetrics {
  annual_co2_emissions_kg: number;
  annual_co2_reduction_kg: number;
  carbon_intensity_kg_kwh: number;
  renewable_offset_kg: number;
  net_annual_co2_kg: number;
}

export interface CapexMetrics {
  heat_exchanger_cost: number;
  distribution_infrastructure: number;
  controls_automation: number;
  contingency_reserve: number;
  total_project_capex: number;
}

export interface OpexMetrics {
  annual_maintenance_cost: number;
  annual_monitoring_cost: number;
  annual_utility_cost: number;
  total_annual_opex: number;
}

export interface SavingsMetrics {
  annual_heat_revenue: number;
  annual_carbon_credit_revenue: number;
  total_annual_revenue: number;
  net_annual_savings: number;
}

export interface FinancialMetrics {
  net_present_value: number;
  internal_rate_of_return: number;
  simple_payback_years: number;
  discounted_payback_years: number;
  benefit_cost_ratio: number;
  profitability_index: number;
  investment_grade: string;
}

export interface YearlyBreakdown {
  year: number;
  cash_inflow: number;
  cash_outflow: number;
  net_cash_flow: number;
  cumulative_cash_flow: number;
  discounted_cash_flow: number;
  heat_recovery_kwh: number;
  co2_reduction_kg: number;
}

export interface HeatSinkAllocation {
  heat_sink_id: number;
  heat_sink_name: string;
  allocated_heat_kw: number;
  distance_km: number;
  compatibility_score: number;
}

export interface SensitivityAnalysis {
  npv_sensitivity: Record<string, number>;
  irr_sensitivity: Record<string, number>;
  breakeven_analysis: Record<string, number>;
}

export interface PredictionResult {
  id?: number;
  data_center_id: number;
  carbon_credit_id?: number;
  heat_sink_id?: number;
  scenario_name: string;
  analysis_years: number;
  discount_rate: number;
  energy_metrics: EnergyMetrics;
  heat_recovery_metrics: HeatRecoveryMetrics;
  carbon_metrics: CarbonMetrics;
  capex_metrics: CapexMetrics;
  opex_metrics: OpexMetrics;
  savings_metrics: SavingsMetrics;
  financial_metrics: FinancialMetrics;
  sensitivity_analysis?: SensitivityAnalysis;
  yearly_breakdown: YearlyBreakdown[];
  heat_sink_allocations?: HeatSinkAllocation[];
  created_at?: string;
}

export interface CalculatePredictionInput {
  data_center_id: number;
  carbon_credit_id?: number;
  heat_sink_ids?: number[];
  scenario_name: string;
  analysis_years?: number;
  discount_rate?: number;
  custom_pue?: number;
  custom_efficiency?: number;
  custom_electricity_rate?: number;
  custom_carbon_price?: number;
}

export interface PredictionAnalytics {
  total_predictions: number;
  total_data_centers: number;
  total_carbon_credits: number;
  total_heat_sinks: number;
  avg_annual_savings: number;
  avg_internal_rate_return: number;
  avg_payback_period_years: number;
}
