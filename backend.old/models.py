from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class RouteStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    PLANNED = "planned"

class HeatCenter(Base):
    __tablename__ = "heat_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    address = Column(String(500))
    
    max_capacity_mw = Column(Float, nullable=False)
    current_output_mw = Column(Float, default=0.0)
    efficiency_percent = Column(Float, default=85.0)
    fuel_type = Column(String(100))
    
    is_active = Column(Boolean, default=True)
    commissioning_date = Column(DateTime)
    last_maintenance = Column(DateTime)
    
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    outgoing_routes = relationship("Route", foreign_keys="Route.heat_center_id", back_populates="heat_center")

class DemandSite(Base):
    __tablename__ = "demand_sites"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    address = Column(String(500))
    
    site_type = Column(String(100))
    peak_demand_mw = Column(Float, nullable=False)
    current_demand_mw = Column(Float, default=0.0)
    annual_consumption_mwh = Column(Float)
    
    is_connected = Column(Boolean, default=False)
    connection_date = Column(DateTime)
    priority_level = Column(Integer, default=1)
    
    floor_area_sqm = Column(Float)
    building_age_years = Column(Integer)
    insulation_rating = Column(String(10))
    
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    incoming_routes = relationship("Route", foreign_keys="Route.demand_site_id", back_populates="demand_site")

class Route(Base):
    __tablename__ = "routes"
    
    id = Column(Integer, primary_key=True, index=True)
    heat_center_id = Column(Integer, ForeignKey("heat_centers.id"), nullable=False, index=True)
    demand_site_id = Column(Integer, ForeignKey("demand_sites.id"), nullable=False, index=True)
    
    distance_km = Column(Float, nullable=False)
    pipe_diameter_mm = Column(Integer)
    max_flow_capacity_mw = Column(Float, nullable=False)
    current_flow_mw = Column(Float, default=0.0)
    
    supply_temp_celsius = Column(Float, default=80.0)
    return_temp_celsius = Column(Float, default=40.0)
    
    pressure_bar = Column(Float, default=16.0)
    heat_loss_percent = Column(Float, default=2.0)
    installation_year = Column(Integer)
    pipe_material = Column(String(100))
    insulation_type = Column(String(100))
    
    status = Column(Enum(RouteStatus), default=RouteStatus.ACTIVE)
    is_bidirectional = Column(Boolean, default=False)
    maintenance_due = Column(DateTime)
    
    construction_cost = Column(Float)
    annual_maintenance_cost = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    heat_center = relationship("HeatCenter", foreign_keys=[heat_center_id], back_populates="outgoing_routes")
    demand_site = relationship("DemandSite", foreign_keys=[demand_site_id], back_populates="incoming_routes")

class SystemConfig(Base):
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, index=True)
    config_key = Column(String(100), unique=True, nullable=False, index=True)
    config_value = Column(Text, nullable=False)
    config_type = Column(String(50), default="string")
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class HeatCenterMetrics(Base):
    __tablename__ = "heat_center_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    heat_center_id = Column(Integer, ForeignKey("heat_centers.id"), nullable=False, index=True)
    
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    output_mw = Column(Float, nullable=False)
    efficiency_percent = Column(Float)
    fuel_consumption = Column(Float)
    operational_cost_hour = Column(Float)
    
    co2_emissions_kg_hour = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DemandSiteMetrics(Base):
    __tablename__ = "demand_site_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    demand_site_id = Column(Integer, ForeignKey("demand_sites.id"), nullable=False, index=True)
    
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    demand_mw = Column(Float, nullable=False)
    supply_temp_celsius = Column(Float)
    return_temp_celsius = Column(Float)
    flow_rate_m3_hour = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RouteMetrics(Base):
    __tablename__ = "route_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False, index=True)
    
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    flow_mw = Column(Float, nullable=False)
    supply_temp_celsius = Column(Float)
    return_temp_celsius = Column(Float)
    pressure_bar = Column(Float)
    heat_loss_mw = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())