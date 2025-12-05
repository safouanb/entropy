import React from 'react';
import { DollarSign, TrendingUp, Zap, Leaf, Calculator, Clock } from 'lucide-react';

interface PredictionResult {
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

interface SavingsPredictionResultsProps {
  results: PredictionResult;
  isLoading?: boolean;
}

const SavingsPredictionResults: React.FC<SavingsPredictionResultsProps> = ({ 
  results, 
  isLoading = false 
}) => {
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

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <h2 className="text-xl font-semibold text-gray-900">Calculating Predictions...</h2>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 pointer-events-none"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl pointer-events-none"></div>
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-cyan-400/5 pointer-events-none"></div>

      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Prediction Results</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-800">Annual Cost Savings</span>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(results.annual_cost_savings_usd)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {formatNumber(results.annual_energy_savings_mwh)} MWh energy saved
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-800">Return on Investment</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {formatNumber(results.roi_percent, 1)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Payback in {formatNumber(results.payback_period_years, 1)} years
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Energy Savings</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(results.annual_energy_savings_mwh)} MWh/yr
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">CO₂ Reduction</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(results.co2_reduction_tons_per_year)} tons/yr
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Heat Recovery</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(results.heat_recovery_potential_mwh)} MWh/yr
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Payback Period</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(results.payback_period_years, 1)} years
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Net Present Value</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(results.npv_usd)}
            </p>
          </div>
        </div>

        {results.formulas_used && (
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Calculation Methods</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">Energy Savings:</p>
                <p className="font-mono bg-white/50 p-2 rounded">{results.formulas_used.energy_savings}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Cost Savings:</p>
                <p className="font-mono bg-white/50 p-2 rounded">{results.formulas_used.cost_savings}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">CO₂ Reduction:</p>
                <p className="font-mono bg-white/50 p-2 rounded">{results.formulas_used.co2_reduction}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">ROI:</p>
                <p className="font-mono bg-white/50 p-2 rounded">{results.formulas_used.roi}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};

export default SavingsPredictionResults;