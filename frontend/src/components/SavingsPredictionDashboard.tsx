import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  Building2, 
  Leaf, 
  Thermometer, 
  TrendingUp, 
  Settings, 
  History,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MapPin
} from 'lucide-react';

import DataCenterInputForm, { DataCenterFormData } from './DataCenterInputForm';
import CarbonCreditForm, { CarbonCreditFormData } from './CarbonCreditForm';
import SavingsPredictionResults from './SavingsPredictionResults';
import GoogleMapComponent from './GoogleMapComponent';

interface SavingsPredictionDashboardProps {
  className?: string;
}

interface DataCenter {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  total_it_load_kw: number;
  pue: number;
  created_at: string;
}

interface CarbonCredit {
  id: number;
  project_name: string;
  price_per_ton: number;
  certification_standard: string;
  project_type: string;
  created_at: string;
}

interface PredictionHistory {
  id: number;
  data_center_id: number;
  scenario_name: string;
  annual_savings: number;
  roi_percentage: number;
  payback_period_years: number;
  created_at: string;
}

const SavingsPredictionDashboard: React.FC<SavingsPredictionDashboardProps> = ({
  className = ""
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<string>("calculate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Data state
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);
  
  // Form state
  const [selectedDataCenter, setSelectedDataCenter] = useState<number | null>(null);
  const [selectedCarbonCredit, setSelectedCarbonCredit] = useState<number | null>(null);
  const [showDataCenterForm, setShowDataCenterForm] = useState(false);
  const [showCarbonCreditForm, setShowCarbonCreditForm] = useState(false);
  
  // Search and map state
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  // API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Load initial data
  useEffect(() => {
    loadDataCenters();
    loadCarbonCredits();
    loadPredictionHistory();
  }, []);

  const loadDataCenters = async () => {
    setIsLoading(true);
    try {
      setLoadingMessage('Loading data centers...');
      setLoadingProgress(20);
      const response = await fetch(`${API_BASE}/api/v1/predictions/data-centers`);
      if (response.ok) {
        const data = await response.json();
        setDataCenters(data);
        setLoadingProgress(40);
      } else {
        setError('Failed to load data centers');
      }
    } catch (error) {
      console.error('Failed to load data centers:', error);
      setError('Network error while loading data centers');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCarbonCredits = async () => {
    try {
      setLoadingMessage('Loading carbon credits...');
      setLoadingProgress(60);
      const response = await fetch(`${API_BASE}/api/v1/predictions/carbon-credits`);
      if (response.ok) {
        const data = await response.json();
        setCarbonCredits(data);
        setLoadingProgress(80);
      } else {
        setError('Failed to load carbon credits');
      }
    } catch (error) {
      console.error('Failed to load carbon credits:', error);
      setError('Network error while loading carbon credits');
    }
  };

  const loadPredictionHistory = async () => {
    try {
      setLoadingMessage('Loading prediction history...');
      setLoadingProgress(90);
      const response = await fetch(`${API_BASE}/api/v1/predictions/predictions?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setPredictionHistory(data);
        setLoadingProgress(100);
        setLoadingMessage('Complete!');
      } else {
        setError('Failed to load prediction history');
      }
    } catch (error) {
      console.error('Failed to load prediction history:', error);
      setError('Network error while loading prediction history');
    }
  };

  const handleDataCenterSubmit = async (formData: DataCenterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/predictions/data-centers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newDataCenter = await response.json();
        setDataCenters(prev => [...prev, newDataCenter]);
        setSelectedDataCenter(newDataCenter.id);
        setShowDataCenterForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create data center');
      }
    } catch (error) {
      setError('Network error occurred while creating data center');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarbonCreditSubmit = async (formData: CarbonCreditFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/predictions/carbon-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCarbonCredit = await response.json();
        setCarbonCredits(prev => [...prev, newCarbonCredit]);
        setSelectedCarbonCredit(newCarbonCredit.id);
        setShowCarbonCreditForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create carbon credit');
      }
    } catch (error) {
      setError('Network error occurred while creating carbon credit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculatePrediction = async () => {
    if (!selectedDataCenter || !selectedCarbonCredit) {
      setError('Please select both a data center and carbon credit');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingMessage('Preparing calculation...');
    
    try {
      setLoadingProgress(25);
      setLoadingMessage('Sending request to server...');
      
      const response = await fetch(`${API_BASE}/api/v1/predictions/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_center_id: selectedDataCenter,
          carbon_credit_id: selectedCarbonCredit,
          scenario_name: 'Base Case Analysis',
          analysis_years: 10,
          discount_rate: 0.08
        }),
      });

      setLoadingProgress(75);
      setLoadingMessage('Processing results...');

      if (response.ok) {
        const predictionResult = await response.json();
        setCurrentPrediction(predictionResult);
        setActiveTab('results');
        setLoadingProgress(100);
        setLoadingMessage('Calculation complete!');
        loadPredictionHistory(); // Refresh history
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to calculate prediction');
      }
    } catch (error) {
      setError('Network error occurred while calculating prediction');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setLoadingProgress(0);
        setLoadingMessage('');
      }, 2000);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadDataCenters(),
        loadCarbonCredits(),
        loadPredictionHistory()
      ]);
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!currentPrediction) {
      setError('No prediction results to export');
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      prediction: currentPrediction,
      dataCenter: dataCenters.find(dc => dc.id === selectedDataCenter),
      carbonCredit: carbonCredits.find(cc => cc.id === selectedCarbonCredit)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `prediction-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calculator className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              Data Center Savings Prediction
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              Calculate energy savings, carbon reduction, and financial returns for data center optimization
            </p>
          </div>
          
          {/* Search Bar with Glass Effect */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative min-w-0 flex-1 lg:flex-none">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search data centers, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full lg:w-64 bg-white/80 backdrop-blur-sm border-white/50 rounded-lg shadow-sm focus:bg-white/90 focus:border-blue-300 transition-all duration-200 text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                size="sm"
                className="text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                onClick={handleExport}
                variant="outline"
                disabled={!currentPrediction}
                size="sm"
                className="text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Google Maps Integration */}
        {showMap && (
          <Card className="mb-4 lg:mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Data Center Locations
              </CardTitle>
              <CardDescription className="text-sm">
                Interactive map showing data center locations in San Francisco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-96 w-full rounded-lg overflow-hidden">
                <GoogleMapComponent searchQuery={searchQuery} />
              </div>
            </CardContent>
          </Card>
        )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading Progress */}
      {isLoading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{loadingMessage}</span>
                <span className="text-sm text-muted-foreground">{loadingProgress}%</span>
              </div>
              <Progress value={loadingProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculate" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Calculate Tab */}
        <TabsContent value="calculate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Center Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Select Data Center
                </CardTitle>
                <CardDescription>
                  Choose an existing data center or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataCenters.length > 0 ? (
                  <div className="space-y-2">
                    {dataCenters.map((dc) => (
                      <div
                        key={dc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDataCenter === dc.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDataCenter(dc.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{dc.name}</h4>
                            <p className="text-sm text-gray-600">
                              {dc.total_it_load_kw} kW • PUE {dc.pue}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {formatDate(dc.created_at)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No data centers available
                  </p>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDataCenterForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Data Center
                </Button>
              </CardContent>
            </Card>

            {/* Carbon Credit Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Select Carbon Credit
                </CardTitle>
                <CardDescription>
                  Choose carbon credit parameters for offset calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {carbonCredits.length > 0 ? (
                  <div className="space-y-2">
                    {carbonCredits.map((cc) => (
                      <div
                        key={cc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedCarbonCredit === cc.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCarbonCredit(cc.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cc.project_name}</h4>
                            <p className="text-sm text-gray-600">
                              ${cc.price_per_ton}/ton • {cc.certification_standard}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {cc.project_type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No carbon credits available
                  </p>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCarbonCreditForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Carbon Credit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleCalculatePrediction}
              disabled={!selectedDataCenter || !selectedCarbonCredit || isLoading}
              className="px-8 py-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Savings Prediction
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {currentPrediction ? (
            <SavingsPredictionResults 
                  results={currentPrediction} 
                  isLoading={isLoading} 
                />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Prediction Results
                </h3>
                <p className="text-gray-600 mb-4">
                  Calculate a savings prediction to see detailed results and analysis.
                </p>
                <Button onClick={() => setActiveTab('calculate')}>
                  Start Calculation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Interactive Data Center Map
              </CardTitle>
              <CardDescription>
                Explore data center locations across San Francisco with interactive mapping and search functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Enhanced Search Bar */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-lg border border-blue-200/30 shadow-sm"></div>
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-blue-500 z-10" />
                    <Input
                      type="text"
                      placeholder="Search by data center name, location, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full bg-white/90 backdrop-blur-sm border-blue-200/50 rounded-lg shadow-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>
                </div>
                
                {/* Full-screen Map */}
                <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <GoogleMapComponent searchQuery={searchQuery} />
                </div>
                
                {/* Map Controls and Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Data Centers</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-800 mt-1">{dataCenters.length}</p>
                      <p className="text-sm text-blue-600">Active locations</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-900">Carbon Credits</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800 mt-1">{carbonCredits.length}</p>
                      <p className="text-sm text-green-600">Available options</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Predictions</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-800 mt-1">{predictionHistory.length}</p>
                      <p className="text-sm text-purple-600">Completed analyses</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Centers ({dataCenters.length})</CardTitle>
                <CardDescription>
                  Manage your data center configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dataCenters.slice(0, 5).map((dc) => (
                    <div key={dc.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{dc.name}</p>
                        <p className="text-sm text-gray-600">{dc.total_it_load_kw} kW</p>
                      </div>
                      <Badge variant="outline">{formatDate(dc.created_at)}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Data Centers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Credits ({carbonCredits.length})</CardTitle>
                <CardDescription>
                  Manage your carbon credit configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {carbonCredits.slice(0, 5).map((cc) => (
                    <div key={cc.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{cc.project_name}</p>
                        <p className="text-sm text-gray-600">${cc.price_per_ton}/ton</p>
                      </div>
                      <Badge variant="outline">{cc.certification_standard}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Carbon Credits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Prediction History</CardTitle>
                  <CardDescription>
                    View and manage your previous savings calculations
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={loadPredictionHistory}
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button 
                    onClick={() => {
                      const historyData = {
                        timestamp: new Date().toISOString(),
                        history: predictionHistory,
                        total_predictions: predictionHistory.length
                      };
                      const dataStr = JSON.stringify(historyData, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = `prediction-history-${new Date().toISOString().split('T')[0]}.json`;
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}
                    variant="outline" 
                    size="sm"
                    disabled={predictionHistory.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export History
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {predictionHistory.length > 0 ? (
                <div className="space-y-3">
                  {predictionHistory.map((prediction) => (
                    <div key={prediction.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{prediction.scenario_name}</h4>
                          <p className="text-sm text-gray-600">
                            Data Center ID: {prediction.data_center_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(prediction.annual_savings)}/year
                          </p>
                          <p className="text-sm text-gray-600">
                            {prediction.roi_percentage?.toFixed(1) || 0}% ROI
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="secondary">
                          {prediction.payback_period_years?.toFixed(1) || 0} year payback
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(prediction.created_at)}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Load this prediction as current
                              setCurrentPrediction({
                                annual_energy_savings_mwh: prediction.annual_savings / 100, // Estimate
                                annual_cost_savings_usd: prediction.annual_savings,
                                co2_reduction_tons_per_year: prediction.annual_savings / 50, // Estimate
                                heat_recovery_potential_mwh: prediction.annual_savings / 80, // Estimate
                                roi_percent: prediction.roi_percentage,
                                payback_period_years: prediction.payback_period_years,
                                npv_usd: prediction.annual_savings * 5, // Estimate
                                formulas_used: {
                                  energy_savings: "Historical data",
                                  cost_savings: "Historical data",
                                  co2_reduction: "Historical data",
                                  heat_recovery: "Historical data",
                                  roi: "Historical data",
                                  payback_period: "Historical data",
                                  npv: "Historical data"
                                }
                              });
                              setActiveTab('results');
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No prediction history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Forms */}
      {showDataCenterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Data Center</h2>
              <Button variant="ghost" onClick={() => setShowDataCenterForm(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <DataCenterInputForm
                onSubmit={handleDataCenterSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {showCarbonCreditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Carbon Credit</h2>
              <Button variant="ghost" onClick={() => setShowCarbonCreditForm(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <CarbonCreditForm
                onSubmit={handleCarbonCreditSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SavingsPredictionDashboard;