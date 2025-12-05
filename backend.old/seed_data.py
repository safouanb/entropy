#!/usr/bin/env python3
"""
Seed script to populate the database with specific San Francisco locations
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import os

from models import Base, HeatCenter, DemandSite, Route, RouteStatus

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./district_heating.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Route).delete()
        db.query(DemandSite).delete()
        db.query(HeatCenter).delete()
        
        # Heat Centers - Major SF locations as heat supply points
        heat_centers = [
            HeatCenter(
                name="Moscone Center",
                location_lat=37.7840,
                location_lng=-122.4014,
                address="747 Howard St, San Francisco, CA 94103",
                max_capacity_mw=25.0,
                current_output_mw=18.5,
                efficiency_percent=92.0,
                fuel_type="Geothermal",
                is_active=True,
                commissioning_date=datetime(2019, 3, 15),
                last_maintenance=datetime.now() - timedelta(days=15),
                description="Major convention center with advanced geothermal heating system serving downtown SF."
            ),
            HeatCenter(
                name="Google San Francisco",
                location_lat=37.7906,
                location_lng=-122.3933,
                address="345 Spear St, San Francisco, CA 94105",
                max_capacity_mw=35.0,
                current_output_mw=28.2,
                efficiency_percent=94.5,
                fuel_type="Solar + Battery",
                is_active=True,
                commissioning_date=datetime(2020, 8, 10),
                last_maintenance=datetime.now() - timedelta(days=7),
                description="Google's SF office with cutting-edge renewable energy and district heating infrastructure."
            )
        ]
        
        # Demand Sites - Other locations as heat consumers
        demand_sites = [
            DemandSite(
                name="San Francisco Museum of Modern Art",
                location_lat=37.7857,
                location_lng=-122.4011,
                address="151 3rd St, San Francisco, CA 94103",
                site_type="Cultural Institution",
                peak_demand_mw=8.5,
                current_demand_mw=6.2,
                annual_consumption_mwh=45000,
                is_connected=True,
                connection_date=datetime(2021, 1, 20),
                priority_level=1,
                floor_area_sqm=33000,
                building_age_years=28,
                insulation_rating="A",
                description="World-class modern art museum requiring precise climate control for artwork preservation."
            ),
            DemandSite(
                name="LinkedIn Corporate Office",
                location_lat=37.7879,
                location_lng=-122.3972,
                address="222 2nd St, San Francisco, CA 94105",
                site_type="Corporate Office",
                peak_demand_mw=12.0,
                current_demand_mw=9.8,
                annual_consumption_mwh=68000,
                is_connected=True,
                connection_date=datetime(2020, 11, 5),
                priority_level=1,
                floor_area_sqm=48000,
                building_age_years=15,
                insulation_rating="A+",
                description="LinkedIn's flagship office building with high-efficiency HVAC and sustainable heating systems."
            ),
            DemandSite(
                name="Golden Gate University",
                location_lat=37.7874,
                location_lng=-122.4089,
                address="536 Mission St, San Francisco, CA 94105",
                site_type="Educational Institution",
                peak_demand_mw=15.5,
                current_demand_mw=11.3,
                annual_consumption_mwh=89000,
                is_connected=True,
                connection_date=datetime(2019, 9, 12),
                priority_level=2,
                floor_area_sqm=65000,
                building_age_years=45,
                insulation_rating="B+",
                description="Private university campus with multiple buildings requiring consistent heating for classrooms and dormitories."
            )
        ]
        
        # Add all heat centers and demand sites
        for hc in heat_centers:
            db.add(hc)
        for ds in demand_sites:
            db.add(ds)
        
        db.commit()
        
        # Refresh to get IDs
        db.refresh(heat_centers[0])  # Moscone Center
        db.refresh(heat_centers[1])  # Google SF
        db.refresh(demand_sites[0])  # SFMOMA
        db.refresh(demand_sites[1])  # LinkedIn
        db.refresh(demand_sites[2])  # Golden Gate University
        
        # Create Routes connecting heat centers to demand sites
        routes = [
            # Moscone Center to SFMOMA (very close)
            Route(
                heat_center_id=heat_centers[0].id,
                demand_site_id=demand_sites[0].id,
                distance_km=0.4,
                pipe_diameter_mm=300,
                max_flow_capacity_mw=10.0,
                current_flow_mw=6.2,
                supply_temp_celsius=85.0,
                return_temp_celsius=45.0,
                pressure_bar=18.0,
                heat_loss_percent=1.2,
                installation_year=2021,
                pipe_material="Pre-insulated Steel",
                insulation_type="Polyurethane Foam",
                status=RouteStatus.ACTIVE,
                is_bidirectional=False,
                construction_cost=850000,
                annual_maintenance_cost=25000
            ),
            # Google SF to LinkedIn (nearby in SOMA)
            Route(
                heat_center_id=heat_centers[1].id,
                demand_site_id=demand_sites[1].id,
                distance_km=0.6,
                pipe_diameter_mm=400,
                max_flow_capacity_mw=15.0,
                current_flow_mw=9.8,
                supply_temp_celsius=82.0,
                return_temp_celsius=42.0,
                pressure_bar=16.5,
                heat_loss_percent=1.5,
                installation_year=2020,
                pipe_material="Pre-insulated Steel",
                insulation_type="Mineral Wool",
                status=RouteStatus.ACTIVE,
                is_bidirectional=False,
                construction_cost=1200000,
                annual_maintenance_cost=35000
            ),
            # Moscone Center to Golden Gate University
            Route(
                heat_center_id=heat_centers[0].id,
                demand_site_id=demand_sites[2].id,
                distance_km=0.8,
                pipe_diameter_mm=450,
                max_flow_capacity_mw=18.0,
                current_flow_mw=11.3,
                supply_temp_celsius=88.0,
                return_temp_celsius=48.0,
                pressure_bar=19.0,
                heat_loss_percent=2.1,
                installation_year=2019,
                pipe_material="Pre-insulated Steel",
                insulation_type="Polyurethane Foam",
                status=RouteStatus.ACTIVE,
                is_bidirectional=False,
                construction_cost=1450000,
                annual_maintenance_cost=42000
            )
        ]
        
        # Add all routes
        for route in routes:
            db.add(route)
        
        db.commit()
        
        print("✅ Database seeded successfully with SF locations!")
        print(f"   - {len(heat_centers)} Heat Centers")
        print(f"   - {len(demand_sites)} Demand Sites") 
        print(f"   - {len(routes)} Routes")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()