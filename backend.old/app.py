from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, and_, func
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import os

from models import (
    Base, HeatCenter, DemandSite, Route, SystemConfig, 
    HeatCenterMetrics, DemandSiteMetrics, RouteMetrics, RouteStatus
)

from prediction_models import (
    DataCenter, CarbonCredit, HeatSink, PredictionResult
)
from prediction_api import router as prediction_router

from database import engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="District Heating System API",
    description="API for managing district heating supply, demand, and distribution networks",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(prediction_router)

class HeatCenterBase(BaseModel):
    name: str
    location_lat: float
    location_lng: float
    address: Optional[str] = None
    max_capacity_mw: float
    current_output_mw: Optional[float] = 0.0
    efficiency_percent: Optional[float] = 85.0
    fuel_type: Optional[str] = None
    is_active: Optional[bool] = True
    commissioning_date: Optional[datetime] = None
    last_maintenance: Optional[datetime] = None
    description: Optional[str] = None

class HeatCenterCreate(HeatCenterBase):
    pass

class HeatCenterUpdate(BaseModel):
    name: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    address: Optional[str] = None
    max_capacity_mw: Optional[float] = None
    current_output_mw: Optional[float] = None
    efficiency_percent: Optional[float] = None
    fuel_type: Optional[str] = None
    is_active: Optional[bool] = None
    commissioning_date: Optional[datetime] = None
    last_maintenance: Optional[datetime] = None
    description: Optional[str] = None

class HeatCenterResponse(HeatCenterBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DemandSiteBase(BaseModel):
    name: str
    location_lat: float
    location_lng: float
    address: Optional[str] = None
    site_type: Optional[str] = None
    peak_demand_mw: float
    current_demand_mw: Optional[float] = 0.0
    annual_consumption_mwh: Optional[float] = None
    is_connected: Optional[bool] = False
    connection_date: Optional[datetime] = None
    priority_level: Optional[int] = 1
    floor_area_sqm: Optional[float] = None
    building_age_years: Optional[int] = None
    insulation_rating: Optional[str] = None
    description: Optional[str] = None

class DemandSiteCreate(DemandSiteBase):
    pass

class DemandSiteUpdate(BaseModel):
    name: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    address: Optional[str] = None
    site_type: Optional[str] = None
    peak_demand_mw: Optional[float] = None
    current_demand_mw: Optional[float] = None
    annual_consumption_mwh: Optional[float] = None
    is_connected: Optional[bool] = None
    connection_date: Optional[datetime] = None
    priority_level: Optional[int] = None
    floor_area_sqm: Optional[float] = None
    building_age_years: Optional[int] = None
    insulation_rating: Optional[str] = None
    description: Optional[str] = None

class DemandSiteResponse(DemandSiteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RouteBase(BaseModel):
    heat_center_id: int
    demand_site_id: int
    distance_km: float
    pipe_diameter_mm: Optional[int] = None
    max_flow_capacity_mw: float
    current_flow_mw: Optional[float] = 0.0
    supply_temp_celsius: Optional[float] = 80.0
    return_temp_celsius: Optional[float] = 40.0
    pressure_bar: Optional[float] = 16.0
    heat_loss_percent: Optional[float] = 2.0
    installation_year: Optional[int] = None
    pipe_material: Optional[str] = None
    insulation_type: Optional[str] = None
    status: Optional[RouteStatus] = RouteStatus.ACTIVE
    is_bidirectional: Optional[bool] = False
    maintenance_due: Optional[datetime] = None
    construction_cost: Optional[float] = None
    annual_maintenance_cost: Optional[float] = None

class RouteCreate(RouteBase):
    pass

class RouteResponse(RouteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

@app.get("/api/v1/heat-centers")
async def get_heat_centers(db: Session = Depends(get_db)):
    return db.query(HeatCenter).all()

@app.post("/api/v1/heat-centers")
async def create_heat_center(heat_center: HeatCenterBase, db: Session = Depends(get_db)):
    db_heat_center = HeatCenter(**heat_center.dict())
    db.add(db_heat_center)
    db.commit()
    db.refresh(db_heat_center)
    return db_heat_center

@app.get("/api/v1/heat-centers/{center_id}")
async def get_heat_center(center_id: int, db: Session = Depends(get_db)):
    heat_center = db.query(HeatCenter).filter(HeatCenter.id == center_id).first()
    if not heat_center:
        raise HTTPException(status_code=404, detail="Heat center not found")
    return heat_center

@app.put("/api/v1/heat-centers/{center_id}")
async def update_heat_center(center_id: int, heat_center: HeatCenterBase, db: Session = Depends(get_db)):
    db_heat_center = db.query(HeatCenter).filter(HeatCenter.id == center_id).first()
    if not db_heat_center:
        raise HTTPException(status_code=404, detail="Heat center not found")
    
    for key, value in heat_center.dict().items():
        setattr(db_heat_center, key, value)
    
    db.commit()
    db.refresh(db_heat_center)
    return db_heat_center

@app.delete("/api/v1/heat-centers/{center_id}")
async def delete_heat_center(center_id: int, db: Session = Depends(get_db)):
    db_heat_center = db.query(HeatCenter).filter(HeatCenter.id == center_id).first()
    if not db_heat_center:
        raise HTTPException(status_code=404, detail="Heat center not found")
    
    active_routes = db.query(Route).filter(Route.heat_center_id == center_id).count()
    if active_routes > 0:
        raise HTTPException(status_code=400, detail="Cannot delete heat center with active routes")
    
    db.delete(db_heat_center)
    db.commit()
    return {"message": "Heat center deleted successfully"}

@app.get("/api/v1/demand-sites")
async def get_demand_sites(db: Session = Depends(get_db)):
    return db.query(DemandSite).all()

@app.post("/api/v1/demand-sites")
async def create_demand_site(demand_site: DemandSiteBase, db: Session = Depends(get_db)):
    db_demand_site = DemandSite(**demand_site.dict())
    db.add(db_demand_site)
    db.commit()
    db.refresh(db_demand_site)
    return db_demand_site

@app.get("/api/v1/demand-sites/{site_id}")
async def get_demand_site(site_id: int, db: Session = Depends(get_db)):
    demand_site = db.query(DemandSite).filter(DemandSite.id == site_id).first()
    if not demand_site:
        raise HTTPException(status_code=404, detail="Demand site not found")
    return demand_site

@app.put("/api/v1/demand-sites/{site_id}")
async def update_demand_site(site_id: int, demand_site: DemandSiteBase, db: Session = Depends(get_db)):
    db_demand_site = db.query(DemandSite).filter(DemandSite.id == site_id).first()
    if not db_demand_site:
        raise HTTPException(status_code=404, detail="Demand site not found")
    
    for key, value in demand_site.dict().items():
        setattr(db_demand_site, key, value)
    
    db.commit()
    db.refresh(db_demand_site)
    return db_demand_site

@app.delete("/api/v1/demand-sites/{site_id}")
async def delete_demand_site(site_id: int, db: Session = Depends(get_db)):
    db_demand_site = db.query(DemandSite).filter(DemandSite.id == site_id).first()
    if not db_demand_site:
        raise HTTPException(status_code=404, detail="Demand site not found")
    
    active_routes = db.query(Route).filter(Route.demand_site_id == site_id).count()
    if active_routes > 0:
        raise HTTPException(status_code=400, detail="Cannot delete demand site with active routes")
    
    db.delete(db_demand_site)
    db.commit()
    return {"message": "Demand site deleted successfully"}

@app.get("/api/v1/routes")
async def get_routes(db: Session = Depends(get_db)):
    return db.query(Route).all()

@app.post("/api/v1/routes")
async def create_route(route: RouteBase, db: Session = Depends(get_db)):
    heat_center = db.query(HeatCenter).filter(HeatCenter.id == route.heat_center_id).first()
    demand_site = db.query(DemandSite).filter(DemandSite.id == route.demand_site_id).first()
    
    if not heat_center or not demand_site:
        raise HTTPException(status_code=404, detail="Heat center or demand site not found")
    
    existing_route = db.query(Route).filter(
        Route.heat_center_id == route.heat_center_id,
        Route.demand_site_id == route.demand_site_id
    ).first()
    
    if existing_route:
        raise HTTPException(status_code=400, detail="Route already exists between these locations")
    
    db_route = Route(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

@app.get("/api/v1/routes/{route_id}")
async def get_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

@app.put("/api/v1/routes/{route_id}")
async def update_route(route_id: int, route: RouteBase, db: Session = Depends(get_db)):
    db_route = db.query(Route).filter(Route.id == route_id).first()
    if not db_route:
        raise HTTPException(status_code=404, detail="Route not found")
    
    for key, value in route.dict().items():
        setattr(db_route, key, value)
    
    db.commit()
    db.refresh(db_route)
    return db_route

@app.delete("/api/v1/routes/{route_id}")
async def delete_route(route_id: int, db: Session = Depends(get_db)):
    db_route = db.query(Route).filter(Route.id == route_id).first()
    if not db_route:
        raise HTTPException(status_code=404, detail="Route not found")
    
    db.delete(db_route)
    db.commit()
    return {"message": "Route deleted successfully"}

@app.get("/api/v1/analytics/summary")
async def get_analytics_summary(db: Session = Depends(get_db)):
    heat_centers_count = db.query(HeatCenter).count()
    demand_sites_count = db.query(DemandSite).count()
    routes_count = db.query(Route).count()
    
    total_heat_capacity = db.query(func.sum(HeatCenter.heat_capacity_mw)).scalar() or 0
    total_demand = db.query(func.sum(DemandSite.heat_demand_mw)).scalar() or 0
    
    active_routes = db.query(Route).filter(Route.status == RouteStatus.ACTIVE).count()
    total_route_length = db.query(func.sum(Route.distance_km)).scalar() or 0
    
    return {
        "heat_centers": heat_centers_count,
        "demand_sites": demand_sites_count,
        "routes": routes_count,
        "total_heat_capacity_mw": total_heat_capacity,
        "total_demand_mw": total_demand,
        "active_routes": active_routes,
        "total_network_length_km": total_route_length
    }

@app.get("/api/v1/heat-centers/{center_id}/analytics")
async def get_heat_center_analytics(center_id: int, db: Session = Depends(get_db)):
    heat_center = db.query(HeatCenter).filter(HeatCenter.id == center_id).first()
    if not heat_center:
        raise HTTPException(status_code=404, detail="Heat center not found")
    
    connected_routes = db.query(Route).filter(Route.heat_center_id == center_id).all()
    connected_demand_sites = []
    
    for route in connected_routes:
        demand_site = db.query(DemandSite).filter(DemandSite.id == route.demand_site_id).first()
        if demand_site:
            connected_demand_sites.append({
                "id": demand_site.id,
                "name": demand_site.name,
                "heat_demand_mw": demand_site.heat_demand_mw,
                "route_distance_km": route.distance_km,
                "route_status": route.status.value
            })
    
    total_connected_demand = sum(site["heat_demand_mw"] for site in connected_demand_sites)
    capacity_utilization = (total_connected_demand / heat_center.heat_capacity_mw * 100) if heat_center.heat_capacity_mw > 0 else 0
    
    return {
        "heat_center": {
            "id": heat_center.id,
            "name": heat_center.name,
            "heat_capacity_mw": heat_center.heat_capacity_mw,
            "efficiency_percent": heat_center.efficiency_percent
        },
        "connected_demand_sites": connected_demand_sites,
        "total_connected_demand_mw": total_connected_demand,
        "capacity_utilization_percent": capacity_utilization,
        "routes_count": len(connected_routes)
    }

@app.get("/api/v1/demand-sites/{site_id}/analytics")
async def get_demand_site_analytics(site_id: int, db: Session = Depends(get_db)):
    demand_site = db.query(DemandSite).filter(DemandSite.id == site_id).first()
    if not demand_site:
        raise HTTPException(status_code=404, detail="Demand site not found")
    
    incoming_routes = db.query(Route).filter(Route.demand_site_id == site_id).all()
    heat_sources = []
    
    for route in incoming_routes:
        heat_center = db.query(HeatCenter).filter(HeatCenter.id == route.heat_center_id).first()
        if heat_center:
            heat_sources.append({
                "id": heat_center.id,
                "name": heat_center.name,
                "heat_capacity_mw": heat_center.heat_capacity_mw,
                "route_distance_km": route.distance_km,
                "route_status": route.status.value
            })
    
    total_available_capacity = sum(source["heat_capacity_mw"] for source in heat_sources)
    demand_coverage = (total_available_capacity / demand_site.heat_demand_mw * 100) if demand_site.heat_demand_mw > 0 else 0
    
    return {
        "demand_site": {
            "id": demand_site.id,
            "name": demand_site.name,
            "heat_demand_mw": demand_site.heat_demand_mw,
            "building_type": demand_site.building_type
        },
        "heat_sources": heat_sources,
        "total_available_capacity_mw": total_available_capacity,
        "demand_coverage_percent": demand_coverage,
        "routes_count": len(incoming_routes)
    }

@app.get("/api/v1/config")
async def get_config():
    config = {
        "map_settings": {
            "default_zoom": 12,
            "center_lat": 59.3293,
            "center_lng": 18.0686,
            "max_zoom": 18,
            "min_zoom": 8
        },
        "display_settings": {
            "route_color": "#ff4444",
            "heat_center_color": "#ff6b35",
            "demand_site_color": "#4ecdc4"
        }
    }
    return config

# Optional: Add configuration management endpoints
@app.post("/api/config")
async def set_config(key: str, value: str):
    config[key] = value
    return {"message": f"Config {key} set to {value}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)