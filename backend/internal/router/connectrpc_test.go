package router

import (
	"context"
	"database/sql"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	_ "github.com/mattn/go-sqlite3"
	db "github.com/pyrecycleheat/backend/internal/database"
)

// setupTestDB creates an in-memory SQLite database for testing.
func setupTestDB(t *testing.T) (*sql.DB, *db.Queries) {
	t.Helper()
	sqlDB, err := sql.Open("sqlite3", ":memory:?_foreign_keys=on")
	if err != nil {
		t.Fatalf("open test db: %v", err)
	}

	// Load minimal schema for testing
	schema := `
	CREATE TABLE heat_centers (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		location_lat REAL NOT NULL,
		location_lng REAL NOT NULL,
		address TEXT,
		max_capacity_mw REAL NOT NULL,
		current_output_mw REAL,
		efficiency_percent REAL,
		fuel_type TEXT,
		is_active INTEGER,
		commissioning_date TEXT,
		last_maintenance TEXT,
		description TEXT,
		created_at TEXT DEFAULT (datetime('now')),
		updated_at TEXT
	);
	CREATE TABLE demand_sites (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		location_lat REAL NOT NULL,
		location_lng REAL NOT NULL,
		address TEXT,
		site_type TEXT,
		peak_demand_mw REAL NOT NULL,
		current_demand_mw REAL,
		annual_consumption_mwh REAL,
		is_connected INTEGER,
		connection_date TEXT,
		priority_level INTEGER,
		floor_area_sqm REAL,
		building_age_years INTEGER,
		insulation_rating TEXT,
		description TEXT,
		created_at TEXT DEFAULT (datetime('now')),
		updated_at TEXT
	);
	CREATE TABLE routes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		heat_center_id INTEGER NOT NULL,
		demand_site_id INTEGER NOT NULL,
		distance_km REAL NOT NULL,
		pipe_diameter_mm INTEGER,
		max_flow_capacity_mw REAL NOT NULL,
		current_flow_mw REAL,
		supply_temp_celsius REAL,
		return_temp_celsius REAL,
		pressure_bar REAL,
		heat_loss_percent REAL,
		installation_year INTEGER,
		pipe_material TEXT,
		insulation_type TEXT,
		status TEXT,
		is_bidirectional INTEGER,
		maintenance_due TEXT,
		construction_cost REAL,
		annual_maintenance_cost REAL,
		created_at TEXT DEFAULT (datetime('now')),
		updated_at TEXT
	);
	CREATE TABLE data_centers (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		location_lat REAL NOT NULL,
		location_lng REAL NOT NULL,
		address TEXT,
		dc_type TEXT,
		total_it_load_kw REAL NOT NULL,
		pue REAL,
		utilization_percent REAL,
		cooling_type TEXT,
		energy_source TEXT,
		renewable_percent REAL,
		electricity_cost_kwh REAL,
		operating_hours_year INTEGER,
		heat_recovery_enabled INTEGER,
		created_at TEXT DEFAULT (datetime('now'))
	);
	CREATE TABLE carbon_credits (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_name TEXT NOT NULL,
		credit_type TEXT,
		price_per_ton REAL NOT NULL,
		available_tons REAL NOT NULL,
		vintage_year INTEGER,
		verification_standard TEXT,
		location TEXT,
		project_description TEXT,
		created_at TEXT DEFAULT (datetime('now'))
	);
	CREATE TABLE heat_sinks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		location_lat REAL NOT NULL,
		location_lng REAL NOT NULL,
		address TEXT,
		sink_type TEXT,
		capacity_mw REAL NOT NULL,
		current_demand_mw REAL,
		temperature_requirement_c REAL,
		seasonal_factor REAL,
		connection_cost_per_km REAL,
		heat_price_per_mwh REAL,
		operating_hours_year INTEGER,
		created_at TEXT DEFAULT (datetime('now'))
	);
	CREATE TABLE prediction_results (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		data_center_id INTEGER NOT NULL,
		carbon_credit_id INTEGER,
		heat_sink_id INTEGER,
		scenario_name TEXT,
		analysis_years INTEGER,
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
		created_at TEXT DEFAULT (datetime('now'))
	);
	`
	if _, err := sqlDB.Exec(schema); err != nil {
		t.Fatalf("create schema: %v", err)
	}

	queries, err := db.Prepare(context.Background(), sqlDB)
	if err != nil {
		t.Fatalf("prepare queries: %v", err)
	}

	return sqlDB, queries
}

func TestConnectRPC_ListHeatCenters(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()
	defer queries.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	mux := NewConnectMux(sqlDB, queries, logger)

	srv := httptest.NewServer(mux)
	defer srv.Close()

	// Test ListHeatCenters
	body := `{"pagination":{"page":1,"page_size":10}}`
	req, _ := http.NewRequest("POST", srv.URL+"/pyrecycleheat.v1.DistrictHeatingService/ListHeatCenters", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestConnectRPC_Health(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()
	defer queries.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	mux := NewConnectMux(sqlDB, queries, logger)

	srv := httptest.NewServer(mux)
	defer srv.Close()

	// Test gRPC health check
	body := `{"service":""}`
	req, _ := http.NewRequest("POST", srv.URL+"/grpc.health.v1.Health/Check", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}
