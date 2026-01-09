"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CarbonCredit, CreateCarbonCreditInput, ListResponse } from "@/types";

const API_BASE = "/api/carbon-credits";

async function fetchCarbonCredits(page?: number, pageSize?: number): Promise<ListResponse<CarbonCredit>> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch carbon credits");
  }

  return response.json();
}

async function fetchCarbonCredit(id: number): Promise<CarbonCredit> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch carbon credit");
  }

  return response.json();
}

async function createCarbonCredit(input: CreateCarbonCreditInput): Promise<CarbonCredit> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create carbon credit");
  }

  return response.json();
}

async function deleteCarbonCredit(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete carbon credit");
  }
}

export function useCarbonCredits(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["carbon-credits", page, pageSize],
    queryFn: () => fetchCarbonCredits(page, pageSize),
  });
}

export function useCarbonCredit(id: number) {
  return useQuery({
    queryKey: ["carbon-credit", id],
    queryFn: () => fetchCarbonCredit(id),
    enabled: !!id,
  });
}

export function useCreateCarbonCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCarbonCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carbon-credits"] });
    },
  });
}

export function useDeleteCarbonCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCarbonCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carbon-credits"] });
    },
  });
}
