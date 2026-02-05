-- +goose Up
-- Migration: Feasibility Assessments for Entropy V1
-- Purpose: Capture structured intake (assumptions, not data) with range-based fields

CREATE TABLE IF NOT EXISTS feasibility_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version INTEGER NOT NULL DEFAULT 1,
    project_name TEXT NOT NULL,
    
    -- Data Center Side (Heat Source)
    dc_location_lat REAL NOT NULL CHECK (dc_location_lat >= -90 AND dc_location_lat <= 90),
    dc_location_lng REAL NOT NULL CHECK (dc_location_lng >= -180 AND dc_location_lng <= 180),
    thermal_load_min_kw REAL NOT NULL CHECK (thermal_load_min_kw >= 0),
    thermal_load_max_kw REAL NOT NULL CHECK (thermal_load_max_kw >= thermal_load_min_kw),
    availability_profile TEXT NOT NULL DEFAULT 'base' CHECK (availability_profile IN ('base', 'peak')),
    uptime_constraint TEXT NOT NULL DEFAULT '99.9' CHECK (uptime_constraint IN ('99', '99.9', '99.99', '99.999')),
    existing_cooling INTEGER NOT NULL DEFAULT 0 CHECK (existing_cooling IN (0, 1)),
    investment_willingness TEXT NOT NULL DEFAULT 'medium' CHECK (investment_willingness IN ('low', 'medium', 'high')),
    
    -- Utility / Off-taker Side (Heat Sink)
    distance_to_offtaker_km REAL NOT NULL CHECK (distance_to_offtaker_km >= 0),
    heat_demand_profile TEXT NOT NULL DEFAULT 'constant' CHECK (heat_demand_profile IN ('constant', 'seasonal_winter', 'seasonal_summer')),
    supply_temp_required_c REAL NOT NULL DEFAULT 60.0 CHECK (supply_temp_required_c >= 20 AND supply_temp_required_c <= 150),
    existing_dh_infra INTEGER NOT NULL DEFAULT 0 CHECK (existing_dh_infra IN (0, 1)),
    
    -- Context
    jurisdiction TEXT NOT NULL DEFAULT 'EU' CHECK (jurisdiction IN ('EU', 'DE', 'NL', 'BE', 'FR', 'UK', 'OTHER')),
    applicable_regulation TEXT NOT NULL DEFAULT 'EED' CHECK (applicable_regulation IN ('EED', 'EnEfG', 'local', 'none')),
    time_horizon_years INTEGER NOT NULL DEFAULT 15 CHECK (time_horizon_years >= 5 AND time_horizon_years <= 30),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed', 'archived')),
    
    -- Computed Results (stored as JSON for flexibility)
    scenario_results TEXT,  -- JSON array of ScenarioResult objects
    compliance_result TEXT, -- JSON object with compliance determination
    conclusion TEXT,        -- Final summary text
    
    -- Audit Trail
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    submitted_at TEXT,
    completed_at TEXT
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_assessments_status ON feasibility_assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_jurisdiction ON feasibility_assessments(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON feasibility_assessments(created_at);
