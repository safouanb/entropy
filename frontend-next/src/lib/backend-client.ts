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
// Note: Protobuf JSON uses camelCase for field names
export const predictionService = {
  // Data Centers
  listDataCenters: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { dataCenters: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListDataCenters",
      { pagination }
    ),

  getDataCenter: (id: number) =>
    callRPC<{ id: number }, { dataCenter: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetDataCenter",
      { id }
    ),

  createDataCenter: (dataCenter: unknown) =>
    callRPC<{ dataCenter: unknown }, { dataCenter: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateDataCenter",
      { dataCenter }
    ),

  updateDataCenter: (id: number, dataCenter: unknown) =>
    callRPC<{ id: number; dataCenter: unknown }, { dataCenter: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "UpdateDataCenter",
      { id, dataCenter }
    ),

  deleteDataCenter: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteDataCenter",
      { id }
    ),

  // Carbon Credits
  listCarbonCredits: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { carbonCredits: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListCarbonCredits",
      { pagination }
    ),

  getCarbonCredit: (id: number) =>
    callRPC<{ id: number }, { carbonCredit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetCarbonCredit",
      { id }
    ),

  createCarbonCredit: (carbonCredit: unknown) =>
    callRPC<{ carbonCredit: unknown }, { carbonCredit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateCarbonCredit",
      { carbonCredit }
    ),

  updateCarbonCredit: (id: number, carbonCredit: unknown) =>
    callRPC<{ id: number; carbonCredit: unknown }, { carbonCredit: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "UpdateCarbonCredit",
      { id, carbonCredit }
    ),

  deleteCarbonCredit: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteCarbonCredit",
      { id }
    ),

  // Heat Sinks
  listHeatSinks: (pagination?: { page?: number; page_size?: number }) =>
    callRPC<{ pagination?: typeof pagination }, { heatSinks: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListHeatSinks",
      { pagination }
    ),

  getHeatSink: (id: number) =>
    callRPC<{ id: number }, { heatSink: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "GetHeatSink",
      { id }
    ),

  createHeatSink: (heatSink: unknown) =>
    callRPC<{ heatSink: unknown }, { heatSink: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateHeatSink",
      { heatSink }
    ),

  deleteHeatSink: (id: number) =>
    callRPC<{ id: number }, Record<string, never>>(
      "pyrecycleheat.v1.PredictionService",
      "DeleteHeatSink",
      { id }
    ),

  listNearbyHeatSinks: (dataCenterId: number, maxDistanceKm: number, limit?: number) =>
    callRPC<
      { dataCenterId: number; maxDistanceKm: number; limit?: number },
      { heatSinks: unknown[] }
    >(
      "pyrecycleheat.v1.PredictionService",
      "ListNearbyHeatSinks",
      { dataCenterId, maxDistanceKm, limit }
    ),

  // Predictions
  calculatePrediction: (input: {
    dataCenterId: number;
    carbonCreditId?: number;
    heatSinkIds?: number[];
    scenarioName: string;
    analysisYears?: number;
    discountRate?: number;
    customPue?: number;
    customEfficiency?: number;
    customElectricityRate?: number;
    customCarbonPrice?: number;
  }) =>
    callRPC<typeof input, unknown>(
      "pyrecycleheat.v1.PredictionService",
      "CalculatePrediction",
      input
    ),

  listPredictionResults: (params?: {
    pagination?: { page?: number; pageSize?: number };
    dataCenterId?: number;
    scenarioName?: string;
  }) =>
    callRPC<typeof params, { predictionResults: unknown[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListPredictionResults",
      params || {}
    ),

  getPredictionResult: (id: number) =>
    callRPC<{ id: number }, { predictionResult: unknown }>(
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
