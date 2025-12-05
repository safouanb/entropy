from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
from prediction_models import DataCenter, CarbonCredit, HeatSink, PredictionResult
from prediction_engine import DataCenterPredictionEngine
from typing import List, Dict, Optional
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class PredictionService:
    
    def __init__(self, database_url: str = None):
        if database_url is None:
            from database import DATABASE_URL
            database_url = DATABASE_URL
        self.engine = create_engine(database_url)
        self.prediction_engine = DataCenterPredictionEngine()
    
    def create_data_center(self, session: Session, data_center_data: Dict) -> DataCenter:
        
        try:
            data_center = DataCenter(
                name=data_center_data["name"],
                location_lat=data_center_data["location_lat"],
                location_lng=data_center_data["location_lng"],
                address=data_center_data.get("address", ""),
                dc_type=data_center_data.get("dc_type", "colocation"),
                total_it_load_kw=data_center_data["total_it_load_kw"],
                pue=data_center_data.get("pue", 1.5),
                utilization_percent=data_center_data.get("utilization_percent", 70.0),
                cooling_type=data_center_data.get("cooling_type", "air"),
                energy_source=data_center_data.get("energy_source", "grid"),
                renewable_percent=data_center_data.get("renewable_percent", 0.0),
                electricity_cost_kwh=data_center_data.get("electricity_cost_kwh", 0.15),
                operating_hours_year=data_center_data.get("operating_hours_year", 8760),
                heat_recovery_enabled=data_center_data.get("heat_recovery_enabled", False),
                created_at=datetime.utcnow()
            )
            
            session.add(data_center)
            session.commit()
            session.refresh(data_center)
            
            logger.info(f"Created data center: {data_center.name}")
            return data_center
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating data center: {str(e)}")
            raise
    
    def create_carbon_credit(self, session: Session, carbon_credit_data: Dict) -> CarbonCredit:
        
        try:
            carbon_credit = CarbonCredit(
                project_name=carbon_credit_data["project_name"],
                credit_type=carbon_credit_data.get("credit_type", "renewable_energy"),
                price_per_ton=carbon_credit_data["price_per_ton"],
                available_tons=carbon_credit_data["available_tons"],
                vintage_year=carbon_credit_data.get("vintage_year", datetime.now().year),
                verification_standard=carbon_credit_data.get("verification_standard", "VCS"),
                location=carbon_credit_data.get("location", ""),
                project_description=carbon_credit_data.get("project_description", ""),
                created_at=datetime.utcnow()
            )
            
            session.add(carbon_credit)
            session.commit()
            session.refresh(carbon_credit)
            
            logger.info(f"Created carbon credit: {carbon_credit.project_name}")
            return carbon_credit
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating carbon credit: {str(e)}")
            raise
    
    def create_heat_sink(self, session: Session, heat_sink_data: Dict) -> HeatSink:
        
        try:
            heat_sink = HeatSink(
                name=heat_sink_data["name"],
                location_lat=heat_sink_data["location_lat"],
                location_lng=heat_sink_data["location_lng"],
                address=heat_sink_data.get("address", ""),
                sink_type=heat_sink_data.get("sink_type", "district_heating"),
                capacity_mw=heat_sink_data["capacity_mw"],
                current_demand_mw=heat_sink_data.get("current_demand_mw", 0.0),
                temperature_requirement_c=heat_sink_data.get("temperature_requirement_c", 60.0),
                seasonal_factor=heat_sink_data.get("seasonal_factor", 1.0),
                connection_cost_per_km=heat_sink_data.get("connection_cost_per_km", 100000.0),
                heat_price_per_mwh=heat_sink_data.get("heat_price_per_mwh", 50.0),
                operating_hours_year=heat_sink_data.get("operating_hours_year", 8760),
                created_at=datetime.utcnow()
            )
            
            session.add(heat_sink)
            session.commit()
            session.refresh(heat_sink)
            
            logger.info(f"Created heat sink: {heat_sink.name}")
            return heat_sink
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating heat sink: {str(e)}")
            raise

    def calculate_comprehensive_prediction(self, 
                                         session: Session,
                                         data_center_id: int,
                                         carbon_credit_id: Optional[int] = None,
                                         heat_sink_id: Optional[int] = None,
                                         analysis_years: int = 10,
                                         scenario_name: str = "base_case",
                                         custom_params: Optional[Dict] = None) -> Dict:
        
        try:
            data_center = session.query(DataCenter).filter(DataCenter.id == data_center_id).first()
            if not data_center:
                raise ValueError(f"Data center with ID {data_center_id} not found")
            
            # Apply custom parameters if provided
            if custom_params is None:
                custom_params = {}
            
            # Override data center values with custom parameters
            effective_pue = custom_params.get('pue', data_center.pue)
            effective_electricity_cost = custom_params.get('electricity_cost_kwh', data_center.electricity_cost_kwh)
            
            carbon_credit = None
            if carbon_credit_id:
                carbon_credit = session.query(CarbonCredit).filter(CarbonCredit.id == carbon_credit_id).first()
            
            heat_sink = None
            distance_to_sink_km = 0.0
            if heat_sink_id:
                heat_sink = session.query(HeatSink).filter(HeatSink.id == heat_sink_id).first()
                if heat_sink:
                    distance_to_sink_km = self.prediction_engine.calculate_distance_to_heat_sink(
                        data_center.location_lat, data_center.location_lng,
                        heat_sink.location_lat, heat_sink.location_lng
                    )
            
            # Calculate base case metrics (using original data center values)
            base_energy_metrics = self.prediction_engine.calculate_energy_consumption(
                it_load_kw=data_center.total_it_load_kw,
                pue=data_center.pue,  # Use original PUE
                utilization_percent=data_center.utilization_percent,
                operating_hours_year=data_center.operating_hours_year
            )
            
            base_opex_metrics = self.prediction_engine.calculate_opex(
                it_load_kw=data_center.total_it_load_kw,
                annual_energy_consumption_kwh=base_energy_metrics['annual_energy_consumption_kwh'],
                heat_recovery_enabled=False,  # No heat recovery in base case
                distance_to_sink_km=0,
                electricity_rate_per_kwh=data_center.electricity_cost_kwh  # Use original electricity cost
            )
            
            # Calculate improved case metrics (using custom parameters)
            energy_metrics = self.prediction_engine.calculate_energy_consumption(
                it_load_kw=data_center.total_it_load_kw,
                pue=effective_pue,  # Use custom PUE if provided
                utilization_percent=data_center.utilization_percent,
                operating_hours_year=data_center.operating_hours_year
            )
            
            carbon_metrics = self.prediction_engine.calculate_carbon_emissions(
                annual_energy_kwh=energy_metrics['annual_energy_consumption_kwh'],
                renewable_percent=data_center.renewable_percent
            )
            
            heat_recovery_metrics = self.prediction_engine.calculate_heat_recovery_potential(
                it_load_kw=data_center.total_it_load_kw,
                utilization_percent=data_center.utilization_percent,
                operating_hours_year=data_center.operating_hours_year,
                distance_to_sink_km=distance_to_sink_km
            )
            
            capex_metrics = self.prediction_engine.calculate_capex(
                it_load_kw=data_center.total_it_load_kw,
                heat_recovery_enabled=heat_sink is not None,  # Enable heat recovery if heat sink is available
                distance_to_sink_km=distance_to_sink_km,
                connection_cost_per_km=heat_sink.connection_cost_per_km if heat_sink else 100000
            )
            
            opex_metrics = self.prediction_engine.calculate_opex(
                it_load_kw=data_center.total_it_load_kw,
                annual_energy_consumption_kwh=energy_metrics['annual_energy_consumption_kwh'],
                heat_recovery_enabled=heat_sink is not None,  # Enable heat recovery if heat sink is available
                distance_to_sink_km=distance_to_sink_km,
                electricity_rate_per_kwh=effective_electricity_cost  # Use custom electricity cost if provided
            )
            
            base_case = {
                'annual_energy_consumption_kwh': base_energy_metrics['annual_energy_consumption_kwh'],
                'total_project_capex': capex_metrics['base_data_center_capex'],
                'total_annual_opex': base_opex_metrics['total_annual_opex'],
                'annual_co2_emissions_kg': base_energy_metrics['annual_energy_consumption_kwh'] * 0.32  # Base CO2 emissions
            }
            
            improved_case = {
                'annual_energy_consumption_kwh': energy_metrics['annual_energy_consumption_kwh'],
                'total_project_capex': capex_metrics['total_project_capex'],
                'total_annual_opex': opex_metrics['total_annual_opex'],
                'annual_co2_emissions_kg': carbon_metrics['annual_co2_emissions_kg'],
                'annual_gas_cost_savings': heat_recovery_metrics.get('annual_gas_cost_savings', 0),
                'co2_avoided_kg_per_year': heat_recovery_metrics.get('co2_avoided_kg_per_year', 0)
            }
            
            savings_metrics = self.prediction_engine.calculate_savings_scenarios(base_case, improved_case)
            
            financial_metrics = self.prediction_engine.calculate_financial_metrics(
                total_capex=savings_metrics['additional_capex_required'],
                annual_savings=savings_metrics['net_annual_savings'],
                project_years=analysis_years
            )
            
            yearly_breakdown = self.prediction_engine.generate_yearly_breakdown(
                annual_savings=savings_metrics['net_annual_savings'],
                project_years=analysis_years
            )
            
            sensitivity_analysis = self.prediction_engine.perform_sensitivity_analysis(
                base_inputs={
                    'it_load_kw': data_center.total_it_load_kw,
                    'pue': data_center.pue,
                    'electricity_cost': data_center.electricity_cost_kwh
                },
                sensitivity_ranges={
                    'it_load_kw': [data_center.total_it_load_kw * 0.8, data_center.total_it_load_kw * 1.2],
                    'pue': [data_center.pue * 0.9, data_center.pue * 1.1],
                    'electricity_cost': [data_center.electricity_cost_kwh * 0.8, data_center.electricity_cost_kwh * 1.2]
                }
            )
            
            prediction_result = {
                'scenario_name': scenario_name,
                'data_center_id': data_center_id,
                'carbon_credit_id': carbon_credit_id,
                'heat_sink_id': heat_sink_id,
                'analysis_years': analysis_years,
                'distance_to_sink_km': distance_to_sink_km,
                'energy_metrics': energy_metrics,
                'carbon_metrics': carbon_metrics,
                'heat_recovery_metrics': heat_recovery_metrics,
                'capex_metrics': capex_metrics,
                'opex_metrics': opex_metrics,
                'savings_metrics': savings_metrics,
                'financial_metrics': financial_metrics,
                'yearly_breakdown': yearly_breakdown,
                'sensitivity_analysis': sensitivity_analysis,
                'created_at': datetime.utcnow().isoformat()
            }
            
            logger.info(f"Completed prediction calculation for data center {data_center_id}")
            return prediction_result
            
        except Exception as e:
            logger.error(f"Error calculating prediction: {str(e)}")
            raise

    def save_prediction_result(self, session: Session, prediction_data: Dict) -> PredictionResult:
        
        try:
            prediction_result = PredictionResult(
                data_center_id=prediction_data["data_center_id"],
                carbon_credit_id=prediction_data.get("carbon_credit_id"),
                heat_sink_id=prediction_data.get("heat_sink_id"),
                scenario_name=prediction_data["scenario_name"],
                analysis_years=prediction_data["analysis_years"],
                
                total_capex=prediction_data["capex_metrics"]["total_project_capex"],
                annual_opex=prediction_data["opex_metrics"]["total_annual_opex"],
                annual_savings=prediction_data["savings_metrics"]["net_annual_savings"],
                
                net_present_value=prediction_data["financial_metrics"]["net_present_value"],
                internal_rate_return=prediction_data["financial_metrics"]["internal_rate_of_return"],
                payback_period_years=prediction_data["financial_metrics"]["simple_payback_years"],
                investment_grade=prediction_data["financial_metrics"]["investment_grade"],
                
                annual_co2_reduction_kg=prediction_data["savings_metrics"]["annual_co2_reduction_kg"],
                annual_heat_recovery_kwh=prediction_data["heat_recovery_metrics"]["annual_heat_recovery_kwh"],
                
                detailed_results=json.dumps(prediction_data),
                created_at=datetime.utcnow()
            )
            
            session.add(prediction_result)
            session.commit()
            session.refresh(prediction_result)
            
            logger.info(f"Saved prediction result with ID: {prediction_result.id}")
            return prediction_result
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error saving prediction result: {str(e)}")
            raise

    def get_all_data_centers(self, session: Session) -> List[DataCenter]:
        return session.query(DataCenter).all()

    def get_all_carbon_credits(self, session: Session) -> List[CarbonCredit]:
        return session.query(CarbonCredit).all()

    def get_all_heat_sinks(self, session: Session) -> List[HeatSink]:
        return session.query(HeatSink).all()

    def get_predictions_for_data_center(self, session: Session, data_center_id: int) -> List[PredictionResult]:
        return session.query(PredictionResult).filter(PredictionResult.data_center_id == data_center_id).all()