from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

Base = declarative_base()

class DataCenter(Base):
    __tablename__ = "data_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    address = Column(String)
    dc_type = Column(String, default="colocation")
    total_it_load_kw = Column(Float, nullable=False)
    pue = Column(Float, default=1.5)
    utilization_percent = Column(Float, default=70.0)
    cooling_type = Column(String, default="air")
    energy_source = Column(String, default="grid")
    renewable_percent = Column(Float, default=0.0)
    electricity_cost_kwh = Column(Float, default=0.15)
    operating_hours_year = Column(Integer, default=8760)
    heat_recovery_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("PredictionResult", back_populates="data_center")

class CarbonCredit(Base):
    __tablename__ = "carbon_credits"
    
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    credit_type = Column(String, default="renewable_energy")
    price_per_ton = Column(Float, nullable=False)
    available_tons = Column(Float, nullable=False)
    vintage_year = Column(Integer)
    verification_standard = Column(String, default="VCS")
    location = Column(String)
    project_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("PredictionResult", back_populates="carbon_credit")

class HeatSink(Base):
    __tablename__ = "heat_sinks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    address = Column(String)
    sink_type = Column(String, default="district_heating")
    capacity_mw = Column(Float, nullable=False)
    current_demand_mw = Column(Float, default=0.0)
    temperature_requirement_c = Column(Float, default=60.0)
    seasonal_factor = Column(Float, default=1.0)
    connection_cost_per_km = Column(Float, default=100000.0)
    heat_price_per_mwh = Column(Float, default=50.0)
    operating_hours_year = Column(Integer, default=8760)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("PredictionResult", back_populates="heat_sink")

class PredictionResult(Base):
    __tablename__ = "prediction_results"
    
    id = Column(Integer, primary_key=True, index=True)
    data_center_id = Column(Integer, ForeignKey("data_centers.id"), nullable=False)
    carbon_credit_id = Column(Integer, ForeignKey("carbon_credits.id"))
    heat_sink_id = Column(Integer, ForeignKey("heat_sinks.id"))
    scenario_name = Column(String, default="base_case")
    analysis_years = Column(Integer, default=10)
    
    total_capex = Column(Float)
    annual_opex = Column(Float)
    annual_savings = Column(Float)
    
    net_present_value = Column(Float)
    internal_rate_return = Column(Float)
    payback_period_years = Column(Float)
    investment_grade = Column(String)
    
    annual_co2_reduction_kg = Column(Float)
    annual_heat_recovery_kwh = Column(Float)
    
    detailed_results = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    data_center = relationship("DataCenter", back_populates="predictions")
    carbon_credit = relationship("CarbonCredit", back_populates="predictions")
    heat_sink = relationship("HeatSink", back_populates="predictions")

class PredictionScenario(Base):
    __tablename__ = "prediction_scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    base_parameters = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataCenterRequest(BaseModel):
    name: str
    location_lat: float
    location_lng: float
    address: Optional[str] = ""
    dc_type: Optional[str] = "colocation"
    total_it_load_kw: float
    pue: Optional[float] = 1.5
    utilization_percent: Optional[float] = 70.0
    cooling_type: Optional[str] = "air"
    energy_source: Optional[str] = "grid"
    renewable_percent: Optional[float] = 0.0
    electricity_cost_kwh: Optional[float] = 0.15
    operating_hours_year: Optional[int] = 8760
    heat_recovery_enabled: Optional[bool] = False

class CarbonCreditRequest(BaseModel):
    project_name: str
    credit_type: Optional[str] = "renewable_energy"
    price_per_ton: float
    available_tons: float
    vintage_year: Optional[int] = None
    verification_standard: Optional[str] = "VCS"
    location: Optional[str] = ""
    project_description: Optional[str] = ""

class HeatSinkRequest(BaseModel):
    name: str
    location_lat: float
    location_lng: float
    address: Optional[str] = ""
    sink_type: Optional[str] = "district_heating"
    capacity_mw: float
    current_demand_mw: Optional[float] = 0.0
    temperature_requirement_c: Optional[float] = 60.0
    seasonal_factor: Optional[float] = 1.0
    connection_cost_per_km: Optional[float] = 100000.0
    heat_price_per_mwh: Optional[float] = 50.0
    operating_hours_year: Optional[int] = 8760

class PredictionRequest(BaseModel):
    data_center_id: int
    carbon_credit_id: Optional[int] = None
    heat_sink_id: Optional[int] = None
    analysis_years: Optional[int] = 10
    scenario_name: Optional[str] = "base_case"