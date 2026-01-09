import { Location } from "./data-center";

export interface HeatSink {
  id: number;
  name: string;
  location: Location;
  address?: string;
  sink_type?: string;
  capacity_mw: number;
  current_demand_mw?: number;
  temperature_requirement_c?: number;
  seasonal_factor?: number;
  connection_cost_per_km?: number;
  heat_price_per_mwh?: number;
  operating_hours_year?: number;
  created_at?: string;
}

export interface CreateHeatSinkInput {
  name: string;
  location: Location;
  address?: string;
  sink_type?: string;
  capacity_mw: number;
  current_demand_mw?: number;
  temperature_requirement_c?: number;
  seasonal_factor?: number;
  connection_cost_per_km?: number;
  heat_price_per_mwh?: number;
  operating_hours_year?: number;
}
