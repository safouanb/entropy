"use client";

import { Download, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { usePredictions, useDeletePrediction } from "@/hooks";
import { formatCurrency, formatPercent, INVESTMENT_GRADE_COLORS } from "@/lib/constants";
import type { PredictionResult } from "@/types";

interface HistoryTabProps {
  onSelectPrediction: (prediction: PredictionResult) => void;
}

export function HistoryTab({ onSelectPrediction }: HistoryTabProps) {
  const { data: predictions, isLoading } = usePredictions({ pageSize: 20 });
  const deleteMutation = useDeletePrediction();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Prediction deleted");
    } catch {
      toast.error("Failed to delete prediction");
    }
  };

  const handleExport = (prediction: PredictionResult) => {
    const blob = new Blob([JSON.stringify(prediction, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prediction-${prediction.scenario_name}-${prediction.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Prediction exported");
  };

  const handleExportAll = () => {
    if (!predictions?.items?.length) return;
    const blob = new Blob([JSON.stringify(predictions.items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("All predictions exported");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Prediction History</CardTitle>
          <CardDescription>View and manage past predictions</CardDescription>
        </div>
        {predictions?.items?.length ? (
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : predictions?.items?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No predictions yet. Run a calculation to see results here.
          </p>
        ) : (
          <ul className="space-y-3">
            {predictions?.items?.map((pred) => {
              const grade = pred.financial_metrics?.investment_grade || "N/A";
              const gradeColors = INVESTMENT_GRADE_COLORS[grade] || { bg: "bg-gray-100", text: "text-gray-800" };

              return (
                <li
                  key={pred.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{pred.scenario_name}</p>
                      <Badge className={`${gradeColors.bg} ${gradeColors.text}`}>
                        Grade {grade}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>NPV: {formatCurrency(pred.financial_metrics?.net_present_value || 0)}</span>
                      <span>IRR: {formatPercent(pred.financial_metrics?.internal_rate_of_return || 0)}</span>
                      <span>Payback: {pred.financial_metrics?.simple_payback_years?.toFixed(1) || "N/A"} yrs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectPrediction(pred)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExport(pred)}
                      title="Export"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => pred.id && handleDelete(pred.id)}
                      disabled={deleteMutation.isPending}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
