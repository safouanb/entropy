CREATE INDEX IF NOT EXISTS idx_heat_centers_name ON heat_centers(name);
CREATE INDEX IF NOT EXISTS idx_heat_centers_location ON heat_centers(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_heat_centers_active ON heat_centers(is_active);

CREATE INDEX IF NOT EXISTS idx_demand_sites_name ON demand_sites(name);
CREATE INDEX IF NOT EXISTS idx_demand_sites_location ON demand_sites(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_demand_sites_type ON demand_sites(site_type);
CREATE INDEX IF NOT EXISTS idx_demand_sites_connected ON demand_sites(is_connected);

CREATE INDEX IF NOT EXISTS idx_routes_heat_center ON routes(heat_center_id);
CREATE INDEX IF NOT EXISTS idx_routes_demand_site ON routes(demand_site_id);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);

CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);

CREATE INDEX IF NOT EXISTS idx_hc_metrics_center_time ON heat_center_metrics(heat_center_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ds_metrics_site_time ON demand_site_metrics(demand_site_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_route_metrics_route_time ON route_metrics(route_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_data_centers_location ON data_centers(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_heat_sinks_location ON heat_sinks(location_lat, location_lng);

CREATE INDEX IF NOT EXISTS idx_prediction_results_dc ON prediction_results(data_center_id);
CREATE INDEX IF NOT EXISTS idx_prediction_results_scenario ON prediction_results(scenario_name);
CREATE INDEX IF NOT EXISTS idx_prediction_results_created ON prediction_results(created_at DESC);


