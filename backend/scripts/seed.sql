-- Clean up existing data
DELETE FROM prediction_results;
DELETE FROM data_centers;
DELETE FROM heat_sinks;
DELETE FROM carbon_credits;

-- 1. Data Centers (Amsterdam Science Park & Schiphol)

-- "Hyperscale AMS-1": Modern, Liquid Cooled (65C output), High Efficiency
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled)
VALUES 
('Entropy Core AMS-1', 52.3560, 4.9530, 'Science Park 402, Amsterdam', 'hyperscale', 45000, 1.15, 85, 'liquid', 'grid_green', 100, 1);

-- "Edge Node West": Smaller, Air Cooled (35C output), Older
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled)
VALUES 
('Entropy Edge West', 52.3400, 4.8000, 'Sloterweg 303, Amsterdam', 'edge', 2500, 1.4, 60, 'air', 'grid_mix', 50, 0);

-- "Legacy Colo Center": Large, Air Cooled (35C), Inefficient
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled)
VALUES 
('Global Colo AMS-3', 52.3080, 4.9400, 'Paasheuvelweg 25, Amsterdam', 'colocation', 12000, 1.6, 70, 'air', 'grid_mix', 20, 0);


-- 2. Heat Sinks (Diverse Requirements)

-- "Modern Greenhouse": 25C Demand. Perfect for ANY DC (Direct Reuse).
-- Close to AMS-1 (2km)
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor)
VALUES 
('AgriPort Greenhouses', 52.3700, 4.9700, 'Middenweg 12, Diemen', 'greenhouse', 15.0, 25.0, 12.0, 1.5);

-- "District Heating South": 80C Demand. Needs Heat Pumps.
-- Close to AMS-1 (1km) but HIGH TEMP GAP.
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor)
VALUES 
('Vattenfall District South', 52.3500, 4.9600, 'Carolina MacGillavrylaan, Amsterdam', 'district_heating', 50.0, 80.0, 35.0, 2.0);

-- "Olympic Pool Complex": 30C Demand. Good match for Air Cooled.
-- Close to Edge West (500m)
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor)
VALUES 
('Sloterparkbad Pool', 52.3680, 4.8100, 'President Allendelaan 3, Amsterdam', 'public_facility', 2.0, 30.0, 1.8, 1.1);

-- "University Campus": 60C Demand. Good match for Liquid.
-- Close to AMS-1 (500m)
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor)
VALUES 
('UvA Science Campus', 52.3550, 4.9540, 'Science Park 904', 'campus', 8.0, 60.0, 5.5, 1.8);


-- 3. Carbon Credits
INSERT INTO carbon_credits (project_name, credit_type, price_per_ton, available_tons, vintage_year, verification_standard, location)
VALUES 
('Dutch Peatland Restoration', 'nature_based', 45.0, 5000, 2024, 'Gold Standard', 'Netherlands');

INSERT INTO carbon_credits (project_name, credit_type, price_per_ton, available_tons, vintage_year, verification_standard, location)
VALUES 
('North Sea Wind Offset', 'renewable_energy', 25.0, 150000, 2023, 'VCS', 'North Sea');
