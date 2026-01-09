"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DataCenter, CreateDataCenterInput, ListResponse } from "@/types";

const API_BASE = "/api/data-centers";

async function fetchDataCenters(page?: number, pageSize?: number): Promise<ListResponse<DataCenter>> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data centers");
  }

  return response.json();
}

async function fetchDataCenter(id: number): Promise<DataCenter> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data center");
  }

  return response.json();
}

async function createDataCenter(input: CreateDataCenterInput): Promise<DataCenter> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create data center");
  }

  return response.json();
}

async function deleteDataCenter(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete data center");
  }
}

export function useDataCenters(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["data-centers", page, pageSize],
    queryFn: () => fetchDataCenters(page, pageSize),
  });
}

export function useDataCenter(id: number) {
  return useQuery({
    queryKey: ["data-center", id],
    queryFn: () => fetchDataCenter(id),
    enabled: !!id,
  });
}

export function useCreateDataCenter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDataCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-centers"] });
    },
  });
}

export function useDeleteDataCenter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDataCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-centers"] });
    },
  });
}
