/**
 * API Service Layer for District Heating System
 * Handles all communication with the FastAPI backend
 */

// Get API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types matching backend Pydantic models
export interface HeatCenter {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  address?: string;
  max_capacity_mw: number;
  current_output_mw?: number;
  efficiency_percent?: number;
  fuel_type?: string;
  is_active?: boolean;
  commissioning_date?: string;
  last_maintenance?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface DemandSite {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  address?: string;
  site_type?: string;
  peak_demand_mw: number;
  current_demand_mw?: number;
  annual_consumption_mwh?: number;
  is_connected?: boolean;
  connection_date?: string;
  priority_level?: number;
  floor_area_sqm?: number;
  building_age_years?: number;
  insulation_rating?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Route {
  id: number;
  heat_center_id: number;
  demand_site_id: number;
  distance_km: number;
  pipe_diameter_mm?: number;
  max_flow_capacity_mw: number;
  current_flow_mw?: number;
  supply_temp_celsius?: number;
  return_temp_celsius?: number;
  pressure_bar?: number;
  heat_loss_percent?: number;
  installation_year?: number;
  pipe_material?: string;
  insulation_type?: string;
  status?: 'ACTIVE' | 'MAINTENANCE' | 'PLANNED' | 'DECOMMISSIONED';
  is_bidirectional?: boolean;
  maintenance_due?: string;
  construction_cost?: number;
  annual_maintenance_cost?: number;
  created_at: string;
  updated_at?: string;
}

export interface SystemAnalytics {
  total_heat_centers: number;
  total_demand_sites: number;
  total_routes: number;
  active_heat_centers: number;
  connected_demand_sites: number;
  active_routes: number;
  system_capacity: {
    total_capacity_mw: number;
    current_output_mw: number;
    utilization_percent: number;
  };
  demand_overview: {
    total_peak_demand_mw: number;
    current_demand_mw: number;
    demand_satisfaction_percent: number;
  };
  efficiency_metrics: {
    average_efficiency_percent: number;
    total_heat_loss_percent: number;
    network_efficiency_percent: number;
  };
}

export interface DataCenter {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  address?: string;
  dc_type?: string;
  total_it_load_kw?: number;
  pue?: number;
  cooling_type?: string;
  energy_source?: string;
  floor_area_sqm?: number;
  rack_count?: number;
  server_count?: number;
  storage_capacity_tb?: number;
  utilization_percent?: number;
  operating_hours_year?: number;
  ambient_temp_celsius?: number;
  electricity_cost_kwh?: number;
  cooling_cost_kwh?: number;
  maintenance_cost_annual?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HeatCenterAnalytics {
  center_id: number;
  center_name: string;
  current_metrics: {
    output_mw: number;
    efficiency_percent: number;
    capacity_utilization_percent: number;
  };
  connected_sites: Array<{
    site_id: number;
    site_name: string;
    demand_mw: number;
    distance_km: number;
  }>;
}

// API Error handling
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Heat Centers API
export const heatCenterService = {
  async getAll(params?: { skip?: number; limit?: number; active_only?: boolean }): Promise<HeatCenter[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.active_only !== undefined) searchParams.set('active_only', params.active_only.toString());
    
    const query = searchParams.toString();
    return apiRequest<HeatCenter[]>(`/heat-centers${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<HeatCenter> {
    return apiRequest<HeatCenter>(`/heat-centers/${id}`);
  },

  async getAnalytics(id: number): Promise<HeatCenterAnalytics> {
    return apiRequest<HeatCenterAnalytics>(`/analytics/heat-center/${id}`);
  },
};

// Demand Sites API
export const demandSiteService = {
  async getAll(params?: { 
    skip?: number; 
    limit?: number; 
    connected_only?: boolean; 
    site_type?: string; 
  }): Promise<DemandSite[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.connected_only !== undefined) searchParams.set('connected_only', params.connected_only.toString());
    if (params?.site_type) searchParams.set('site_type', params.site_type);
    
    const query = searchParams.toString();
    return apiRequest<DemandSite[]>(`/demand-sites${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<DemandSite> {
    return apiRequest<DemandSite>(`/demand-sites/${id}`);
  },
};

// Data Centers API
export const dataCenterService = {
  async getAll(params?: { skip?: number; limit?: number }): Promise<DataCenter[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest<DataCenter[]>(`/api/v1/predictions/data-centers${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<DataCenter> {
    return apiRequest<DataCenter>(`/api/v1/predictions/data-centers/${id}`);
  },
};

// Routes API
export const routeService = {
  async getAll(params?: { 
    skip?: number; 
    limit?: number; 
    status?: string;
    heat_center_id?: number;
    demand_site_id?: number;
  }): Promise<Route[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.heat_center_id !== undefined) searchParams.set('heat_center_id', params.heat_center_id.toString());
    if (params?.demand_site_id !== undefined) searchParams.set('demand_site_id', params.demand_site_id.toString());
    
    const query = searchParams.toString();
    return apiRequest<Route[]>(`/routes${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<Route> {
    return apiRequest<Route>(`/routes/${id}`);
  },
};

// Analytics API
export const analyticsService = {
  async getOverview(): Promise<SystemAnalytics> {
    return apiRequest<SystemAnalytics>('/analytics/overview');
  },
};

// Health Check
export const healthService = {
  async check(): Promise<{ status: string; timestamp: string }> {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },
};

// Export all services
export const api = {
  heatCenters: heatCenterService,
  demandSites: demandSiteService,
  dataCenters: dataCenterService,
  routes: routeService,
  analytics: analyticsService,
  health: healthService,
};