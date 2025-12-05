"""
Database Migration Script for Data Center Savings Prediction System
This script creates the necessary tables for the prediction system while preserving existing data.
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import Base, HeatCenter, DemandSite, Route
from prediction_models import DataCenter, CarbonCredit, HeatSink, PredictionResult, PredictionScenario

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./district_heating.db")

def create_engine_for_migration():
    return create_engine(DATABASE_URL, echo=True)

def backup_existing_data(engine):
    backup_data = {}
    
    try:
        with engine.connect() as conn:
            # Check if tables exist and backup data
            inspector = inspect(engine)
            existing_tables = inspector.get_table_names()
            
            for table_name in ['heat_centers', 'demand_sites', 'routes']:
                if table_name in existing_tables:
                    result = conn.execute(text(f"SELECT * FROM {table_name}"))
                    backup_data[table_name] = [dict(row._mapping) for row in result]
                    print(f"Backed up {len(backup_data[table_name])} records from {table_name}")
    
    except Exception as e:
        print(f"Warning: Could not backup existing data: {e}")
    
    return backup_data

def create_prediction_tables(engine):
    from prediction_models import Base as PredictionBase
    
    try:
        PredictionBase.metadata.create_all(bind=engine)
        print("✓ Created prediction system tables")
    except Exception as e:
        print(f"Error creating prediction tables: {e}")
        raise

def seed_sample_data(engine):
    from prediction_models import DataCenter, CarbonCredit, HeatSink
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if data already exists
        if session.query(DataCenter).count() > 0:
            print("Sample data already exists, skipping seeding")
            return
        
        # Sample Data Centers
        sample_data_centers = [
            {
                "name": "SF Tech Hub DC",
                "location_lat": 37.7749,
                "location_lng": -122.4194,
                "address": "123 Market St, San Francisco, CA",
                "dc_type": "enterprise",
                "total_it_load_kw": 5000.0,
                "pue": 1.4,
                "cooling_type": "air_cooled",
                "energy_source": "grid",
                "utilization_percent": 75.0,
                "electricity_cost_kwh": 0.15
            },
            {
                "name": "Mission Bay Data Center",
                "location_lat": 37.7706,
                "location_lng": -122.3906,
                "address": "456 Mission Bay Blvd, San Francisco, CA",
                "dc_type": "colocation",
                "total_it_load_kw": 8000.0,
                "pue": 1.3,
                "cooling_type": "liquid_cooled",
                "energy_source": "renewable",
                "utilization_percent": 80.0,
                "electricity_cost_kwh": 0.12
            }
        ]
        
        for dc_data in sample_data_centers:
            dc = DataCenter(**dc_data)
            session.add(dc)
        
        # Sample Carbon Credits
        sample_carbon_credits = [
            {
                "project_name": "California Carbon Offset",
                "price_per_ton": 25.0,
                "available_tons": 1000.0,
                "verification_standard": "CAR",
                "credit_type": "renewable_energy",
                "location": "California",
                "vintage_year": 2024,
                "project_description": "Renewable Energy project in California"
            },
            {
                "project_name": "VCS Forest Conservation",
                "price_per_ton": 18.0,
                "available_tons": 2000.0,
                "verification_standard": "VCS",
                "credit_type": "forest_conservation",
                "location": "North America",
                "vintage_year": 2023,
                "project_description": "Forest Conservation project in North America"
            }
        ]
        
        for cc_data in sample_carbon_credits:
            cc = CarbonCredit(**cc_data)
            session.add(cc)
        
        # Sample Heat Sinks
        sample_heat_sinks = [
            {
                "name": "UCSF Medical Center",
                "location_lat": 37.7629,
                "location_lng": -122.4577,
                "address": "505 Parnassus Ave, San Francisco, CA",
                "sink_type": "hospital",
                "capacity_mw": 2.0,
                "current_demand_mw": 1.5,
                "temperature_requirement_c": 65.0,
                "heat_price_per_mwh": 80.0
            },
            {
                "name": "SF State University",
                "location_lat": 37.7216,
                "location_lng": -122.4778,
                "address": "1600 Holloway Ave, San Francisco, CA",
                "sink_type": "university",
                "capacity_mw": 3.5,
                "current_demand_mw": 2.8,
                "temperature_requirement_c": 60.0,
                "heat_price_per_mwh": 60.0
            }
        ]
        
        for hs_data in sample_heat_sinks:
            hs = HeatSink(**hs_data)
            session.add(hs)
        
        session.commit()
        print("✓ Seeded sample data successfully")
        
    except Exception as e:
        session.rollback()
        print(f"Error seeding sample data: {e}")
        raise
    finally:
        session.close()

def verify_migration(engine):
    from prediction_models import DataCenter, CarbonCredit, HeatSink
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        dc_count = session.query(DataCenter).count()
        cc_count = session.query(CarbonCredit).count()
        hs_count = session.query(HeatSink).count()
        
        print(f"✓ Migration verification:")
        print(f"  - Data Centers: {dc_count}")
        print(f"  - Carbon Credits: {cc_count}")
        print(f"  - Heat Sinks: {hs_count}")
        
        if dc_count == 0 and cc_count == 0 and hs_count == 0:
            print("⚠ Warning: No data found after migration")
        else:
            print("✓ Migration completed successfully")
            
    except Exception as e:
        print(f"Error verifying migration: {e}")
        raise
    finally:
        session.close()

def run_migration():
    print("Starting database migration...")
    print("=" * 50)
    
    try:
        # Create engine
        engine = create_engine_for_migration()
        
        # Backup existing data
        print("1. Backing up existing data...")
        backup_data = backup_existing_data(engine)
        
        # Create new tables
        print("2. Creating prediction system tables...")
        create_prediction_tables(engine)
        
        # Seed sample data
        print("3. Seeding sample data...")
        seed_sample_data(engine)
        
        # Verify migration
        print("4. Verifying migration...")
        verify_migration(engine)
        
        print("=" * 50)
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    run_migration()