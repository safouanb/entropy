"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  GlobeEuropeAfricaIcon,
  SparklesIcon,
  ClockIcon,
  ReceiptPercentIcon,
  DocumentTextIcon,
  CalculatorIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";
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
      scenarioName: "",
      analysisYears: DEFAULTS.ANALYSIS_YEARS,
      discountRate: DEFAULTS.DISCOUNT_RATE,
    },
  });

  const onSubmit = async (data: CalculatePredictionFormData) => {
    try {
      const result = await calculateMutation.mutateAsync({
        ...data,
        dataCenterId: parseInt(selectedDcId),
        carbonCreditId: selectedCcId && selectedCcId !== "none" ? parseInt(selectedCcId) : undefined,
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
                <BuildingOffice2Icon className="h-5 w-5 text-emerald-600" />
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
                      <span className="text-xs text-gray-500">({dc.totalItLoadKw} kW)</span>
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
                <GlobeEuropeAfricaIcon className="h-5 w-5 text-teal-600" />
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
                      <span className="font-medium">{cc.projectName}</span>
                      <span className="text-xs text-gray-500">(${cc.pricePerTon}/ton)</span>
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
              <CalculatorIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Analysis Parameters</h3>
              <p className="text-xs text-gray-500">Configure your prediction settings</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="scenarioName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                Scenario Name
              </Label>
              <Input
                id="scenarioName"
                placeholder="e.g., Q1 2024 Baseline"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("scenarioName")}
              />
              {form.formState.errors.scenarioName && (
                <p className="text-xs text-red-500">{form.formState.errors.scenarioName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="analysisYears" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                Analysis Period (Years)
              </Label>
              <Input
                id="analysisYears"
                type="number"
                min={1}
                max={30}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("analysisYears", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountRate" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ReceiptPercentIcon className="h-4 w-4 text-gray-400" />
                Discount Rate (%)
              </Label>
              <Input
                id="discountRate"
                type="number"
                step="0.1"
                min={0}
                max={30}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("discountRate", {
                  setValueAs: (v) => (v ? parseFloat(v) / 100 : DEFAULTS.DISCOUNT_RATE),
                })}
                defaultValue={DEFAULTS.DISCOUNT_RATE * 100}
              />
            </div>
          </div>
        </div>

        {/* Advanced Economic Assumptions */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange-100">
              <BanknotesIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Advanced Economic Assumptions</h3>
              <p className="text-xs text-gray-500">Override default cost models (Optional)</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customCapexPerKM" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Pipeline Cost (€/km)
              </Label>
              <Input
                id="customCapexPerKM"
                type="number"
                placeholder="Default: 1,500,000"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("customCapexPerKM", { valueAsNumber: true })}
              />
              <p className="text-[10px] text-gray-400">Civil works + material cost per km</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customConnectionCost" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Connection Cost (€)
              </Label>
              <Input
                id="customConnectionCost"
                type="number"
                placeholder="Default: 500,000"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                {...form.register("customConnectionCost", { valueAsNumber: true })}
              />
              <p className="text-[10px] text-gray-400">HEX, pumps, and substation works</p>
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
              <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
              Calculating Prediction...
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2 h-5 w-5" />
              Calculate Savings Prediction
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
