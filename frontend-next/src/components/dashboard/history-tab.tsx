"use client";

import {
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePredictions, useDeletePrediction } from "@/hooks";
import { formatCurrency, formatPercent } from "@/lib/constants";
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
    a.download = `prediction-${prediction.scenarioName}-${prediction.id}.json`;
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
      case "B": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "C": return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "D": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/25">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Prediction History</h3>
              <p className="text-sm text-gray-500">
                {predictions?.items?.length || 0} saved predictions
              </p>
            </div>
          </div>
          {predictions?.items?.length ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Export All
            </Button>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : predictions?.items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <DocumentTextIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No predictions yet</h4>
            <p className="text-gray-500 max-w-sm">
              Run a calculation from the Calculate tab to see your prediction history here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {predictions?.items?.map((pred) => {
              const grade = pred.financialMetrics?.investmentGrade || "N/A";
              const gradeColor = getGradeColor(grade);

              return (
                <li
                  key={pred.id}
                  className="group rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {pred.scenarioName}
                          </h4>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gradeColor.bg} ${gradeColor.text} border ${gradeColor.border}`}>
                            Grade {grade}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-50">
                              <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">NPV</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(pred.financialMetrics?.netPresentValue || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-blue-50">
                              <TrophyIcon className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">IRR</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatPercent(pred.financialMetrics?.internalRateOfReturn || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-amber-50">
                              <ClockIcon className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Payback</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {pred.financialMetrics?.simplePaybackYears?.toFixed(1) || "N/A"} yrs
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectPrediction(pred)}
                          title="View details"
                          className="h-9 w-9 hover:bg-purple-50"
                        >
                          <EyeIcon className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExport(pred)}
                          title="Export"
                          className="h-9 w-9 hover:bg-blue-50"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => pred.id && handleDelete(pred.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete"
                          className="h-9 w-9 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
