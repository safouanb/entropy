// Default values for forms
export const DEFAULTS = {
  DEFAULT_LATITUDE: 52.3676, // Amsterdam
  DEFAULT_LONGITUDE: 4.9041,
  PUE: 1.5,
  UTILIZATION_PERCENT: 70,
  OPERATING_HOURS_YEAR: 8760,
  ELECTRICITY_COST_KWH: 0.12,
  RENEWABLE_PERCENT: 0,
  ANALYSIS_YEARS: 10,
  DISCOUNT_RATE: 0.08,
  CARBON_PRICE_PER_TON: 25,
  AVAILABLE_TONS: 10000,
};

// Data Center Types
export const DC_TYPES = [
  { value: "hyperscale", label: "Hyperscale" },
  { value: "enterprise", label: "Enterprise" },
  { value: "colocation", label: "Colocation" },
  { value: "edge", label: "Edge" },
  { value: "cloud", label: "Cloud" },
] as const;

// Cooling Types
export const COOLING_TYPES = [
  { value: "air_cooled", label: "Air Cooled" },
  { value: "water_cooled", label: "Water Cooled" },
  { value: "liquid_immersion", label: "Liquid Immersion" },
  { value: "evaporative", label: "Evaporative" },
  { value: "free_cooling", label: "Free Cooling" },
] as const;

// Energy Sources
export const ENERGY_SOURCES = [
  { value: "grid", label: "Grid Power" },
  { value: "solar", label: "Solar" },
  { value: "wind", label: "Wind" },
  { value: "natural_gas", label: "Natural Gas" },
  { value: "mixed", label: "Mixed Renewable" },
] as const;

// Carbon Credit Verification Standards
export const VERIFICATION_STANDARDS = [
  { value: "VCS", label: "Verified Carbon Standard (VCS)" },
  { value: "Gold Standard", label: "Gold Standard" },
  { value: "CDM", label: "Clean Development Mechanism (CDM)" },
  { value: "CAR", label: "Climate Action Reserve (CAR)" },
  { value: "ACR", label: "American Carbon Registry (ACR)" },
] as const;

// Carbon Credit Types
export const CREDIT_TYPES = [
  { value: "renewable_energy", label: "Renewable Energy" },
  { value: "energy_efficiency", label: "Energy Efficiency" },
  { value: "forestry", label: "Forestry & Land Use" },
  { value: "methane_capture", label: "Methane Capture" },
  { value: "direct_air_capture", label: "Direct Air Capture" },
] as const;

// Heat Sink Types
export const HEAT_SINK_TYPES = [
  { value: "district_heating", label: "District Heating Network" },
  { value: "industrial", label: "Industrial Process" },
  { value: "agricultural", label: "Agricultural (Greenhouse)" },
  { value: "residential", label: "Residential Building" },
  { value: "commercial", label: "Commercial Building" },
  { value: "swimming_pool", label: "Swimming Pool/Spa" },
] as const;

// Investment Grade Colors
export const INVESTMENT_GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: "bg-green-100", text: "text-green-800" },
  B: { bg: "bg-blue-100", text: "text-blue-800" },
  C: { bg: "bg-yellow-100", text: "text-yellow-800" },
  D: { bg: "bg-red-100", text: "text-red-800" },
};

// Format helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
