import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Leaf, TrendingUp, Globe, Calendar, DollarSign } from 'lucide-react';

interface CarbonCreditFormProps {
  onSubmit: (data: CarbonCreditFormData) => void;
  initialData?: Partial<CarbonCreditFormData>;
  isLoading?: boolean;
  showCreateNew?: boolean;
}

export interface CarbonCreditFormData {
  // Basic Information
  name: string;
  price_per_ton_co2: number;
  validity_years: number;
  
  // Certification and Standards
  certification_standard: string;
  project_type: string;
  region: string;
  vintage_year: number;
  
  // Market Data
  market_price_trend: number; // Annual price increase percentage
  availability_tons?: number;
  
  // Additional Details
  description?: string;
}

const CarbonCreditForm: React.FC<CarbonCreditFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false,
  showCreateNew = true
}) => {
  const [formData, setFormData] = useState<CarbonCreditFormData>({
    name: '',
    price_per_ton_co2: 25.0, // Default market price
    validity_years: 5,
    certification_standard: 'VCS',
    project_type: 'Renewable Energy',
    region: 'North America',
    vintage_year: new Date().getFullYear(),
    market_price_trend: 5.0, // 5% annual increase
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CarbonCreditFormData, value: any) => {
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
      newErrors.name = 'Carbon credit name is required';
    }
    
    if (formData.price_per_ton_co2 <= 0) {
      newErrors.price_per_ton_co2 = 'Price per ton must be greater than 0';
    }
    
    if (formData.validity_years <= 0) {
      newErrors.validity_years = 'Validity years must be greater than 0';
    }
    
    if (!formData.certification_standard.trim()) {
      newErrors.certification_standard = 'Certification standard is required';
    }
    
    if (!formData.project_type.trim()) {
      newErrors.project_type = 'Project type is required';
    }
    
    if (formData.vintage_year < 2000 || formData.vintage_year > new Date().getFullYear() + 5) {
      newErrors.vintage_year = 'Vintage year must be between 2000 and ' + (new Date().getFullYear() + 5);
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

  // Predefined options for dropdowns
  const certificationStandards = [
    'VCS (Verified Carbon Standard)',
    'Gold Standard',
    'CDM (Clean Development Mechanism)',
    'CAR (Climate Action Reserve)',
    'ACR (American Carbon Registry)',
    'Plan Vivo',
    'Other'
  ];

  const projectTypes = [
    'Renewable Energy',
    'Energy Efficiency',
    'Forestry and Land Use',
    'Methane Capture',
    'Industrial Processes',
    'Transportation',
    'Waste Management',
    'Agriculture',
    'Blue Carbon',
    'Direct Air Capture',
    'Other'
  ];

  const regions = [
    'North America',
    'South America',
    'Europe',
    'Asia-Pacific',
    'Africa',
    'Middle East',
    'Global',
    'Other'
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          Carbon Credit Details
        </CardTitle>
        <CardDescription>
          {showCreateNew 
            ? "Configure carbon credit parameters for your savings calculation"
            : "Select or configure carbon credit options for offset calculations"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Pricing Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Carbon Credit Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., California Forest Carbon Credits"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price_per_ton_co2">Price per Ton CO₂ ($) *</Label>
                <Input
                  id="price_per_ton_co2"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_per_ton_co2}
                  onChange={(e) => handleInputChange('price_per_ton_co2', parseFloat(e.target.value))}
                  className={errors.price_per_ton_co2 ? 'border-red-500' : ''}
                />
                {errors.price_per_ton_co2 && <p className="text-sm text-red-500">{errors.price_per_ton_co2}</p>}
                <p className="text-xs text-gray-500">Current market range: $10-$100 per ton</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validity_years">Validity Period (Years) *</Label>
                <Input
                  id="validity_years"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.validity_years}
                  onChange={(e) => handleInputChange('validity_years', parseInt(e.target.value))}
                  className={errors.validity_years ? 'border-red-500' : ''}
                />
                {errors.validity_years && <p className="text-sm text-red-500">{errors.validity_years}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="market_price_trend">Annual Price Increase (%)</Label>
                <Input
                  id="market_price_trend"
                  type="number"
                  step="0.1"
                  value={formData.market_price_trend}
                  onChange={(e) => handleInputChange('market_price_trend', parseFloat(e.target.value))}
                />
                <p className="text-xs text-gray-500">Expected annual price escalation</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Certification and Standards */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Certification & Standards</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certification_standard">Certification Standard *</Label>
                <Select 
                  value={formData.certification_standard} 
                  onValueChange={(value) => handleInputChange('certification_standard', value)}
                >
                  <SelectTrigger className={errors.certification_standard ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationStandards.map((standard) => (
                      <SelectItem key={standard} value={standard}>
                        {standard}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.certification_standard && <p className="text-sm text-red-500">{errors.certification_standard}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type *</Label>
                <Select 
                  value={formData.project_type} 
                  onValueChange={(value) => handleInputChange('project_type', value)}
                >
                  <SelectTrigger className={errors.project_type ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_type && <p className="text-sm text-red-500">{errors.project_type}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Geographic Region</Label>
                <Select 
                  value={formData.region} 
                  onValueChange={(value) => handleInputChange('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vintage_year">Vintage Year</Label>
                <Input
                  id="vintage_year"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 5}
                  value={formData.vintage_year}
                  onChange={(e) => handleInputChange('vintage_year', parseInt(e.target.value))}
                  className={errors.vintage_year ? 'border-red-500' : ''}
                />
                {errors.vintage_year && <p className="text-sm text-red-500">{errors.vintage_year}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Market Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Market Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability_tons">Available Volume (Tons CO₂)</Label>
              <Input
                id="availability_tons"
                type="number"
                min="0"
                value={formData.availability_tons || ''}
                onChange={(e) => handleInputChange('availability_tons', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Optional: Total available credits"
              />
              <p className="text-xs text-gray-500">Leave empty if unlimited availability</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional: Additional information about this carbon credit program..."
                rows={3}
              />
            </div>
          </div>

          {/* Market Price Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Market Price Reference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">Voluntary Market</p>
                <p className="text-blue-600">$10 - $50 per ton</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Compliance Market</p>
                <p className="text-blue-600">$25 - $100 per ton</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Premium Credits</p>
                <p className="text-blue-600">$50 - $200+ per ton</p>
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
              {isLoading ? 'Saving...' : showCreateNew ? 'Save Carbon Credit Configuration' : 'Apply Carbon Credit Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CarbonCreditForm;