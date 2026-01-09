"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        carbon_credit_id: selectedCcId ? parseInt(selectedCcId) : undefined,
      });
      toast.success("Prediction calculated successfully!");
      onPredictionComplete(result as PredictionResult);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to calculate prediction");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Savings Prediction</CardTitle>
          <CardDescription>
            Select a data center and optionally a carbon credit program to calculate potential savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="data-center">Data Center *</Label>
                <Select value={selectedDcId} onValueChange={setSelectedDcId}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingDcs ? "Loading..." : "Select a data center"} />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCenters?.items?.map((dc) => (
                      <SelectItem key={dc.id} value={String(dc.id)}>
                        {dc.name} ({dc.total_it_load_kw} kW)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedDcId && (
                  <p className="text-sm text-muted-foreground">
                    No data centers? Create one in the Manage tab.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbon-credit">Carbon Credit (Optional)</Label>
                <Select value={selectedCcId} onValueChange={setSelectedCcId}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingCcs ? "Loading..." : "Select a carbon credit"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {carbonCredits?.items?.map((cc) => (
                      <SelectItem key={cc.id} value={String(cc.id)}>
                        {cc.project_name} (${cc.price_per_ton}/ton)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="scenario_name">Scenario Name *</Label>
                <Input
                  id="scenario_name"
                  placeholder="e.g., Baseline Analysis"
                  {...form.register("scenario_name")}
                />
                {form.formState.errors.scenario_name && (
                  <p className="text-sm text-red-500">{form.formState.errors.scenario_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis_years">Analysis Years</Label>
                <Input
                  id="analysis_years"
                  type="number"
                  min={1}
                  max={30}
                  {...form.register("analysis_years", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_rate">Discount Rate (%)</Label>
                <Input
                  id="discount_rate"
                  type="number"
                  step="0.01"
                  min={0}
                  max={30}
                  {...form.register("discount_rate", {
                    setValueAs: (v) => (v ? parseFloat(v) / 100 : DEFAULTS.DISCOUNT_RATE),
                  })}
                  defaultValue={DEFAULTS.DISCOUNT_RATE * 100}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedDcId || calculateMutation.isPending}
            >
              {calculateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Prediction"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
