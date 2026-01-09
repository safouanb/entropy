const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL || "http://localhost:8080";

interface ConnectRPCError {
  code: string;
  message: string;
}

export class BackendError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "BackendError";
  }
}

async function callRPC<TReq, TRes>(
  service: string,
  method: string,
  request: TReq
): Promise<TRes> {
  const url = `${BACKEND_URL}/${service}/${method}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ConnectRPCError;
    throw new BackendError(
      errorData.code || "unknown",
      errorData.message || `HTTP ${response.status}`
    );
  }

  return response.json() as Promise<TRes>;
}

// PredictionService client
export const predictionService = {
  // Data Centers
  listDataCenters: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { data_centers: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListDataCenters",
      { pagination }
    ),

  getDataCenter: (id: number) =>
    callRPC<{ id: number }, { data_center: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetDataCenter",
      { id }
    ),

  createDataCenter: (dataCenter: unknown) =>
    callRPC<{ data_center: unknown }, { data_center: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateDataCenter",
      { data_center: dataCenter }
    ),

  updateDataCenter: (id: number, dataCenter: unknown) =>
    callRPC<{ id: number; data_center: unknown }, { data_center: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "UpdateDataCenter",
      { id, data_center: dataCenter }
    ),

  deleteDataCenter: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteDataCenter",
      { id }
    ),

  // Carbon Credits
  listCarbonCredits: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { carbon_credits: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListCarbonCredits",
      { pagination }
    ),

  getCarbonCredit: (id: number) =>
    callRPC<{ id: number }, { carbon_credit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetCarbonCredit",
      { id }
    ),

  createCarbonCredit: (carbonCredit: unknown) =>
    callRPC<{ carbon_credit: unknown }, { carbon_credit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateCarbonCredit",
      { carbon_credit: carbonCredit }
    ),

  updateCarbonCredit: (id: number, carbonCredit: unknown) =>
    callRPC<{ id: number; carbon_credit: unknown }, { carbon_credit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "UpdateCarbonCredit",
      { id, carbon_credit: carbonCredit }
    ),

  deleteCarbonCredit: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteCarbonCredit",
      { id }
    ),

  // Heat Sinks
  listHeatSinks: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { heat_sinks: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListHeatSinks",
      { pagination }
    ),

  getHeatSink: (id: number) =>
    callRPC<{ id: number }, { heat_sink: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetHeatSink",
      { id }
    ),

  createHeatSink: (heatSink: unknown) =>
    callRPC<{ heat_sink: unknown }, { heat_sink: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateHeatSink",
      { heat_sink: heatSink }
    ),

  deleteHeatSink: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteHeatSink",
      { id }
    ),

  listNearbyHeatSinks: (dataCenterId: number, maxDistanceKm: number, limit?: number) =>
    callRPC<
      { data_center_id: number; max_distance_km: number; limit?: number },
      { heat_sinks: unknown[] }
    >(
      "pyrecycleheat.v1.PredictionService",
      "ListNearbyHeatSinks",
      { data_center_id: dataCenterId, max_distance_km: maxDistanceKm, limit }
    ),

  // Predictions
  calculatePrediction: (input: {
    data_center_id: number;
    carbon_credit_id?: number;
    heat_sink_ids?: number[];
    scenario_name: string;
    analysis_years?: number;
    discount_rate?: number;
  }) =>
    callRPC<typeof input, unknown>(
      "pyrecycleheat.v1.PredictionService",
      "CalculatePrediction",
      input
    ),

  listPredictionResults: (params?: {
    pagination?: { page?: number; page_size?: number };
    data_center_id?: number;
    scenario_name?: string;
  }) =>
    callRPC<typeof params, { prediction_results: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListPredictionResults",
      params || {}
    ),

  getPredictionResult: (id: number) =>
    callRPC<{ id: number }, { prediction_result: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetPredictionResult",
      { id }
    ),

  deletePredictionResult: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeletePredictionResult",
      { id }
    ),

  // Analytics
  getPredictionAnalytics: () =>
    callRPC<Record<string, never>, { predictionAnalytics: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetPredictionAnalytics",
      {}
    ),
};

// Health check (standard REST endpoint)
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${BACKEND_URL}/health`);
  if (!response.ok) {
    throw new Error("Backend unhealthy");
  }
  return response.json();
}
