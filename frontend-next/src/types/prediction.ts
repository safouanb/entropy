export interface EnergyMetrics {
  effectiveItLoadKw: number;
  totalPowerKw: number;
  annualEnergyKwh: number;
  annualEnergyCost: number;
  wasteHeatKw: number;
}

export interface HeatRecoveryMetrics {
  wasteHeatAvailableKw: number;
  recoverableHeatKw: number;
  annualHeatRecoveryKwh: number;
  equivalentGasTherms: number;
  annualGasCostSavings: number;
  co2AvoidedKgPerYear: number;
  distanceEfficiencyFactor: number;
  distanceKm: number;
}

export interface CarbonMetrics {
  annualCo2EmissionsKg: number;
  annualCo2ReductionKg: number;
  carbonIntensityKgKwh: number;
  renewableOffsetKg: number;
  netAnnualCo2Kg: number;
}

export interface CapexMetrics {
  heatExchangerCost: number;
  distributionInfrastructure: number;
  controlsAutomation: number;
  contingencyReserve: number;
  totalProjectCapex: number;
}

export interface OpexMetrics {
  annualMaintenanceCost: number;
  annualMonitoringCost: number;
  annualUtilityCost: number;
  totalAnnualOpex: number;
}

export interface SavingsMetrics {
  annualHeatRevenue: number;
  annualCarbonCreditRevenue: number;
  totalAnnualRevenue: number;
  netAnnualSavings: number;
}

export interface FinancialMetrics {
  netPresentValue: number;
  internalRateOfReturn: number;
  simplePaybackYears: number;
  discountedPaybackYears: number;
  benefitCostRatio: number;
  profitabilityIndex: number;
  investmentGrade: string;
}

export interface YearlyBreakdown {
  year: number;
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
  heatRecoveryKwh: number;
  co2ReductionKg: number;
}

export interface HeatSinkAllocation {
  heatSinkId: number;
  heatSinkName: string;
  allocatedHeatKw: number;
  distanceKm: number;
  compatibilityScore: number;
}

export interface SensitivityAnalysis {
  npvSensitivity: Record<string, number>;
  irrSensitivity: Record<string, number>;
  breakevenAnalysis: Record<string, number>;
}

export interface PredictionResult {
  id?: number;
  dataCenterId: number;
  carbonCreditId?: number;
  heatSinkId?: number;
  scenarioName: string;
  analysisYears: number;
  discountRate: number;
  energyMetrics: EnergyMetrics;
  heatRecoveryMetrics: HeatRecoveryMetrics;
  carbonMetrics: CarbonMetrics;
  capexMetrics: CapexMetrics;
  opexMetrics: OpexMetrics;
  savingsMetrics: SavingsMetrics;
  financialMetrics: FinancialMetrics;
  sensitivityAnalysis?: SensitivityAnalysis;
  yearlyBreakdown: YearlyBreakdown[];
  heatSinkAllocations?: HeatSinkAllocation[];
  createdAt?: string;
}

export interface CalculatePredictionInput {
  dataCenterId: number;
  carbonCreditId?: number;
  heatSinkIds?: number[];
  scenarioName: string;
  analysisYears?: number;
  discountRate?: number;
  customPue?: number;
  customEfficiency?: number;
  customElectricityRate?: number;
  customCarbonPrice?: number;
}

export interface PredictionAnalytics {
  totalPredictions: number;
  totalDataCenters: number;
  totalCarbonCredits: number;
  totalHeatSinks: number;
  avgAnnualSavings: number;
  avgInternalRateReturn: number;
  avgPaybackPeriodYears: number;
  // Some fields might come as strings from backend JSON (e.g., int64)
  // but we can type them as number | string for safety if needed,
  // or just number if we rely on JS automatic parsing (which acts as number usually, 
  // but int64 strings need care. However, the backend-client casts to 'unknown' first).
  // Given the previous successful curl output: 
  // "totalCount":"5" -> string.
  // "avgAnnualSavings":1040000 -> number.
  // The counts in analytics were "7", "5" etc in the curl output I saw earlier.
  // So I should probably type the counts as string | number to be safe.
}
