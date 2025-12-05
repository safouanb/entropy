/**
 * TypeScript type definitions for the District Heating System
 * These types match the backend Pydantic models and extend them for frontend use
 */

// Base types from backend API
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
  status?: RouteStatus;
  is_bidirectional?: boolean;
  maintenance_due?: string;
  construction_cost?: number;
  annual_maintenance_cost?: number;
  created_at: string;
  updated_at?: string;
}

export type RouteStatus = 'ACTIVE' | 'MAINTENANCE' | 'PLANNED' | 'DECOMMISSIONED';

// Extended types for frontend use
export interface MapMarker {
  id: number;
  type: 'heat_center' | 'demand_site' | 'data_center';
  name: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance' | 'connected' | 'disconnected';
  data: HeatCenter | DemandSite | DataCenter;
}

export interface RouteVisualization extends Route {
  coordinates: [number, number][];
  heatCenter: HeatCenter;
  demandSite: DemandSite;
  flowDirection: 'forward' | 'reverse' | 'bidirectional';
  animationSpeed: number;
}

// Legacy DataCenter type for backward compatibility during migration
export interface DataCenter {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  provider: string;
  capacity: string;
  established: string;
  website: string;
  address: string;
}

// Analytics types
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

// UI State types
export interface MapState {
  center: [number, number];
  zoom: number;
  is3D: boolean;
  selectedMarker: MapMarker | null;
  visibleLayers: {
    heatCenters: boolean;
    demandSites: boolean;
    routes: boolean;
  };
  filters: {
    fuelType?: string;
    siteType?: string;
    connectionStatus?: 'all' | 'connected' | 'disconnected';
    routeStatus?: RouteStatus;
  };
}

export interface SearchState {
  query: string;
  results: MapMarker[];
  isSearching: boolean;
}

// Component Props types
export interface MarkerPopupProps {
  marker: MapMarker;
  onClose: () => void;
}

export interface RoutePopupProps {
  route: RouteVisualization;
  onClose: () => void;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Utility types
export type MarkerType = 'heat_center' | 'demand_site';
export type ViewMode = '2d' | '3d';
export type FilterKey = keyof MapState['filters'];

// Constants
export const MARKER_COLORS = {
  heat_center: {
    active: '#ef4444',      // red-500
    inactive: '#94a3b8',    // slate-400
    maintenance: '#f59e0b', // amber-500
  },
  demand_site: {
    connected: '#3b82f6',    // blue-500
    disconnected: '#6b7280', // gray-500
    priority_high: '#dc2626', // red-600
    priority_medium: '#f59e0b', // amber-500
    priority_low: '#10b981',  // emerald-500
  },
} as const;

export const ROUTE_COLORS = {
  ACTIVE: '#22c55e',        // green-500
  MAINTENANCE: '#f59e0b',   // amber-500
  PLANNED: '#8b5cf6',       // violet-500
  DECOMMISSIONED: '#6b7280', // gray-500
} as const;

export const FUEL_TYPES = [
  'Natural Gas',
  'Biomass',
  'Geothermal',
  'Solar Thermal',
  'Electric',
  'Waste Heat',
  'Coal',
  'Oil',
] as const;

export const SITE_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Healthcare',
  'Educational',
  'Hotel',
  'Government',
  'Mixed Use',
] as const;

export type FuelType = typeof FUEL_TYPES[number];
export type SiteType = typeof SITE_TYPES[number];