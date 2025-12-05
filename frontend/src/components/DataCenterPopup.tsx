import React, { useState, useEffect } from 'react';
import { X, Server, Zap, MapPin, DollarSign, Leaf, TrendingUp, Calculator } from 'lucide-react';
import type { DataCenter, MapMarker } from '@/types';
import type { DataCenter as ApiDataCenter } from '@/services/api';

interface DataCenterPopupProps {
  dataCenter?: DataCenter;
  marker?: MapMarker;
  onClose: () => void;
}

interface PredictionData {
  annual_energy_savings_mwh: number;
  annual_cost_savings_usd: number;
  co2_reduction_tons_per_year: number;
  heat_recovery_potential_mwh: number;
  roi_percent: number;
  payback_period_years: number;
  npv_usd: number;
  formulas_used: {
    energy_savings: string;
    cost_savings: string;
    co2_reduction: string;
    heat_recovery: string;
    roi: string;
    payback_period: string;
    npv: string;
  };
}

const DataCenterPopup: React.FC<DataCenterPopupProps> = ({ dataCenter, marker, onClose }) => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const displayData = marker?.data || dataCenter;
  const isApiDataCenter = (data: any): data is ApiDataCenter => {
    return data && typeof data.total_it_load_kw !== 'undefined';
  };

  useEffect(() => {
    const fetchPredictionData = async () => {
      if (!displayData) return;

      try {
        setIsLoadingPrediction(true);
        setPredictionError(null);

        const dataCenterId = displayData.id;
        if (!dataCenterId) return;

        const response = await fetch('http://localhost:8000/api/v1/predictions/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data_center_id: dataCenterId,
            scenario: 'comprehensive',
            carbon_credit_id: 1,
            heat_sink_ids: [1],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPredictionData(data);
      } catch (error) {
        console.error('Error fetching prediction data:', error);
        setPredictionError('Failed to load prediction data');
      } finally {
        setIsLoadingPrediction(false);
      }
    };

    fetchPredictionData();
  }, [displayData]);

  if (!displayData) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const getCapacity = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.total_it_load_kw ? `${displayData.total_it_load_kw}kW` : 'N/A';
    }
    return (displayData as DataCenter).capacity || 'N/A';
  };

  const getPUE = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.pue ? formatNumber(displayData.pue, 2) : 'N/A';
    }
    return 'N/A';
  };

  const getUtilization = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.utilization_percent;
    }
    return undefined;
  };

  const getCoolingType = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.cooling_type;
    }
    return undefined;
  };

  const getLocation = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.location_lat && displayData.location_lng 
        ? `${formatNumber(displayData.location_lat, 4)}°N, ${formatNumber(Math.abs(displayData.location_lng), 4)}°W`
        : 'Location not available';
    }
    const legacyData = displayData as DataCenter;
    return legacyData.latitude && legacyData.longitude
      ? `${formatNumber(legacyData.latitude, 4)}°N, ${formatNumber(Math.abs(legacyData.longitude), 4)}°W`
      : 'Location not available';
  };

  const getElectricityCost = () => {
    if (isApiDataCenter(displayData)) {
      return displayData.electricity_cost_kwh;
    }
    return undefined;
  };

  return (
    <div className="relative w-96 max-w-[90vw] bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 pointer-events-none"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl pointer-events-none"></div>
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-cyan-400/5 pointer-events-none"></div>

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {displayData.name}
              </h3>
              <p className="text-sm text-gray-600">Data Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {displayData.description && (
          <div className="mb-4 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-sm text-gray-700 leading-relaxed">
              {displayData.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">IT Load</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {getCapacity()}
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">PUE</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {getPUE()}
            </p>
          </div>
        </div>

        {(getUtilization() !== undefined || getCoolingType()) && (
          <div className="space-y-3 mb-4">
            {getUtilization() !== undefined && (
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Utilization</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(getUtilization()!, 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(getUtilization()!, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {getCoolingType() && (
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Cooling Type</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {getCoolingType()}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</span>
          </div>
          <p className="text-sm text-gray-700">
            {getLocation()}
          </p>
        </div>

        {getElectricityCost() && (
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Energy Cost</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${formatNumber(getElectricityCost()!, 3)}/kWh
            </p>
          </div>
        )}

        {isLoadingPrediction && (
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Loading Predictions...</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-xs text-gray-600">Calculating savings potential...</span>
            </div>
          </div>
        )}

        {predictionError && (
          <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-3 border border-red-200/50 mb-4">
            <p className="text-sm text-red-700">{predictionError}</p>
          </div>
        )}

        {predictionData && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-800">Annual Savings</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(predictionData.annual_cost_savings_usd)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formatNumber(predictionData.annual_energy_savings_mwh)} MWh energy saved
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">ROI</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(predictionData.roi_percent, 1)}%
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Calculator className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Payback</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(predictionData.payback_period_years, 1)} yrs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Energy Savings</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatNumber(predictionData.annual_energy_savings_mwh)} MWh/yr
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">CO₂ Reduction</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatNumber(predictionData.co2_reduction_tons_per_year)} tons/yr
                </p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Heat Recovery</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatNumber(predictionData.heat_recovery_potential_mwh)} MWh/yr potential
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">NPV</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(predictionData.npv_usd)}
              </p>
            </div>

            {predictionData.formulas_used && (
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Formulas Used</span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>Energy:</strong> {predictionData.formulas_used.energy_savings}</p>
                  <p><strong>Cost:</strong> {predictionData.formulas_used.cost_savings}</p>
                  <p><strong>CO₂:</strong> {predictionData.formulas_used.co2_reduction}</p>
                  <p><strong>ROI:</strong> {predictionData.formulas_used.roi}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {('type' in displayData && (displayData.type === 'heat_center' || displayData.type === 'demand_site')) && (
          <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Connection Status</span>
            </div>
            <p className="text-sm text-blue-700">
              {'type' in displayData && displayData.type === 'heat_center' 
                ? 'Available for heat distribution'
                : 'Ready for heat connection'
              }
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};

export default DataCenterPopup;