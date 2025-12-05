import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, Zap, Thermometer, DollarSign, Building, Server } from 'lucide-react';

interface DataCenterInputFormProps {
  onSubmit: (data: DataCenterFormData) => void;
  initialData?: Partial<DataCenterFormData>;
  isLoading?: boolean;
}

export interface DataCenterFormData {
  // Basic Information
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  
  // Data Center Type and Specifications
  dc_type: 'hyperscale' | 'enterprise' | 'colocation' | 'edge' | 'cloud';
  total_it_load_kw: number;
  pue: number;
  cooling_type: 'air_cooled' | 'water_cooled' | 'liquid_cooled' | 'immersion' | 'hybrid';
  energy_source: 'grid' | 'renewable' | 'hybrid' | 'diesel';
  
  // Physical Specifications
  floor_area_sqm?: number;
  rack_count?: number;
  server_count?: number;
  storage_capacity_tb?: number;
  
  // Operational Parameters
  utilization_percent: number;
  operating_hours_year: number;
  ambient_temp_celsius: number;
  
  // Cost Parameters
  electricity_cost_kwh: number;
  cooling_cost_kwh?: number;
  maintenance_cost_annual?: number;
}

const DataCenterInputForm: React.FC<DataCenterInputFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false
}) => {
  const [formData, setFormData] = useState<DataCenterFormData>({
    name: '',
    address: '',
    location_lat: 37.7749, // Default to San Francisco
    location_lng: -122.4194,
    dc_type: 'enterprise',
    total_it_load_kw: 1000,
    pue: 1.5,
    cooling_type: 'air_cooled',
    energy_source: 'grid',
    utilization_percent: 70,
    operating_hours_year: 8760,
    ambient_temp_celsius: 25,
    electricity_cost_kwh: 0.12,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof DataCenterFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Data center name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.total_it_load_kw <= 0) {
      newErrors.total_it_load_kw = 'IT load must be greater than 0';
    }
    
    if (formData.pue < 1.0) {
      newErrors.pue = 'PUE must be at least 1.0';
    }
    
    if (formData.utilization_percent < 0 || formData.utilization_percent > 100) {
      newErrors.utilization_percent = 'Utilization must be between 0 and 100%';
    }
    
    if (formData.electricity_cost_kwh <= 0) {
      newErrors.electricity_cost_kwh = 'Electricity cost must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          Data Center Specifications
        </CardTitle>
        <CardDescription>
          Enter your data center details to calculate energy savings and carbon reduction potential
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Data Center Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., San Francisco DC-1"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_lat">Latitude</Label>
                <Input
                  id="location_lat"
                  type="number"
                  step="0.000001"
                  value={formData.location_lat}
                  onChange={(e) => handleInputChange('location_lat', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_lng">Longitude</Label>
                <Input
                  id="location_lng"
                  type="number"
                  step="0.000001"
                  value={formData.location_lng}
                  onChange={(e) => handleInputChange('location_lng', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Technical Specifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Technical Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dc_type">Data Center Type</Label>
                <Select value={formData.dc_type} onValueChange={(value) => handleInputChange('dc_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyperscale">Hyperscale</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="colocation">Colocation</SelectItem>
                    <SelectItem value="edge">Edge</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total_it_load_kw">Total IT Load (kW) *</Label>
                <Input
                  id="total_it_load_kw"
                  type="number"
                  min="1"
                  value={formData.total_it_load_kw}
                  onChange={(e) => handleInputChange('total_it_load_kw', parseFloat(e.target.value))}
                  className={errors.total_it_load_kw ? 'border-red-500' : ''}
                />
                {errors.total_it_load_kw && <p className="text-sm text-red-500">{errors.total_it_load_kw}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pue">Power Usage Effectiveness (PUE) *</Label>
                <Input
                  id="pue"
                  type="number"
                  step="0.1"
                  min="1.0"
                  value={formData.pue}
                  onChange={(e) => handleInputChange('pue', parseFloat(e.target.value))}
                  className={errors.pue ? 'border-red-500' : ''}
                />
                {errors.pue && <p className="text-sm text-red-500">{errors.pue}</p>}
                <p className="text-xs text-gray-500">Typical range: 1.2 - 2.5</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cooling_type">Cooling Type</Label>
                <Select value={formData.cooling_type} onValueChange={(value) => handleInputChange('cooling_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air_cooled">Air Cooled</SelectItem>
                    <SelectItem value="water_cooled">Water Cooled</SelectItem>
                    <SelectItem value="liquid_cooled">Liquid Cooled</SelectItem>
                    <SelectItem value="immersion">Immersion Cooling</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energy_source">Primary Energy Source</Label>
              <Select value={formData.energy_source} onValueChange={(value) => handleInputChange('energy_source', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Electricity</SelectItem>
                  <SelectItem value="renewable">Renewable Energy</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Grid + Renewable)</SelectItem>
                  <SelectItem value="diesel">Diesel Generators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Physical Specifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Physical Specifications (Optional)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor_area_sqm">Floor Area (m²)</Label>
                <Input
                  id="floor_area_sqm"
                  type="number"
                  min="0"
                  value={formData.floor_area_sqm || ''}
                  onChange={(e) => handleInputChange('floor_area_sqm', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rack_count">Number of Racks</Label>
                <Input
                  id="rack_count"
                  type="number"
                  min="0"
                  value={formData.rack_count || ''}
                  onChange={(e) => handleInputChange('rack_count', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="server_count">Number of Servers</Label>
                <Input
                  id="server_count"
                  type="number"
                  min="0"
                  value={formData.server_count || ''}
                  onChange={(e) => handleInputChange('server_count', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storage_capacity_tb">Storage Capacity (TB)</Label>
                <Input
                  id="storage_capacity_tb"
                  type="number"
                  min="0"
                  value={formData.storage_capacity_tb || ''}
                  onChange={(e) => handleInputChange('storage_capacity_tb', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Operational Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Operational Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utilization_percent">Average Utilization (%)</Label>
                <Input
                  id="utilization_percent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.utilization_percent}
                  onChange={(e) => handleInputChange('utilization_percent', parseFloat(e.target.value))}
                  className={errors.utilization_percent ? 'border-red-500' : ''}
                />
                {errors.utilization_percent && <p className="text-sm text-red-500">{errors.utilization_percent}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operating_hours_year">Operating Hours/Year</Label>
                <Input
                  id="operating_hours_year"
                  type="number"
                  min="1"
                  max="8760"
                  value={formData.operating_hours_year}
                  onChange={(e) => handleInputChange('operating_hours_year', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ambient_temp_celsius">Ambient Temperature (°C)</Label>
                <Input
                  id="ambient_temp_celsius"
                  type="number"
                  value={formData.ambient_temp_celsius}
                  onChange={(e) => handleInputChange('ambient_temp_celsius', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Cost Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Cost Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity_cost_kwh">Electricity Cost ($/kWh) *</Label>
                <Input
                  id="electricity_cost_kwh"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.electricity_cost_kwh}
                  onChange={(e) => handleInputChange('electricity_cost_kwh', parseFloat(e.target.value))}
                  className={errors.electricity_cost_kwh ? 'border-red-500' : ''}
                />
                {errors.electricity_cost_kwh && <p className="text-sm text-red-500">{errors.electricity_cost_kwh}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cooling_cost_kwh">Additional Cooling Cost ($/kWh)</Label>
                <Input
                  id="cooling_cost_kwh"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.cooling_cost_kwh || ''}
                  onChange={(e) => handleInputChange('cooling_cost_kwh', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenance_cost_annual">Annual Maintenance Cost ($)</Label>
                <Input
                  id="maintenance_cost_annual"
                  type="number"
                  min="0"
                  value={formData.maintenance_cost_annual || ''}
                  onChange={(e) => handleInputChange('maintenance_cost_annual', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-2"
            >
              {isLoading ? 'Processing...' : 'Calculate Savings Prediction'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataCenterInputForm;