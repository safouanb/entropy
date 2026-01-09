"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PredictionResult, CalculatePredictionInput, ListResponse, PredictionAnalytics } from "@/types";

const API_BASE = "/api/predictions";

async function fetchPredictions(params?: {
  page?: number;
  pageSize?: number;
  dataCenterId?: number;
  scenarioName?: string;
}): Promise<ListResponse<PredictionResult>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("page_size", String(params.pageSize));
  if (params?.dataCenterId) searchParams.set("data_center_id", String(params.dataCenterId));
  if (params?.scenarioName) searchParams.set("scenario_name", params.scenarioName);

  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch predictions");
  }

  return response.json();
}

async function fetchPrediction(id: number): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch prediction");
  }

  return response.json();
}

async function calculatePrediction(input: CalculatePredictionInput): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to calculate prediction");
  }

  return response.json();
}

async function deletePrediction(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete prediction");
  }
}

async function fetchAnalytics(): Promise<PredictionAnalytics> {
  const response = await fetch("/api/analytics");

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

export function usePredictions(params?: {
  page?: number;
  pageSize?: number;
  dataCenterId?: number;
  scenarioName?: string;
}) {
  return useQuery({
    queryKey: ["predictions", params],
    queryFn: () => fetchPredictions(params),
  });
}

export function usePrediction(id: number) {
  return useQuery({
    queryKey: ["prediction", id],
    queryFn: () => fetchPrediction(id),
    enabled: !!id,
  });
}

export function useCalculatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calculatePrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });
}
