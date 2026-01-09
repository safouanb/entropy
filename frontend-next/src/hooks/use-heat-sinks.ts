"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { HeatSink, CreateHeatSinkInput, ListResponse } from "@/types";

const API_BASE = "/api/heat-sinks";

async function fetchHeatSinks(page?: number, pageSize?: number): Promise<ListResponse<HeatSink>> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch heat sinks");
  }

  return response.json();
}

async function fetchHeatSink(id: number): Promise<HeatSink> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch heat sink");
  }

  return response.json();
}

async function fetchNearbyHeatSinks(
  dataCenterId: number,
  maxDistanceKm: number,
  limit?: number
): Promise<{ items: HeatSink[] }> {
  const params = new URLSearchParams({
    data_center_id: String(dataCenterId),
    max_distance_km: String(maxDistanceKm),
  });
  if (limit) params.set("limit", String(limit));

  const response = await fetch(`${API_BASE}/nearby?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch nearby heat sinks");
  }

  return response.json();
}

async function createHeatSink(input: CreateHeatSinkInput): Promise<HeatSink> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create heat sink");
  }

  return response.json();
}

async function deleteHeatSink(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete heat sink");
  }
}

export function useHeatSinks(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["heat-sinks", page, pageSize],
    queryFn: () => fetchHeatSinks(page, pageSize),
  });
}

export function useHeatSink(id: number) {
  return useQuery({
    queryKey: ["heat-sink", id],
    queryFn: () => fetchHeatSink(id),
    enabled: !!id,
  });
}

export function useNearbyHeatSinks(dataCenterId: number, maxDistanceKm: number, limit?: number) {
  return useQuery({
    queryKey: ["heat-sinks", "nearby", dataCenterId, maxDistanceKm, limit],
    queryFn: () => fetchNearbyHeatSinks(dataCenterId, maxDistanceKm, limit),
    enabled: !!dataCenterId && maxDistanceKm > 0,
  });
}

export function useCreateHeatSink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHeatSink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heat-sinks"] });
    },
  });
}

export function useDeleteHeatSink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHeatSink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heat-sinks"] });
    },
  });
}
