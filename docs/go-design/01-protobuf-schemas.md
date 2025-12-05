# Protocol Buffer Schema Design

## Overview

This document defines all Protocol Buffer schemas for the PyRecycle Heat Go backend. These schemas will be used for:

1. **ConnectRPC Services** - RPC method definitions
2. **REST API Compatibility** - JSON serialization via protojson
3. **Frontend TypeScript Generation** - Using `@bufbuild/protobuf`
4. **Database Models** - Mapping to sqlc queries

**Proto Version:** `proto3`  
**Package:** `pyrecycleheat.v1`  
**Go Package:** `github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1`

---

## Directory Structure

```
shared/
└── proto/
    └── pyrecycleheat/
        └── v1/
            ├── district_heating.proto        # HeatCenter, DemandSite, Route entities
            ├── district_heating_service.proto # DistrictHeatingService RPC
            ├── prediction.proto              # DataCenter, CarbonCredit, HeatSink entities
            ├── prediction_service.proto      # PredictionService RPC
            ├── common.proto                  # Shared types (timestamps, etc.)
            └── buf.yaml                      # buf configuration
```

---

## Common Types (common.proto)

```protobuf
syntax = "proto3";

package pyrecycleheat.v1;

option go_package = "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1;pyrecycleheatv1";

import "google/protobuf/timestamp.proto";
import "google/protobuf/empty.proto";

// Location represents geographic coordinates
message Location {
  // Latitude in decimal degrees (-90 to +90)
  double latitude = 1 [(buf.validate.field).double = {gte: -90, lte: 90}];
  
  // Longitude in decimal degrees (-180 to +180)
  double longitude = 2 [(buf.validate.field).double = {gte: -180, lte: 180}];
}

// Pagination request
message PaginationRequest {
  // Page number (1-indexed)
  int32 page = 1 [(buf.validate.field).int32 = {gte: 1}];
  
  // Page size (default: 50, max: 200)
  int32 page_size = 2 [(buf.validate.field).int32 = {gte: 1, lte: 200}];
}

// Pagination response metadata
message PaginationMetadata {
  // Current page number
  int32 page = 1;
  
  // Page size
  int32 page_size = 2;
  
  // Total number of items
  int64 total_count = 3;
  
  // Total number of pages
  int32 total_pages = 4;
  
  // Whether there is a next page
  bool has_next = 5;
  
  // Whether there is a previous page
  bool has_previous = 6;
}
```

---

## District Heating Entities (district_heating.proto)

```protobuf
syntax = "proto3";

package pyrecycleheat.v1;

option go_package = "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1;pyrecycleheatv1";

import "google/protobuf/timestamp.proto";
import "pyrecycleheat/v1/common.proto";
import "buf/validate/validate.proto";

// RouteStatus enumeration
enum RouteStatus {
  ROUTE_STATUS_UNSPECIFIED = 0;
  ROUTE_STATUS_ACTIVE = 1;
  ROUTE_STATUS_INACTIVE = 2;
  ROUTE_STATUS_MAINTENANCE = 3;
  ROUTE_STATUS_PLANNED = 4;
}

// HeatCenter represents a district heating supply facility
message HeatCenter {
  // Unique identifier
  int64 id = 1;
  
  // Heat center name
  string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  
  // Geographic location
  Location location = 3 [(buf.validate.field).required = true];
  
  // Physical address
  string address = 4 [(buf.validate.field).string.max_len = 500];
  
  // Maximum heat capacity in megawatts
  double max_capacity_mw = 5 [(buf.validate.field).double.gt = 0];
  
  // Current heat output in megawatts
  double current_output_mw = 6 [(buf.validate.field).double.gte = 0];
  
  // Heat generation efficiency percentage (0-100)
  double efficiency_percent = 7 [(buf.validate.field).double = {gte: 0, lte: 100}];
  
  // Primary fuel source
  string fuel_type = 8 [(buf.validate.field).string.max_len = 100];
  
  // Operational status
  bool is_active = 9;
  
  // Date facility went online
  google.protobuf.Timestamp commissioning_date = 10;
  
  // Last maintenance date
  google.protobuf.Timestamp last_maintenance = 11;
  
  // Additional notes
  string description = 12;
  
  // Record creation timestamp
  google.protobuf.Timestamp created_at = 13;
  
  // Last update timestamp
  google.protobuf.Timestamp updated_at = 14;
}

// CreateHeatCenterRequest for creating a new heat center
message CreateHeatCenterRequest {
  string name = 1 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 2 [(buf.validate.field).required = true];
  string address = 3 [(buf.validate.field).string.max_len = 500];
  double max_capacity_mw = 4 [(buf.validate.field).double.gt = 0];
  double current_output_mw = 5 [(buf.validate.field).double.gte = 0];
  double efficiency_percent = 6 [(buf.validate.field).double = {gte: 0, lte: 100}];
  string fuel_type = 7 [(buf.validate.field).string.max_len = 100];
  bool is_active = 8;
  google.protobuf.Timestamp commissioning_date = 9;
  google.protobuf.Timestamp last_maintenance = 10;
  string description = 11;
}

// UpdateHeatCenterRequest for updating an existing heat center
message UpdateHeatCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  
  // Use google.protobuf.DoubleValue for optional fields
  optional string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  optional Location location = 3;
  optional string address = 4 [(buf.validate.field).string.max_len = 500];
  optional double max_capacity_mw = 5 [(buf.validate.field).double.gt = 0];
  optional double current_output_mw = 6 [(buf.validate.field).double.gte = 0];
  optional double efficiency_percent = 7 [(buf.validate.field).double = {gte: 0, lte: 100}];
  optional string fuel_type = 8 [(buf.validate.field).string.max_len = 100];
  optional bool is_active = 9;
  optional google.protobuf.Timestamp commissioning_date = 10;
  optional google.protobuf.Timestamp last_maintenance = 11;
  optional string description = 12;
}

// DemandSite represents a heat consumption facility
message DemandSite {
  int64 id = 1;
  string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 3 [(buf.validate.field).required = true];
  string address = 4 [(buf.validate.field).string.max_len = 500];
  string site_type = 5 [(buf.validate.field).string.max_len = 100];
  double peak_demand_mw = 6 [(buf.validate.field).double.gt = 0];
  double current_demand_mw = 7 [(buf.validate.field).double.gte = 0];
  double annual_consumption_mwh = 8 [(buf.validate.field).double.gte = 0];
  bool is_connected = 9;
  google.protobuf.Timestamp connection_date = 10;
  int32 priority_level = 11 [(buf.validate.field).int32 = {gte: 1, lte: 5}];
  double floor_area_sqm = 12 [(buf.validate.field).double.gte = 0];
  int32 building_age_years = 13 [(buf.validate.field).int32.gte = 0];
  string insulation_rating = 14 [(buf.validate.field).string.max_len = 10];
  string description = 15;
  google.protobuf.Timestamp created_at = 16;
  google.protobuf.Timestamp updated_at = 17;
}

// CreateDemandSiteRequest
message CreateDemandSiteRequest {
  string name = 1 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 2 [(buf.validate.field).required = true];
  string address = 3;
  string site_type = 4;
  double peak_demand_mw = 5 [(buf.validate.field).double.gt = 0];
  double current_demand_mw = 6;
  double annual_consumption_mwh = 7;
  bool is_connected = 8;
  google.protobuf.Timestamp connection_date = 9;
  int32 priority_level = 10 [(buf.validate.field).int32 = {gte: 1, lte: 5}];
  double floor_area_sqm = 11;
  int32 building_age_years = 12;
  string insulation_rating = 13;
  string description = 14;
}

// UpdateDemandSiteRequest
message UpdateDemandSiteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  optional string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  optional Location location = 3;
  optional string address = 4;
  optional string site_type = 5;
  optional double peak_demand_mw = 6 [(buf.validate.field).double.gt = 0];
  optional double current_demand_mw = 7;
  optional double annual_consumption_mwh = 8;
  optional bool is_connected = 9;
  optional google.protobuf.Timestamp connection_date = 10;
  optional int32 priority_level = 11 [(buf.validate.field).int32 = {gte: 1, lte: 5}];
  optional double floor_area_sqm = 12;
  optional int32 building_age_years = 13;
  optional string insulation_rating = 14;
  optional string description = 15;
}

// Route represents a distribution network connection
message Route {
  int64 id = 1;
  int64 heat_center_id = 2 [(buf.validate.field).int64.gt = 0];
  int64 demand_site_id = 3 [(buf.validate.field).int64.gt = 0];
  double distance_km = 4 [(buf.validate.field).double.gt = 0];
  int32 pipe_diameter_mm = 5 [(buf.validate.field).int32.gt = 0];
  double max_flow_capacity_mw = 6 [(buf.validate.field).double.gt = 0];
  double current_flow_mw = 7 [(buf.validate.field).double.gte = 0];
  double supply_temp_celsius = 8 [(buf.validate.field).double = {gte: 0, lte: 200}];
  double return_temp_celsius = 9 [(buf.validate.field).double = {gte: 0, lte: 200}];
  double pressure_bar = 10 [(buf.validate.field).double.gte = 0];
  double heat_loss_percent = 11 [(buf.validate.field).double = {gte: 0, lte: 100}];
  int32 installation_year = 12 [(buf.validate.field).int32 = {gte: 1900, lte: 2100}];
  string pipe_material = 13 [(buf.validate.field).string.max_len = 100];
  string insulation_type = 14 [(buf.validate.field).string.max_len = 100];
  RouteStatus status = 15;
  bool is_bidirectional = 16;
  google.protobuf.Timestamp maintenance_due = 17;
  double construction_cost = 18 [(buf.validate.field).double.gte = 0];
  double annual_maintenance_cost = 19 [(buf.validate.field).double.gte = 0];
  google.protobuf.Timestamp created_at = 20;
  google.protobuf.Timestamp updated_at = 21;
}

// CreateRouteRequest
message CreateRouteRequest {
  int64 heat_center_id = 1 [(buf.validate.field).int64.gt = 0];
  int64 demand_site_id = 2 [(buf.validate.field).int64.gt = 0];
  double distance_km = 3 [(buf.validate.field).double.gt = 0];
  int32 pipe_diameter_mm = 4;
  double max_flow_capacity_mw = 5 [(buf.validate.field).double.gt = 0];
  double current_flow_mw = 6;
  double supply_temp_celsius = 7;
  double return_temp_celsius = 8;
  double pressure_bar = 9;
  double heat_loss_percent = 10;
  int32 installation_year = 11;
  string pipe_material = 12;
  string insulation_type = 13;
  RouteStatus status = 14;
  bool is_bidirectional = 15;
  google.protobuf.Timestamp maintenance_due = 16;
  double construction_cost = 17;
  double annual_maintenance_cost = 18;
}

// UpdateRouteRequest
message UpdateRouteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  optional int64 heat_center_id = 2 [(buf.validate.field).int64.gt = 0];
  optional int64 demand_site_id = 3 [(buf.validate.field).int64.gt = 0];
  optional double distance_km = 4 [(buf.validate.field).double.gt = 0];
  optional int32 pipe_diameter_mm = 5;
  optional double max_flow_capacity_mw = 6 [(buf.validate.field).double.gt = 0];
  optional double current_flow_mw = 7;
  optional double supply_temp_celsius = 8;
  optional double return_temp_celsius = 9;
  optional double pressure_bar = 10;
  optional double heat_loss_percent = 11;
  optional int32 installation_year = 12;
  optional string pipe_material = 13;
  optional string insulation_type = 14;
  optional RouteStatus status = 15;
  optional bool is_bidirectional = 16;
  optional google.protobuf.Timestamp maintenance_due = 17;
  optional double construction_cost = 18;
  optional double annual_maintenance_cost = 19;
}

// AnalyticsSummary for system-wide metrics
message AnalyticsSummary {
  int64 total_heat_centers = 1;
  int64 total_demand_sites = 2;
  int64 total_routes = 3;
  int64 active_heat_centers = 4;
  int64 connected_demand_sites = 5;
  double total_capacity_mw = 6;
  double total_current_output_mw = 7;
  double total_demand_mw = 8;
  double system_efficiency_percent = 9;
  int64 total_active_routes = 10;
}
```

---

## Prediction Entities (prediction.proto)

```protobuf
syntax = "proto3";

package pyrecycleheat.v1;

option go_package = "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1;pyrecycleheatv1";

import "google/protobuf/timestamp.proto";
import "pyrecycleheat/v1/common.proto";
import "buf/validate/validate.proto";

// DataCenter represents a data center facility for heat recovery
message DataCenter {
  int64 id = 1;
  string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 3 [(buf.validate.field).required = true];
  string address = 4;
  string dc_type = 5 [(buf.validate.field).string.max_len = 100];
  double total_it_load_kw = 6 [(buf.validate.field).double.gt = 0];
  double pue = 7 [(buf.validate.field).double = {gte: 1.0, lte: 3.0}];
  double utilization_percent = 8 [(buf.validate.field).double = {gte: 0, lte: 100}];
  string cooling_type = 9 [(buf.validate.field).string.max_len = 100];
  string energy_source = 10 [(buf.validate.field).string.max_len = 100];
  double renewable_percent = 11 [(buf.validate.field).double = {gte: 0, lte: 100}];
  double electricity_cost_kwh = 12 [(buf.validate.field).double.gte = 0];
  int32 operating_hours_year = 13 [(buf.validate.field).int32 = {gte: 1, lte: 8760}];
  bool heat_recovery_enabled = 14;
  google.protobuf.Timestamp created_at = 15;
}

// CreateDataCenterRequest
message CreateDataCenterRequest {
  string name = 1 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 2 [(buf.validate.field).required = true];
  string address = 3;
  string dc_type = 4;
  double total_it_load_kw = 5 [(buf.validate.field).double.gt = 0];
  double pue = 6 [(buf.validate.field).double = {gte: 1.0, lte: 3.0}];
  double utilization_percent = 7 [(buf.validate.field).double = {gte: 0, lte: 100}];
  string cooling_type = 8;
  string energy_source = 9;
  double renewable_percent = 10;
  double electricity_cost_kwh = 11;
  int32 operating_hours_year = 12 [(buf.validate.field).int32 = {gte: 1, lte: 8760}];
  bool heat_recovery_enabled = 13;
}

// UpdateDataCenterRequest
message UpdateDataCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  optional string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  optional Location location = 3;
  optional string address = 4;
  optional string dc_type = 5;
  optional double total_it_load_kw = 6 [(buf.validate.field).double.gt = 0];
  optional double pue = 7 [(buf.validate.field).double = {gte: 1.0, lte: 3.0}];
  optional double utilization_percent = 8 [(buf.validate.field).double = {gte: 0, lte: 100}];
  optional string cooling_type = 9;
  optional string energy_source = 10;
  optional double renewable_percent = 11;
  optional double electricity_cost_kwh = 12;
  optional int32 operating_hours_year = 13;
  optional bool heat_recovery_enabled = 14;
}

// CarbonCredit represents a carbon credit project
message CarbonCredit {
  int64 id = 1;
  string project_name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  string credit_type = 3 [(buf.validate.field).string.max_len = 100];
  double price_per_ton = 4 [(buf.validate.field).double.gt = 0];
  double available_tons = 5 [(buf.validate.field).double.gt = 0];
  int32 vintage_year = 6 [(buf.validate.field).int32 = {gte: 2000, lte: 2100}];
  string verification_standard = 7 [(buf.validate.field).string.max_len = 100];
  string location = 8;
  string project_description = 9;
  google.protobuf.Timestamp created_at = 10;
}

// CreateCarbonCreditRequest
message CreateCarbonCreditRequest {
  string project_name = 1 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  string credit_type = 2;
  double price_per_ton = 3 [(buf.validate.field).double.gt = 0];
  double available_tons = 4 [(buf.validate.field).double.gt = 0];
  int32 vintage_year = 5;
  string verification_standard = 6;
  string location = 7;
  string project_description = 8;
}

// UpdateCarbonCreditRequest
message UpdateCarbonCreditRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  optional string project_name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  optional string credit_type = 3;
  optional double price_per_ton = 4 [(buf.validate.field).double.gt = 0];
  optional double available_tons = 5 [(buf.validate.field).double.gt = 0];
  optional int32 vintage_year = 6;
  optional string verification_standard = 7;
  optional string location = 8;
  optional string project_description = 9;
}

// HeatSink represents a heat sink facility
message HeatSink {
  int64 id = 1;
  string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 3 [(buf.validate.field).required = true];
  string address = 4;
  string sink_type = 5 [(buf.validate.field).string.max_len = 100];
  double capacity_mw = 6 [(buf.validate.field).double.gt = 0];
  double current_demand_mw = 7 [(buf.validate.field).double.gte = 0];
  double temperature_requirement_c = 8 [(buf.validate.field).double = {gte: 0, lte: 200}];
  double seasonal_factor = 9 [(buf.validate.field).double = {gte: 0, lte: 10}];
  double connection_cost_per_km = 10 [(buf.validate.field).double.gte = 0];
  double heat_price_per_mwh = 11 [(buf.validate.field).double.gte = 0];
  int32 operating_hours_year = 12 [(buf.validate.field).int32 = {gte: 1, lte: 8760}];
  google.protobuf.Timestamp created_at = 13;
}

// CreateHeatSinkRequest
message CreateHeatSinkRequest {
  string name = 1 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  Location location = 2 [(buf.validate.field).required = true];
  string address = 3;
  string sink_type = 4;
  double capacity_mw = 5 [(buf.validate.field).double.gt = 0];
  double current_demand_mw = 6;
  double temperature_requirement_c = 7;
  double seasonal_factor = 8;
  double connection_cost_per_km = 9;
  double heat_price_per_mwh = 10;
  int32 operating_hours_year = 11;
}

// UpdateHeatSinkRequest
message UpdateHeatSinkRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
  optional string name = 2 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  optional Location location = 3;
  optional string address = 4;
  optional string sink_type = 5;
  optional double capacity_mw = 6 [(buf.validate.field).double.gt = 0];
  optional double current_demand_mw = 7;
  optional double temperature_requirement_c = 8;
  optional double seasonal_factor = 9;
  optional double connection_cost_per_km = 10;
  optional double heat_price_per_mwh = 11;
  optional int32 operating_hours_year = 12;
}

// PredictionResult represents saved prediction analysis
message PredictionResult {
  int64 id = 1;
  int64 data_center_id = 2;
  optional int64 carbon_credit_id = 3;
  optional int64 heat_sink_id = 4;
  string scenario_name = 5;
  int32 analysis_years = 6;
  double total_capex = 7;
  double annual_opex = 8;
  double annual_savings = 9;
  double net_present_value = 10;
  double internal_rate_return = 11;
  double payback_period_years = 12;
  string investment_grade = 13;
  double annual_co2_reduction_kg = 14;
  double annual_heat_recovery_kwh = 15;
  string detailed_results_json = 16; // Full JSON results
  google.protobuf.Timestamp created_at = 17;
}

// Nested prediction response messages
message EnergyMetrics {
  double effective_it_load_kw = 1;
  double total_power_kw = 2;
  double annual_energy_kwh = 3;
  double annual_energy_cost = 4;
  double waste_heat_kw = 5;
}

message HeatRecoveryMetrics {
  double waste_heat_available_kw = 1;
  double recoverable_heat_kw = 2;
  double annual_heat_recovery_kwh = 3;
  double equivalent_gas_therms = 4;
  double annual_gas_cost_savings = 5;
  double co2_avoided_kg_per_year = 6;
  double distance_efficiency_factor = 7;
}

message CarbonMetrics {
  double annual_co2_emissions_kg = 1;
  double annual_co2_reduction_kg = 2;
  double carbon_intensity_kg_kwh = 3;
  double renewable_offset_kg = 4;
  double net_annual_co2_kg = 5;
}

message CapexMetrics {
  double heat_exchanger_cost = 1;
  double distribution_infrastructure = 2;
  double controls_automation = 3;
  double contingency_reserve = 4;
  double total_project_capex = 5;
}

message OpexMetrics {
  double annual_maintenance_cost = 1;
  double annual_monitoring_cost = 2;
  double annual_utility_cost = 3;
  double total_annual_opex = 4;
}

message SavingsMetrics {
  double annual_heat_revenue = 1;
  double annual_carbon_credit_revenue = 2;
  double total_annual_revenue = 3;
  double net_annual_savings = 4;
}

message FinancialMetrics {
  double net_present_value = 1;
  double internal_rate_of_return = 2;
  double simple_payback_years = 3;
  double discounted_payback_years = 4;
  double benefit_cost_ratio = 5;
  double profitability_index = 6;
  string investment_grade = 7;
}

message SensitivityAnalysis {
  map<string, double> npv_sensitivity = 1;
  map<string, double> irr_sensitivity = 2;
  map<string, double> breakeven_analysis = 3;
}

message YearlyBreakdown {
  int32 year = 1;
  double cash_inflow = 2;
  double cash_outflow = 3;
  double net_cash_flow = 4;
  double cumulative_cash_flow = 5;
  double discounted_cash_flow = 6;
  double heat_recovery_kwh = 7;
  double co2_reduction_kg = 8;
}

message HeatSinkAllocation {
  int64 heat_sink_id = 1;
  string heat_sink_name = 2;
  double allocated_heat_kw = 3;
  double distance_km = 4;
  double compatibility_score = 5;
}

// CalculatePredictionRequest
message CalculatePredictionRequest {
  int64 data_center_id = 1 [(buf.validate.field).int64.gt = 0];
  optional int64 carbon_credit_id = 2;
  repeated int64 heat_sink_ids = 3;
  string scenario_name = 4 [(buf.validate.field).string = {min_len: 1, max_len: 255}];
  int32 analysis_years = 5 [(buf.validate.field).int32 = {gte: 1, lte: 30}];
  double discount_rate = 6 [(buf.validate.field).double = {gte: 0, lte: 0.3}];
  
  // Custom parameter overrides
  optional double custom_pue = 7 [(buf.validate.field).double = {gte: 1.0, lte: 3.0}];
  optional double custom_efficiency = 8 [(buf.validate.field).double = {gte: 0, lte: 1.0}];
  optional double custom_electricity_rate = 9 [(buf.validate.field).double.gte = 0];
  optional double custom_carbon_price = 10 [(buf.validate.field).double.gte = 0];
}

// CalculatePredictionResponse
message CalculatePredictionResponse {
  int64 data_center_id = 1;
  optional int64 carbon_credit_id = 2;
  optional int64 heat_sink_id = 3;
  string scenario_name = 4;
  int32 analysis_years = 5;
  double discount_rate = 6;
  
  EnergyMetrics energy_metrics = 7;
  HeatRecoveryMetrics heat_recovery_metrics = 8;
  CarbonMetrics carbon_metrics = 9;
  CapexMetrics capex_metrics = 10;
  OpexMetrics opex_metrics = 11;
  SavingsMetrics savings_metrics = 12;
  FinancialMetrics financial_metrics = 13;
  SensitivityAnalysis sensitivity_analysis = 14;
  repeated YearlyBreakdown yearly_breakdown = 15;
  repeated HeatSinkAllocation heat_sink_allocations = 16;
  
  google.protobuf.Timestamp created_at = 17;
}
```

---

## District Heating Service (district_heating_service.proto)

```protobuf
syntax = "proto3";

package pyrecycleheat.v1;

option go_package = "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1;pyrecycleheatv1";

import "google/protobuf/empty.proto";
import "pyrecycleheat/v1/district_heating.proto";
import "pyrecycleheat/v1/common.proto";

// DistrictHeatingService manages district heating infrastructure
service DistrictHeatingService {
  // Heat Centers
  rpc ListHeatCenters(ListHeatCentersRequest) returns (ListHeatCentersResponse);
  rpc GetHeatCenter(GetHeatCenterRequest) returns (HeatCenter);
  rpc CreateHeatCenter(CreateHeatCenterRequest) returns (HeatCenter);
  rpc UpdateHeatCenter(UpdateHeatCenterRequest) returns (HeatCenter);
  rpc DeleteHeatCenter(DeleteHeatCenterRequest) returns (google.protobuf.Empty);
  
  // Demand Sites
  rpc ListDemandSites(ListDemandSitesRequest) returns (ListDemandSitesResponse);
  rpc GetDemandSite(GetDemandSiteRequest) returns (DemandSite);
  rpc CreateDemandSite(CreateDemandSiteRequest) returns (DemandSite);
  rpc UpdateDemandSite(UpdateDemandSiteRequest) returns (DemandSite);
  rpc DeleteDemandSite(DeleteDemandSiteRequest) returns (google.protobuf.Empty);
  
  // Routes
  rpc ListRoutes(ListRoutesRequest) returns (ListRoutesResponse);
  rpc GetRoute(GetRouteRequest) returns (Route);
  rpc CreateRoute(CreateRouteRequest) returns (Route);
  rpc UpdateRoute(UpdateRouteRequest) returns (Route);
  rpc DeleteRoute(DeleteRouteRequest) returns (google.protobuf.Empty);
  
  // Analytics
  rpc GetAnalyticsSummary(google.protobuf.Empty) returns (AnalyticsSummary);
}

// List requests
message ListHeatCentersRequest {
  PaginationRequest pagination = 1;
}

message ListHeatCentersResponse {
  repeated HeatCenter heat_centers = 1;
  PaginationMetadata pagination = 2;
}

message ListDemandSitesRequest {
  PaginationRequest pagination = 1;
}

message ListDemandSitesResponse {
  repeated DemandSite demand_sites = 1;
  PaginationMetadata pagination = 2;
}

message ListRoutesRequest {
  PaginationRequest pagination = 1;
}

message ListRoutesResponse {
  repeated Route routes = 1;
  PaginationMetadata pagination = 2;
}

// Get requests
message GetHeatCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message GetDemandSiteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message GetRouteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

// Delete requests
message DeleteHeatCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message DeleteDemandSiteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message DeleteRouteRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}
```

---

## Prediction Service (prediction_service.proto)

```protobuf
syntax = "proto3";

package pyrecycleheat.v1;

option go_package = "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1;pyrecycleheatv1";

import "google/protobuf/empty.proto";
import "pyrecycleheat/v1/prediction.proto";
import "pyrecycleheat/v1/common.proto";

// PredictionService manages data centers and predictions
service PredictionService {
  // Data Centers
  rpc ListDataCenters(ListDataCentersRequest) returns (ListDataCentersResponse);
  rpc GetDataCenter(GetDataCenterRequest) returns (DataCenter);
  rpc CreateDataCenter(CreateDataCenterRequest) returns (DataCenter);
  rpc UpdateDataCenter(UpdateDataCenterRequest) returns (DataCenter);
  rpc DeleteDataCenter(DeleteDataCenterRequest) returns (google.protobuf.Empty);
  
  // Carbon Credits
  rpc ListCarbonCredits(ListCarbonCreditsRequest) returns (ListCarbonCreditsResponse);
  rpc GetCarbonCredit(GetCarbonCreditRequest) returns (CarbonCredit);
  rpc CreateCarbonCredit(CreateCarbonCreditRequest) returns (CarbonCredit);
  rpc UpdateCarbonCredit(UpdateCarbonCreditRequest) returns (CarbonCredit);
  rpc DeleteCarbonCredit(DeleteCarbonCreditRequest) returns (google.protobuf.Empty);
  
  // Heat Sinks
  rpc ListHeatSinks(ListHeatSinksRequest) returns (ListHeatSinksResponse);
  rpc GetHeatSink(GetHeatSinkRequest) returns (HeatSink);
  rpc CreateHeatSink(CreateHeatSinkRequest) returns (HeatSink);
  rpc UpdateHeatSink(UpdateHeatSinkRequest) returns (HeatSink);
  rpc DeleteHeatSink(DeleteHeatSinkRequest) returns (google.protobuf.Empty);
  
  // Predictions
  rpc CalculatePrediction(CalculatePredictionRequest) returns (CalculatePredictionResponse);
  rpc ListPredictionResults(ListPredictionResultsRequest) returns (ListPredictionResultsResponse);
  rpc GetPredictionResult(GetPredictionResultRequest) returns (PredictionResult);
}

// List requests
message ListDataCentersRequest {
  PaginationRequest pagination = 1;
}

message ListDataCentersResponse {
  repeated DataCenter data_centers = 1;
  PaginationMetadata pagination = 2;
}

message ListCarbonCreditsRequest {
  PaginationRequest pagination = 1;
}

message ListCarbonCreditsResponse {
  repeated CarbonCredit carbon_credits = 1;
  PaginationMetadata pagination = 2;
}

message ListHeatSinksRequest {
  PaginationRequest pagination = 1;
}

message ListHeatSinksResponse {
  repeated HeatSink heat_sinks = 1;
  PaginationMetadata pagination = 2;
}

message ListPredictionResultsRequest {
  PaginationRequest pagination = 1;
  optional int64 data_center_id = 2;
  optional string scenario_name = 3;
}

message ListPredictionResultsResponse {
  repeated PredictionResult prediction_results = 1;
  PaginationMetadata pagination = 2;
}

// Get requests
message GetDataCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message GetCarbonCreditRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message GetHeatSinkRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message GetPredictionResultRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

// Delete requests
message DeleteDataCenterRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message DeleteCarbonCreditRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}

message DeleteHeatSinkRequest {
  int64 id = 1 [(buf.validate.field).int64.gt = 0];
}
```

---

## buf Configuration (buf.yaml)

```yaml
version: v2
modules:
  - path: proto/pyrecycleheat/v1
    name: buf.build/pyrecycleheat/api
lint:
  use:
    - STANDARD
  except:
    - PACKAGE_VERSION_SUFFIX
breaking:
  use:
    - FILE
deps:
  - buf.build/googleapis/googleapis
  - buf.build/bufbuild/protovalidate
```

---

## Code Generation

### buf.gen.yaml

```yaml
version: v2
managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: github.com/pyrecycleheat/api/gen/go
plugins:
  # Go code generation
  - remote: buf.build/protocolbuffers/go
    out: gen/go
    opt:
      - paths=source_relative
  
  # ConnectRPC Go generation
  - remote: buf.build/connectrpc/go
    out: gen/go
    opt:
      - paths=source_relative
  
  # TypeScript generation
  - remote: buf.build/bufbuild/es
    out: frontend/src/gen
    opt:
      - target=ts
  
  # ConnectRPC TypeScript generation
  - remote: buf.build/connectrpc/es
    out: frontend/src/gen
    opt:
      - target=ts
```

### Generate Commands

```bash
# Install buf
go install github.com/bufbuild/buf/cmd/buf@latest

# Generate all code
buf generate

# Generate for specific target
buf generate --template buf.gen.yaml
```

---

## TypeScript Frontend Integration

### Generated Types Usage

```typescript
import { HeatCenter, CreateHeatCenterRequest } from '@/gen/pyrecycleheat/v1/district_heating_pb';
import { DistrictHeatingService } from '@/gen/pyrecycleheat/v1/district_heating_service_connect';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

// Create transport
const transport = createConnectTransport({
  baseUrl: 'http://localhost:8080',
});

// Create client
const client = createPromiseClient(DistrictHeatingService, transport);

// Call RPC
const heatCenters = await client.listHeatCenters({
  pagination: { page: 1, pageSize: 50 },
});
```

---

## Go Backend Integration

### Service Implementation

```go
package service

import (
    "context"
    "connectrpc.com/connect"
    v1 "github.com/pyrecycleheat/api/gen/go/pyrecycleheat/v1"
)

type DistrictHeatingService struct {
    db Database
}

func (s *DistrictHeatingService) ListHeatCenters(
    ctx context.Context,
    req *connect.Request[v1.ListHeatCentersRequest],
) (*connect.Response[v1.ListHeatCentersResponse], error) {
    // Implementation
    centers, err := s.db.ListHeatCenters(ctx, ...)
    if err != nil {
        return nil, connect.NewError(connect.CodeInternal, err)
    }
    
    return connect.NewResponse(&v1.ListHeatCentersResponse{
        HeatCenters: centers,
        Pagination:  pagination,
    }), nil
}
```

---

## Summary

**Protobuf Files Created:**

| File | Purpose | Messages | Services |
|------|---------|----------|----------|
| `common.proto` | Shared types | Location, Pagination | - |
| `district_heating.proto` | District heating entities | HeatCenter, DemandSite, Route, Analytics | - |
| `district_heating_service.proto` | District heating RPCs | Request/Response wrappers | DistrictHeatingService |
| `prediction.proto` | Prediction entities | DataCenter, CarbonCredit, HeatSink, Prediction | - |
| `prediction_service.proto` | Prediction RPCs | Request/Response wrappers | PredictionService |

**Total:**

- 5 proto files
- 2 services (21 RPC methods)
- 50+ message types
- Full validation rules

**Next Steps:**

- Create proto files in `shared/proto/pyrecycleheat/v1/`
- Configure `buf.yaml` and `buf.gen.yaml`
- Run `buf generate` to generate Go and TypeScript code
- Implement service handlers in Go
- Update frontend to use generated clients

---

## References

- **Buf Documentation:** <https://buf.build/docs>
- **ConnectRPC:** <https://connectrpc.com>
- **protovalidate:** <https://github.com/bufbuild/protovalidate>
- **Google Protobuf:** <https://protobuf.dev>
