-- Seed data for PyRecycleHeat backend
-- Run with: sqlite3 district_heating.db < scripts/seed.sql

-- Clear existing data (optional - comment out if you want to keep existing)
DELETE FROM prediction_results;
DELETE FROM heat_sinks;
DELETE FROM carbon_credits;
DELETE FROM data_centers;

-- Data Centers (example data centers in Netherlands and Germany)
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, electricity_cost_kwh, operating_hours_year, heat_recovery_enabled)
VALUES 
  ('Equinix AM7', 52.2907, 4.9378, 'Schiphol-Rijk, Netherlands', 'hyperscale', 35000, 1.25, 78, 'liquid', 'grid', 100, 0.12, 8760, 1),
  ('Digital Realty AMS1', 52.3436, 4.8569, 'Amsterdam Science Park, Netherlands', 'colocation', 18000, 1.35, 72, 'air', 'grid', 85, 0.14, 8760, 0),
  ('NorthC Groningen', 53.2194, 6.5665, 'Groningen, Netherlands', 'enterprise', 8500, 1.45, 65, 'air', 'grid', 60, 0.11, 8760, 0),
  ('Interxion FRA15', 50.1109, 8.6821, 'Frankfurt, Germany', 'hyperscale', 42000, 1.28, 82, 'liquid', 'grid', 90, 0.18, 8760, 1),
  ('NLDC Rotterdam', 51.9225, 4.4792, 'Rotterdam, Netherlands', 'colocation', 12000, 1.40, 70, 'hybrid', 'grid', 75, 0.13, 8760, 0);

-- Carbon Credits (various carbon credit programs)
INSERT INTO carbon_credits (project_name, credit_type, price_per_ton, available_tons, vintage_year, verification_standard, location, project_description)
VALUES
  ('Dutch Wind Farm Offshore', 'renewable_energy', 45.00, 50000, 2024, 'GoldStandard', 'North Sea, Netherlands', 'Offshore wind energy project reducing grid carbon intensity'),
  ('German Forest Reforestation', 'reforestation', 28.50, 25000, 2023, 'VCS', 'Bavaria, Germany', 'Native forest restoration project in southern Germany'),
  ('EU ETS Allowances', 'emission_trading', 85.00, 100000, 2024, 'EU-ETS', 'European Union', 'EU Emissions Trading System allowances'),
  ('Solar PV Netherlands', 'renewable_energy', 35.00, 30000, 2024, 'GoldStandard', 'Zeeland, Netherlands', 'Large-scale solar photovoltaic installation'),
  ('Industrial Heat Recovery', 'energy_efficiency', 52.00, 15000, 2024, 'VCS', 'Ruhr Area, Germany', 'Industrial process heat recovery and reuse');

-- Heat Sinks (district heating networks and industrial consumers)
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, current_demand_mw, temperature_requirement_c, seasonal_factor, connection_cost_per_km, heat_price_per_mwh, operating_hours_year)
VALUES
  ('Amsterdam District Heating', 52.3702, 4.8952, 'Amsterdam City Center', 'district_heating', 150, 95, 70, 1.2, 120000, 55, 5500),
  ('Rotterdam Warmtenetwerk', 51.9244, 4.4777, 'Rotterdam South', 'district_heating', 200, 145, 65, 1.15, 95000, 48, 5200),
  ('Frankfurt Fernwärme', 50.1155, 8.6842, 'Frankfurt am Main', 'district_heating', 180, 130, 75, 1.25, 135000, 62, 5800),
  ('Groningen University Campus', 53.2194, 6.5620, 'University of Groningen', 'institutional', 25, 18, 55, 1.3, 80000, 42, 4800),
  ('BASF Ludwigshafen', 49.4833, 8.4333, 'Ludwigshafen, Germany', 'industrial', 85, 72, 90, 0.9, 150000, 38, 8000),
  ('Schiphol Airport Heating', 52.3105, 4.7683, 'Amsterdam Airport Schiphol', 'commercial', 45, 32, 60, 1.1, 110000, 52, 6000);

-- Sample Prediction Results (showing feasibility analyses)
INSERT INTO prediction_results (data_center_id, carbon_credit_id, heat_sink_id, scenario_name, analysis_years, total_capex, annual_opex, annual_savings, net_present_value, internal_rate_return, payback_period_years, investment_grade, annual_co2_reduction_kg, annual_heat_recovery_kwh)
VALUES
  (1, 1, 1, 'Equinix AM7 to Amsterdam DH', 15, 4500000, 180000, 1250000, 8750000, 0.24, 4.2, 'A', 12500000, 85000000),
  (1, 3, 2, 'Equinix AM7 to Rotterdam Alt', 15, 6200000, 220000, 980000, 4200000, 0.14, 7.1, 'B', 9800000, 72000000),
  (2, 1, 1, 'Digital Realty to Amsterdam', 10, 2800000, 120000, 650000, 2950000, 0.18, 5.2, 'B', 6500000, 48000000),
  (4, 5, 3, 'Interxion FRA15 to Frankfurt', 20, 5100000, 195000, 1450000, 12800000, 0.26, 3.8, 'A', 14500000, 105000000),
  (4, 2, 5, 'Interxion to BASF Industrial', 12, 7800000, 280000, 1850000, 9200000, 0.21, 4.8, 'A', 18500000, 135000000),
  (3, 4, 4, 'NorthC to University Campus', 10, 1200000, 65000, 320000, 1450000, 0.22, 4.5, 'B', 3200000, 22000000),
  (5, 1, 6, 'NLDC to Schiphol Airport', 15, 3400000, 145000, 780000, 4100000, 0.19, 5.0, 'B', 7800000, 58000000);

-- Verify seed data
SELECT 'Data Centers: ' || COUNT(*) FROM data_centers;
SELECT 'Carbon Credits: ' || COUNT(*) FROM carbon_credits;
SELECT 'Heat Sinks: ' || COUNT(*) FROM heat_sinks;
SELECT 'Prediction Results: ' || COUNT(*) FROM prediction_results;
