import React, { useMemo } from 'react';
import { Activity, Zap, Database, TrendingUp, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HeatCenter, DemandSite } from '@/services/api';

interface StatsSidebarProps {
  heatCenters: HeatCenter[];
  demandSites: DemandSite[];
  isLoading?: boolean;
}

const StatsSidebar: React.FC<StatsSidebarProps> = ({ 
  heatCenters = [], 
  demandSites = [], 
  isLoading = false 
}) => {
  // Calculate statistics with proper error handling
  const stats = useMemo(() => {
    try {
      // Heat Centers Statistics
      const activeHeatCenters = heatCenters.filter(center => 
        center.is_active === true
      ).length;
      const inactiveHeatCenters = heatCenters.length - activeHeatCenters;
      
      // Demand Sites Statistics  
      const activeDemandSites = demandSites.filter(site => 
        site.is_connected === true
      ).length;
      const inactiveDemandSites = demandSites.length - activeDemandSites;
      
      // Energy Statistics
      const maxHeatOutput = heatCenters.reduce((max, center) => {
        const output = center.current_output_mw || 0;
        return output > max ? output : max;
      }, 0);
      
      const maxDemand = demandSites.reduce((max, site) => {
        const demand = site.peak_demand_mw || 0;
        return demand > max ? demand : max;
      }, 0);
      
      const totalCapacity = heatCenters.reduce((sum, center) => {
        return sum + (center.current_output_mw || 0);
      }, 0);
      
      const totalDemand = demandSites.reduce((sum, site) => {
        return sum + (site.peak_demand_mw || 0);
      }, 0);

      return {
        heatCenters: {
          active: activeHeatCenters,
          inactive: inactiveHeatCenters,
          total: heatCenters.length,
          maxOutput: maxHeatOutput,
          totalCapacity
        },
        demandSites: {
          active: activeDemandSites,
          inactive: inactiveDemandSites,
          total: demandSites.length,
          maxDemand,
          totalDemand
        },
        overall: {
          totalSites: heatCenters.length + demandSites.length,
          activeConnections: activeHeatCenters + activeDemandSites,
          energyEfficiency: totalCapacity > 0 ? ((totalDemand / totalCapacity) * 100) : 0
        }
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        heatCenters: { active: 0, inactive: 0, total: 0, maxOutput: 0, totalCapacity: 0 },
        demandSites: { active: 0, inactive: 0, total: 0, maxDemand: 0, totalDemand: 0 },
        overall: { totalSites: 0, activeConnections: 0, energyEfficiency: 0 }
      };
    }
  }, [heatCenters, demandSites]);

  const formatEnergy = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} GW`;
    }
    return `${value.toFixed(1)} MW`;
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
        </div>

        {/* Heat Centers Card */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="h-5 w-5" />
              Heat Centers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active</span>
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                {stats.heatCenters.active}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Inactive</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {stats.heatCenters.inactive}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Max Output</span>
                <span className="text-sm font-bold text-orange-600">
                  {formatEnergy(stats.heatCenters.maxOutput)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Capacity</span>
                <span className="text-sm font-bold text-orange-600">
                  {formatEnergy(stats.heatCenters.totalCapacity)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Sites Card */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Building2 className="h-5 w-5" />
              Demand Sites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active</span>
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                {stats.demandSites.active}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Inactive</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {stats.demandSites.inactive}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Peak Demand</span>
                <span className="text-sm font-bold text-blue-600">
                  {formatEnergy(stats.demandSites.maxDemand)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Demand</span>
                <span className="text-sm font-bold text-blue-600">
                  {formatEnergy(stats.demandSites.totalDemand)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics Card */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="h-5 w-5" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Sites</span>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                {stats.overall.totalSites}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active Connections</span>
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                {stats.overall.activeConnections}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">System Utilization</span>
              <span className="text-sm font-bold text-purple-600">
                {stats.overall.energyEfficiency.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-gray-600" />
            <div className="text-lg font-bold text-gray-900">{stats.heatCenters.total}</div>
            <div className="text-xs text-gray-500">Heat Centers</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Database className="h-4 w-4 mx-auto mb-1 text-gray-600" />
            <div className="text-lg font-bold text-gray-900">{stats.demandSites.total}</div>
            <div className="text-xs text-gray-500">Demand Sites</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;