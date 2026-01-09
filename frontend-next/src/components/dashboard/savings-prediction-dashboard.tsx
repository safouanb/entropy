"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, Map, Settings, History } from "lucide-react";
import { CalculateTab } from "./calculate-tab";
import { ResultsTab } from "./results-tab";
import { MapTab } from "./map-tab";
import { ManageTab } from "./manage-tab";
import { HistoryTab } from "./history-tab";
import type { PredictionResult } from "@/types";

export function SavingsPredictionDashboard() {
  const [activeTab, setActiveTab] = useState("calculate");
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);

  const handlePredictionComplete = (prediction: PredictionResult) => {
    setCurrentPrediction(prediction);
    setActiveTab("results");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Savings Prediction Dashboard</CardTitle>
        <CardDescription>
          Calculate potential savings from data center heat recovery projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="calculate" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculate</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculate" className="mt-6">
            <CalculateTab onPredictionComplete={handlePredictionComplete} />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <ResultsTab prediction={currentPrediction} />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <MapTab />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <ManageTab />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryTab onSelectPrediction={setCurrentPrediction} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
