-- Clean Everyone
DELETE FROM prediction_results;
DELETE FROM data_centers;
DELETE FROM heat_sinks;
DELETE FROM carbon_credits;

-- AMSTERDAM REGION (High Density) --
-- Data Centers
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled) VALUES 
('Entropy Core AMS-1 (Science Park)', 52.3560, 4.9530, 'Science Park, Amsterdam', 'hyperscale', 45000, 1.15, 85, 'liquid', 'grid_green', 100, 1),
('Equinix AM4', 52.3580, 4.9560, 'Science Park, Amsterdam', 'colocation', 30000, 1.2, 80, 'air', 'grid_mix', 100, 0),
('Interxion AMS9 (Schiphol)', 52.2900, 4.7500, 'Puskarichlaan, Schiphol', 'colocation', 20000, 1.3, 75, 'air', 'grid_mix', 50, 0),
('Digital Realty AMS (Hoofddorp)', 52.2900, 4.7000, 'Cateringweg, Hoofddorp', 'colocation', 25000, 1.25, 78, 'air', 'grid_mix', 60, 0),
('Iron Mountain AMS-1', 52.3800, 4.6500, 'J.W. Lucasweg, Haarlem', 'colocation', 15000, 1.35, 70, 'air', 'grid_mix', 40, 0),
('NorthC Amsterdam', 52.4000, 4.9000, 'Kabelweg, Amsterdam', 'edge', 5000, 1.4, 65, 'air', 'grid_mix', 30, 0),
('EdgeConnex AMS01', 52.2800, 4.7800, 'Schiphol-Rijk', 'edge', 8000, 1.3, 72, 'air', 'grid_green', 80, 0);

-- Heat Sinks
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor) VALUES 
('AgriPort Greenhouses', 52.3700, 4.9700, 'Diemen Area', 'greenhouse', 15.0, 25.0, 12.0, 1.5),
('Vattenfall District South', 52.3500, 4.9600, 'Amsterdam South', 'district_heating', 50.0, 80.0, 35.0, 2.0),
('UvA Science Campus', 52.3550, 4.9540, 'Science Park', 'campus', 8.0, 60.0, 5.5, 1.8),
('Schiphol Terminal Heating', 52.3100, 4.7600, 'Schiphol Airport', 'public_facility', 20.0, 70.0, 15.0, 1.2),
('Amstelveen Stadshart', 52.3000, 4.8500, 'Amstelveen', 'district_heating', 12.0, 75.0, 8.0, 1.9),
('Haarlem Waarderpolder', 52.3900, 4.6600, 'Haarlem', 'industrial', 10.0, 45.0, 6.0, 1.0);


-- ROTTERDAM REGION --
-- Data Centers
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled) VALUES 
('SmartDC Rotterdam', 51.9200, 4.4300, 'Van Nelle Fabriek', 'colocation', 10000, 1.3, 75, 'liquid', 'grid_mix', 70, 1),
('NorthC Rotterdam', 51.9500, 4.5500, 'Zestienhoven', 'edge', 4000, 1.45, 60, 'air', 'grid_mix', 20, 0);

-- Heat Sinks
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor) VALUES 
('Eneco District RTM', 51.9100, 4.4800, 'Rotterdam Center', 'district_heating', 80.0, 90.0, 60.0, 2.2),
('Westland Greenhouses', 51.9800, 4.2500, 'Westland Area', 'greenhouse', 100.0, 30.0, 80.0, 1.4),
('Blijdorp Zoo', 51.9300, 4.4400, 'Blijdorp', 'public_facility', 5.0, 35.0, 4.0, 1.1);


-- UTRECHT REGION --
-- Data Centers
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled) VALUES 
('Kyndryl Utrecht', 52.0800, 5.0500, 'Lage Weide', 'enterprise', 6000, 1.4, 65, 'air', 'grid_mix', 40, 0);

-- Heat Sinks
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor) VALUES 
('Utrecht Science Park', 52.0900, 5.1700, 'De Uithof', 'campus', 25.0, 65.0, 18.0, 1.7),
('Nieuwegein District', 52.0300, 5.0800, 'Nieuwegein', 'district_heating', 15.0, 75.0, 10.0, 2.0);


-- EINDHOVEN (Brainport) --
-- Data Centers
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled) VALUES 
('High Tech Campus DC', 51.4100, 5.4600, 'HTC Eindhoven', 'hyperscale', 18000, 1.1, 90, 'immersion', 'grid_green', 100, 1);

-- Heat Sinks
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor) VALUES 
('Eindhoven Airport', 51.4500, 5.3900, 'Eindhoven', 'public_facility', 8.0, 60.0, 5.0, 1.3),
('ASML Campus', 51.4000, 5.4200, 'Veldhoven', 'campus', 30.0, 40.0, 25.0, 1.2);


-- GRONINGEN (Eemshaven) --
-- Data Centers
INSERT INTO data_centers (name, location_lat, location_lng, address, dc_type, total_it_load_kw, pue, utilization_percent, cooling_type, energy_source, renewable_percent, heat_recovery_enabled) VALUES 
('Google Eemshaven', 53.4300, 6.8300, 'Eemshaven', 'hyperscale', 200000, 1.1, 95, 'air', 'wind', 100, 0),
('QTS Eemshaven', 53.4400, 6.8400, 'Eemshaven', 'hyperscale', 100000, 1.2, 85, 'air', 'wind', 100, 0);

-- Heat Sinks
INSERT INTO heat_sinks (name, location_lat, location_lng, address, sink_type, capacity_mw, temperature_requirement_c, current_demand_mw, seasonal_factor) VALUES 
('Groningen Seaports Industry', 53.3300, 6.9000, 'Delfzijl', 'industrial', 50.0, 120.0, 40.0, 1.0);


-- CARBON CREDITS
INSERT INTO carbon_credits (project_name, credit_type, price_per_ton, available_tons, vintage_year, verification_standard, location)
VALUES 
('Dutch Peatland Restoration', 'nature_based', 45.0, 5000, 2024, 'Gold Standard', 'Netherlands'),
('North Sea Wind Offset', 'renewable_energy', 25.0, 150000, 2023, 'VCS', 'North Sea'),
('Reforestation Veluwe', 'nature_based', 35.0, 10000, 2024, 'VCS', 'Gelderland');
