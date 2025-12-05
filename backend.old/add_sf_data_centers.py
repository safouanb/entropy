#!/usr/bin/env python3
"""
Script to add 5 specific San Francisco data centers to the database.
These are the data centers requested by the user with their exact addresses.
"""

import requests
import json
from typing import Dict, List

# Base URL for the API
BASE_URL = "http://localhost:8000"

# Data centers to add with coordinates from web search
DATA_CENTERS = [
    {
        "name": "Moscone Center",
        "address": "747 Howard St, San Francisco, CA 94103",
        "location_lat": 37.7840,  # From web search results
        "location_lng": -122.4014,
        "dc_type": "enterprise",
        "total_it_load_kw": 2500.0,
        "pue": 1.3,
        "cooling_type": "air_cooled",
        "energy_source": "grid",
        "floor_area_sqm": 3000.0,
        "rack_count": 150,
        "server_count": 800,
        "storage_capacity_tb": 2000.0,
        "utilization_percent": 75.0,
        "operating_hours_year": 8760,
        "ambient_temp_celsius": 22.0,
        "electricity_cost_kwh": 0.18,
        "cooling_cost_kwh": 0.03,
        "maintenance_cost_annual": 180000.0
    },
    {
        "name": "San Francisco Museum of Modern Art",
        "address": "151 3rd St, San Francisco, CA 94103",
        "location_lat": 37.7857,  # From web search results
        "location_lng": -122.4011,
        "dc_type": "enterprise",
        "total_it_load_kw": 1200.0,
        "pue": 1.4,
        "cooling_type": "water_cooled",
        "energy_source": "hybrid",
        "floor_area_sqm": 1500.0,
        "rack_count": 80,
        "server_count": 400,
        "storage_capacity_tb": 1000.0,
        "utilization_percent": 70.0,
        "operating_hours_year": 8760,
        "ambient_temp_celsius": 23.0,
        "electricity_cost_kwh": 0.17,
        "cooling_cost_kwh": 0.025,
        "maintenance_cost_annual": 120000.0
    },
    {
        "name": "LinkedIn Corporate Office",
        "address": "222 2nd St, San Francisco, CA 94105",
        "location_lat": 37.78635,  # From Wikipedia coordinates
        "location_lng": -122.39825,
        "dc_type": "hyperscale",
        "total_it_load_kw": 8000.0,
        "pue": 1.2,
        "cooling_type": "liquid_cooled",
        "energy_source": "renewable",
        "floor_area_sqm": 5000.0,
        "rack_count": 400,
        "server_count": 2500,
        "storage_capacity_tb": 10000.0,
        "utilization_percent": 85.0,
        "operating_hours_year": 8760,
        "ambient_temp_celsius": 21.0,
        "electricity_cost_kwh": 0.15,
        "cooling_cost_kwh": 0.02,
        "maintenance_cost_annual": 500000.0
    },
    {
        "name": "Golden Gate University",
        "address": "536 Mission St, San Francisco, CA 94105",
        "location_lat": 37.7886,  # Estimated based on Mission St location
        "location_lng": -122.3986,
        "dc_type": "enterprise",
        "total_it_load_kw": 800.0,
        "pue": 1.5,
        "cooling_type": "air_cooled",
        "energy_source": "grid",
        "floor_area_sqm": 1000.0,
        "rack_count": 50,
        "server_count": 250,
        "storage_capacity_tb": 500.0,
        "utilization_percent": 65.0,
        "operating_hours_year": 8760,
        "ambient_temp_celsius": 24.0,
        "electricity_cost_kwh": 0.19,
        "cooling_cost_kwh": 0.035,
        "maintenance_cost_annual": 80000.0
    },
    {
        "name": "Google San Francisco",
        "address": "345 Spear St, San Francisco, CA 94105",
        "location_lat": 37.790052,  # From web search results
        "location_lng": -122.390192,
        "dc_type": "hyperscale",
        "total_it_load_kw": 12000.0,
        "pue": 1.1,
        "cooling_type": "immersion",
        "energy_source": "renewable",
        "floor_area_sqm": 8000.0,
        "rack_count": 600,
        "server_count": 4000,
        "storage_capacity_tb": 20000.0,
        "utilization_percent": 90.0,
        "operating_hours_year": 8760,
        "ambient_temp_celsius": 20.0,
        "electricity_cost_kwh": 0.12,
        "cooling_cost_kwh": 0.015,
        "maintenance_cost_annual": 800000.0
    }
]

def add_data_center(data_center_data):
    response = requests.post(f"{BASE_URL}/api/v1/predictions/data-centers", json=data_center_data)
    if response.status_code == 200:
        print(f"✓ Added: {data_center_data['name']}")
        return response.json()
    else:
        print(f"✗ Failed to add {data_center_data['name']}: {response.text}")
        return None

def check_existing_data_centers():
    try:
        response = requests.get(f"{BASE_URL}/api/v1/predictions/data-centers")
        if response.status_code == 200:
            existing = response.json()
            print(f"Found {len(existing)} existing data centers")
            return [dc['name'] for dc in existing]
        return []
    except Exception as e:
        print(f"Error checking existing data centers: {e}")
        return []

def main():
    print("Adding San Francisco Data Centers...")
    
    existing_names = check_existing_data_centers()
    added_count = 0
    
    for dc_data in DATA_CENTERS:
        if dc_data['name'] not in existing_names:
            result = add_data_center(dc_data)
            if result:
                added_count += 1
        else:
            print(f"⚠ Skipped: {dc_data['name']} (already exists)")
    
    print(f"\nCompleted! Added {added_count} new data centers.")
    
    if added_count > 0:
        print("\n🗺️  New data centers should now appear on the map!")
        print("   Refresh your browser to see the updated locations.")

if __name__ == "__main__":
    main()