"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div id="dashboard" className="w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 pt-6">
            <TabsList className="inline-flex h-12 items-center justify-start gap-1 rounded-xl bg-white p-1.5 shadow-sm border border-gray-200">
              <TabsTrigger
                value="calculate"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Calculate</span>
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Manage</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="calculate" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <CalculateTab onPredictionComplete={handlePredictionComplete} />
            </TabsContent>

            <TabsContent value="results" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ResultsTab prediction={currentPrediction} />
            </TabsContent>

            <TabsContent value="map" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <MapTab />
            </TabsContent>

            <TabsContent value="manage" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ManageTab />
            </TabsContent>

            <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <HistoryTab onSelectPrediction={setCurrentPrediction} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
