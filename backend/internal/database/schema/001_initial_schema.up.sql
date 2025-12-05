PRAGMA foreign_keys = ON;

-- District Heating Tables

CREATE TABLE IF NOT EXISTS heat_centers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location_lat REAL NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
    location_lng REAL NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
    address TEXT,
    max_capacity_mw REAL NOT NULL CHECK (max_capacity_mw > 0),
    current_output_mw REAL DEFAULT 0.0 CHECK (current_output_mw >= 0),
    efficiency_percent REAL DEFAULT 85.0 CHECK (efficiency_percent >= 0 AND efficiency_percent <= 100),
    fuel_type TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    commissioning_date TEXT,
    last_maintenance TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS demand_sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location_lat REAL NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
    location_lng REAL NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
    address TEXT,
    site_type TEXT,
    peak_demand_mw REAL NOT NULL CHECK (peak_demand_mw > 0),
    current_demand_mw REAL DEFAULT 0.0 CHECK (current_demand_mw >= 0),
    annual_consumption_mwh REAL CHECK (annual_consumption_mwh >= 0),
    is_connected INTEGER DEFAULT 0 CHECK (is_connected IN (0, 1)),
    connection_date TEXT,
    priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
    floor_area_sqm REAL CHECK (floor_area_sqm >= 0),
    building_age_years INTEGER CHECK (building_age_years >= 0),
    insulation_rating TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heat_center_id INTEGER NOT NULL,
    demand_site_id INTEGER NOT NULL,
    distance_km REAL NOT NULL CHECK (distance_km > 0),
    pipe_diameter_mm INTEGER CHECK (pipe_diameter_mm > 0),
    max_flow_capacity_mw REAL NOT NULL CHECK (max_flow_capacity_mw > 0),
    current_flow_mw REAL DEFAULT 0.0 CHECK (current_flow_mw >= 0),
    supply_temp_celsius REAL DEFAULT 80.0 CHECK (supply_temp_celsius >= 0 AND supply_temp_celsius <= 200),
    return_temp_celsius REAL DEFAULT 40.0 CHECK (return_temp_celsius >= 0 AND return_temp_celsius <= 200),
    pressure_bar REAL DEFAULT 16.0 CHECK (pressure_bar >= 0),
    heat_loss_percent REAL DEFAULT 2.0 CHECK (heat_loss_percent >= 0 AND heat_loss_percent <= 100),
    installation_year INTEGER CHECK (installation_year >= 1900 AND installation_year <= 2100),
    pipe_material TEXT,
    insulation_type TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'PLANNED')),
    is_bidirectional INTEGER DEFAULT 0 CHECK (is_bidirectional IN (0, 1)),
    maintenance_due TEXT,
    construction_cost REAL CHECK (construction_cost >= 0),
    annual_maintenance_cost REAL CHECK (annual_maintenance_cost >= 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    FOREIGN KEY (heat_center_id) REFERENCES heat_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (demand_site_id) REFERENCES demand_sites(id) ON DELETE CASCADE,
    UNIQUE (heat_center_id, demand_site_id)
);

CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    config_type TEXT DEFAULT 'string' CHECK (config_type IN ('string', 'int', 'float', 'bool', 'json')),
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS heat_center_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heat_center_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    output_mw REAL NOT NULL,
    efficiency_percent REAL,
    fuel_consumption REAL,
    operational_cost_hour REAL,
    co2_emissions_kg_hour REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (heat_center_id) REFERENCES heat_centers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS demand_site_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    demand_site_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    demand_mw REAL NOT NULL,
    supply_temp_celsius REAL,
    return_temp_celsius REAL,
    flow_rate_m3_hour REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (demand_site_id) REFERENCES demand_sites(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS route_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    flow_mw REAL NOT NULL,
    supply_temp_celsius REAL,
    return_temp_celsius REAL,
    pressure_bar REAL,
    heat_loss_mw REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- Prediction Tables

CREATE TABLE IF NOT EXISTS data_centers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location_lat REAL NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
    location_lng REAL NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
    address TEXT,
    dc_type TEXT DEFAULT 'colocation',
    total_it_load_kw REAL NOT NULL CHECK (total_it_load_kw > 0),
    pue REAL DEFAULT 1.5 CHECK (pue >= 1.0 AND pue <= 3.0),
    utilization_percent REAL DEFAULT 70.0 CHECK (utilization_percent >= 0 AND utilization_percent <= 100),
    cooling_type TEXT DEFAULT 'air',
    energy_source TEXT DEFAULT 'grid',
    renewable_percent REAL DEFAULT 0.0 CHECK (renewable_percent >= 0 AND renewable_percent <= 100),
    electricity_cost_kwh REAL DEFAULT 0.15 CHECK (electricity_cost_kwh >= 0),
    operating_hours_year INTEGER DEFAULT 8760 CHECK (operating_hours_year >= 1 AND operating_hours_year <= 8760),
    heat_recovery_enabled INTEGER DEFAULT 0 CHECK (heat_recovery_enabled IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS carbon_credits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    credit_type TEXT DEFAULT 'renewable_energy',
    price_per_ton REAL NOT NULL CHECK (price_per_ton > 0),
    available_tons REAL NOT NULL CHECK (available_tons > 0),
    vintage_year INTEGER CHECK (vintage_year >= 2000 AND vintage_year <= 2100),
    verification_standard TEXT DEFAULT 'VCS',
    location TEXT,
    project_description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS heat_sinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location_lat REAL NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
    location_lng REAL NOT NULL CHECK (location_lng >= -180 AND location_lng <= 180),
    address TEXT,
    sink_type TEXT DEFAULT 'district_heating',
    capacity_mw REAL NOT NULL CHECK (capacity_mw > 0),
    current_demand_mw REAL DEFAULT 0.0 CHECK (current_demand_mw >= 0),
    temperature_requirement_c REAL DEFAULT 60.0 CHECK (temperature_requirement_c >= 0 AND temperature_requirement_c <= 200),
    seasonal_factor REAL DEFAULT 1.0 CHECK (seasonal_factor >= 0 AND seasonal_factor <= 10),
    connection_cost_per_km REAL DEFAULT 100000.0 CHECK (connection_cost_per_km >= 0),
    heat_price_per_mwh REAL DEFAULT 50.0 CHECK (heat_price_per_mwh >= 0),
    operating_hours_year INTEGER DEFAULT 8760 CHECK (operating_hours_year >= 1 AND operating_hours_year <= 8760),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS prediction_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_center_id INTEGER NOT NULL,
    carbon_credit_id INTEGER,
    heat_sink_id INTEGER,
    scenario_name TEXT DEFAULT 'base_case',
    analysis_years INTEGER DEFAULT 10 CHECK (analysis_years >= 1 AND analysis_years <= 30),
    total_capex REAL,
    annual_opex REAL,
    annual_savings REAL,
    net_present_value REAL,
    internal_rate_return REAL,
    payback_period_years REAL,
    investment_grade TEXT,
    annual_co2_reduction_kg REAL,
    annual_heat_recovery_kwh REAL,
    detailed_results TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (data_center_id) REFERENCES data_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (carbon_credit_id) REFERENCES carbon_credits(id) ON DELETE SET NULL,
    FOREIGN KEY (heat_sink_id) REFERENCES heat_sinks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prediction_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    base_parameters TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);


