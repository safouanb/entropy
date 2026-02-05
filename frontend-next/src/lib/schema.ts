export interface Location {
    latitude: number;
    longitude: number;
}

export interface PaginationRequest {
    page?: number;
    pageSize?: number;
}

export interface PaginationMetadata {
    page: number;
    pageSize: number;
    totalCount: number; // int64 -> number (safe for JS up to 2^53)
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface DataCenter {
    id: number; // int64
    name: string;
    location: Location;
    address: string;
    dcType: string;
    totalItLoadKw: number;
    pue: number;
    utilizationPercent: number;
    coolingType: string;
    energySource: string;
    renewablePercent: number;
    electricityCostKwh: number;
    operatingHoursYear: number;
    heatRecoveryEnabled: boolean;
    createdAt: string; // ISO timestamp
}

export interface CarbonCredit {
    id: number;
    projectName: string;
    creditType: string;
    pricePerTon: number;
    availableTons: number;
    vintageYear: number;
    verificationStandard: string;
    location: string;
    projectDescription: string;
    createdAt: string;
}

export interface HeatSink {
    id: number;
    name: string;
    location: Location;
    address: string;
    sinkType: string;
    capacityMw: number;
    currentDemandMw: number;
    temperatureRequirementC: number;
    seasonalFactor: number;
    connectionCostPerKm: number;
    heatPricePerMwh: number;
    operatingHoursYear: number;
    createdAt: string;
}

export interface PredictionResult {
    id: number;
    dataCenterId: number;
    carbonCreditId: number;
    heatSinkId: number;
    scenarioName: string;
    analysisYears: number;
    totalCapex: number;
    annualOpex: number;
    annualSavings: number;
    netPresentValue: number;
    internalRateReturn: number;
    paybackPeriodYears: number;
    investmentGrade: string;
    annualCo2ReductionKg: number;
    annualHeatRecoveryKwh: number;
    detailedResultsJson: string;
    createdAt: string;
}

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

export interface CalculatePredictionResponse {
    dataCenterId: number;
    carbonCreditId: number;
    heatSinkId: number;
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
    // sensitivityAnalysis skipped for brevity
    yearlyBreakdown: YearlyBreakdown[];
    heatSinkAllocations: HeatSinkAllocation[];
    createdAt: string;
}

export interface PredictionAnalytics {
    totalPredictions: number;
    totalDataCenters: number;
    totalCarbonCredits: number;
    totalHeatSinks: number;
    avgAnnualSavings: number;
    avgInternalRateReturn: number;
    avgPaybackPeriodYears: number;
}

export interface CheckComplianceRequest {
    jurisdiction: string;
    totalItLoadKw: number;
    planDate?: string; // ISO string
    heatRecoveryReady: boolean;
}

export interface CheckComplianceResponse {
    status: string;
    applicableLaw: string;
    complianceDeadline?: string;
    reasoning: string[];
    remediationSteps: string[];
}

export interface DashboardStats {
    activeSites: number;
    complianceRate: number;
    annualSavings: number;
    totalActivities: number;
    completedAssessments: number;
}

export interface ActivityLogItem {
    id: number;
    timeAgo: string;
    user: string;
    action: string;
    type: string;
    icon: string;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    notifyAssessmentComplete: boolean;
    notifyRegulatoryUpdates: boolean;
    apiKeyLive: string;
}
