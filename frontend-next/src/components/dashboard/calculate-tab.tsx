"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building2, Leaf, Sparkles, Clock, Percent, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataCenters, useCarbonCredits, useCalculatePrediction } from "@/hooks";
import { calculatePredictionSchema, type CalculatePredictionFormData } from "@/lib/validations";
import { DEFAULTS } from "@/lib/constants";
import type { PredictionResult } from "@/types";

interface CalculateTabProps {
  onPredictionComplete: (prediction: PredictionResult) => void;
}

export function CalculateTab({ onPredictionComplete }: CalculateTabProps) {
  const [selectedDcId, setSelectedDcId] = useState<string>("");
  const [selectedCcId, setSelectedCcId] = useState<string>("");

  const { data: dataCenters, isLoading: loadingDcs } = useDataCenters();
  const { data: carbonCredits, isLoading: loadingCcs } = useCarbonCredits();
  const calculateMutation = useCalculatePrediction();

  const form = useForm<CalculatePredictionFormData>({
    resolver: zodResolver(calculatePredictionSchema),
    defaultValues: {
      scenario_name: "",
      analysis_years: DEFAULTS.ANALYSIS_YEARS,
      discount_rate: DEFAULTS.DISCOUNT_RATE,
    },
  });

  const onSubmit = async (data: CalculatePredictionFormData) => {
    try {
      const result = await calculateMutation.mutateAsync({
        ...data,
        data_center_id: parseInt(selectedDcId),
        carbon_credit_id: selectedCcId && selectedCcId !== "none" ? parseInt(selectedCcId) : undefined,
      });
      toast.success("Prediction calculated successfully!");
      onPredictionComplete(result as PredictionResult);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to calculate prediction");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">New Prediction</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your analysis parameters to calculate potential savings
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Data Sources Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Data Center Selection */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Data Center</h3>
                <p className="text-xs text-gray-500">Select the facility to analyze</p>
              </div>
            </div>
            <Select value={selectedDcId} onValueChange={setSelectedDcId}>
              <SelectTrigger className="h-12 bg-white border-gray-200">
                <SelectValue placeholder={loadingDcs ? "Loading..." : "Select a data center"} />
              </SelectTrigger>
              <SelectContent>
                {dataCenters?.items?.map((dc) => (
                  <SelectItem key={dc.id} value={String(dc.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dc.name}</span>
                      <span className="text-xs text-gray-500">({dc.total_it_load_kw} kW)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedDcId && dataCenters?.items?.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                No data centers found. Create one in the Manage tab.
              </p>
            )}
          </div>

          {/* Carbon Credit Selection */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-teal-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-100">
                <Leaf className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Carbon Credit</h3>
                <p className="text-xs text-gray-500">Optional carbon offset program</p>
              </div>
            </div>
            <Select value={selectedCcId} onValueChange={setSelectedCcId}>
              <SelectTrigger className="h-12 bg-white border-gray-200">
                <SelectValue placeholder={loadingCcs ? "Loading..." : "Select a carbon credit"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {carbonCredits?.items?.map((cc) => (
                  <SelectItem key={cc.id} value={String(cc.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cc.project_name}</span>
                      <span className="text-xs text-gray-500">(${cc.price_per_ton}/ton)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analysis Parameters */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Analysis Parameters</h3>
              <p className="text-xs text-gray-500">Configure your prediction settings</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="scenario_name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-400" />
                Scenario Name
              </Label>
              <Input
                id="scenario_name"
                placeholder="e.g., Q1 2024 Baseline"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("scenario_name")}
              />
              {form.formState.errors.scenario_name && (
                <p className="text-xs text-red-500">{form.formState.errors.scenario_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="analysis_years" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-gray-400" />
                Analysis Period (Years)
              </Label>
              <Input
                id="analysis_years"
                type="number"
                min={1}
                max={30}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("analysis_years", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_rate" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Percent className="h-4 w-4 text-gray-400" />
                Discount Rate (%)
              </Label>
              <Input
                id="discount_rate"
                type="number"
                step="0.1"
                min={0}
                max={30}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("discount_rate", {
                  setValueAs: (v) => (v ? parseFloat(v) / 100 : DEFAULTS.DISCOUNT_RATE),
                })}
                defaultValue={DEFAULTS.DISCOUNT_RATE * 100}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-base font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors"
          disabled={!selectedDcId || calculateMutation.isPending}
        >
          {calculateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Calculating Prediction...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Calculate Savings Prediction
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
