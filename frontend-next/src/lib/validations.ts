import { z } from "zod";

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const dataCenterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  location: locationSchema,
  address: z.string().max(500).optional(),
  dcType: z.string().max(100).optional(),
  totalItLoadKw: z.number().positive("IT Load must be positive"),
  pue: z.number().min(1, "PUE must be at least 1").max(3, "PUE cannot exceed 3").optional(),
  utilizationPercent: z.number().min(0).max(100).optional(),
  coolingType: z.string().max(100).optional(),
  energySource: z.string().max(100).optional(),
  renewablePercent: z.number().min(0).max(100).optional(),
  electricityCostKwh: z.number().min(0).optional(),
  operatingHoursYear: z.number().min(1).max(8760).optional(),
  heatRecoveryEnabled: z.boolean().optional(),
});

export const carbonCreditSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(255),
  creditType: z.string().max(100).optional(),
  pricePerTon: z.number().positive("Price must be positive"),
  availableTons: z.number().positive("Available tons must be positive"),
  vintageYear: z.number().min(2000).max(2100).optional(),
  verificationStandard: z.string().max(100).optional(),
  location: z.string().max(500).optional(),
  projectDescription: z.string().optional(),
});

export const heatSinkSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  location: locationSchema,
  address: z.string().max(500).optional(),
  sinkType: z.string().max(100).optional(),
  capacityMw: z.number().positive("Capacity must be positive"),
  currentDemandMw: z.number().min(0).optional(),
  temperatureRequirementC: z.number().min(0).max(200).optional(),
  seasonalFactor: z.number().min(0).max(10).optional(),
  connectionCostPerKm: z.number().min(0).optional(),
  heatPricePerMwh: z.number().min(0).optional(),
  operatingHoursYear: z.number().min(1).max(8760).optional(),
});

export const calculatePredictionSchema = z.object({
  dataCenterId: z.number().positive("Data center is required"),
  carbonCreditId: z.number().positive().optional(),
  heatSinkIds: z.array(z.number().positive()).optional(),
  scenarioName: z.string().min(1, "Scenario name is required").max(255),
  analysisYears: z.number().min(1).max(30).optional(),
  discountRate: z.number().min(0).max(0.3).optional(),
  customCapexPerKM: z.number().positive().optional(),
  customConnectionCost: z.number().positive().optional(),
});

export type DataCenterFormData = z.infer<typeof dataCenterSchema>;
export type CarbonCreditFormData = z.infer<typeof carbonCreditSchema>;
export type HeatSinkFormData = z.infer<typeof heatSinkSchema>;
export type CalculatePredictionFormData = z.infer<typeof calculatePredictionSchema>;
