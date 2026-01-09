import { z } from "zod";

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const dataCenterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  location: locationSchema,
  address: z.string().max(500).optional(),
  dc_type: z.string().max(100).optional(),
  total_it_load_kw: z.number().positive("IT Load must be positive"),
  pue: z.number().min(1, "PUE must be at least 1").max(3, "PUE cannot exceed 3").optional(),
  utilization_percent: z.number().min(0).max(100).optional(),
  cooling_type: z.string().max(100).optional(),
  energy_source: z.string().max(100).optional(),
  renewable_percent: z.number().min(0).max(100).optional(),
  electricity_cost_kwh: z.number().min(0).optional(),
  operating_hours_year: z.number().min(1).max(8760).optional(),
  heat_recovery_enabled: z.boolean().optional(),
});

export const carbonCreditSchema = z.object({
  project_name: z.string().min(1, "Project name is required").max(255),
  credit_type: z.string().max(100).optional(),
  price_per_ton: z.number().positive("Price must be positive"),
  available_tons: z.number().positive("Available tons must be positive"),
  vintage_year: z.number().min(2000).max(2100).optional(),
  verification_standard: z.string().max(100).optional(),
  location: z.string().max(500).optional(),
  project_description: z.string().optional(),
});

export const heatSinkSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  location: locationSchema,
  address: z.string().max(500).optional(),
  sink_type: z.string().max(100).optional(),
  capacity_mw: z.number().positive("Capacity must be positive"),
  current_demand_mw: z.number().min(0).optional(),
  temperature_requirement_c: z.number().min(0).max(200).optional(),
  seasonal_factor: z.number().min(0).max(10).optional(),
  connection_cost_per_km: z.number().min(0).optional(),
  heat_price_per_mwh: z.number().min(0).optional(),
  operating_hours_year: z.number().min(1).max(8760).optional(),
});

export const calculatePredictionSchema = z.object({
  data_center_id: z.number().positive("Data center is required"),
  carbon_credit_id: z.number().positive().optional(),
  heat_sink_ids: z.array(z.number().positive()).optional(),
  scenario_name: z.string().min(1, "Scenario name is required").max(255),
  analysis_years: z.number().min(1).max(30).optional(),
  discount_rate: z.number().min(0).max(0.3).optional(),
});

export type DataCenterFormData = z.infer<typeof dataCenterSchema>;
export type CarbonCreditFormData = z.infer<typeof carbonCreditSchema>;
export type HeatSinkFormData = z.infer<typeof heatSinkSchema>;
export type CalculatePredictionFormData = z.infer<typeof calculatePredictionSchema>;
