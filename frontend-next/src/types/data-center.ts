export interface Location {
  latitude: number;
  longitude: number;
}

export interface DataCenter {
  id: number;
  name: string;
  location: Location;
  address?: string;
  dc_type?: string;
  total_it_load_kw: number;
  pue?: number;
  utilization_percent?: number;
  cooling_type?: string;
  energy_source?: string;
  renewable_percent?: number;
  electricity_cost_kwh?: number;
  operating_hours_year?: number;
  heat_recovery_enabled?: boolean;
  created_at?: string;
}

export interface CreateDataCenterInput {
  name: string;
  location: Location;
  address?: string;
  dc_type?: string;
  total_it_load_kw: number;
  pue?: number;
  utilization_percent?: number;
  cooling_type?: string;
  energy_source?: string;
  renewable_percent?: number;
  electricity_cost_kwh?: number;
  operating_hours_year?: number;
  heat_recovery_enabled?: boolean;
}

export interface UpdateDataCenterInput extends Partial<CreateDataCenterInput> {
  id: number;
}
