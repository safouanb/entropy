import {
  ActivityLogItem,
  CalculatePredictionResponse,
  CarbonCredit,
  CheckComplianceResponse,
  DashboardStats,
  DataCenter,
  HeatSink,
  PredictionAnalytics,
  PredictionResult,
  UserProfile,
} from "./schema";

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
  listDataCenters: (pagination?: { page?: number; pageSize?: number }) =>
    callRPC<{ pagination?: { page?: number; pageSize?: number } }, { dataCenters: DataCenter[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListDataCenters",
      { pagination }
    ),

  getDataCenter: (id: number) =>
    callRPC<{ id: number }, { dataCenter: DataCenter }>(
      "pyrecycleheat.v1.PredictionService",
      "GetDataCenter",
      { id }
    ),

  createDataCenter: (dataCenter: Partial<DataCenter>) =>
    callRPC<{ dataCenter: Partial<DataCenter> }, { dataCenter: DataCenter }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateDataCenter",
      { dataCenter }
    ),

  updateDataCenter: (id: number, dataCenter: Partial<DataCenter>) =>
    callRPC<{ id: number; dataCenter: Partial<DataCenter> }, { dataCenter: DataCenter }>(
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
  listCarbonCredits: (pagination?: { page?: number; pageSize?: number }) =>
    callRPC<{ pagination?: { page?: number; pageSize?: number } }, { carbonCredits: CarbonCredit[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListCarbonCredits",
      { pagination }
    ),

  getCarbonCredit: (id: number) =>
    callRPC<{ id: number }, { carbonCredit: CarbonCredit }>(
      "pyrecycleheat.v1.PredictionService",
      "GetCarbonCredit",
      { id }
    ),

  createCarbonCredit: (carbonCredit: Partial<CarbonCredit>) =>
    callRPC<{ carbonCredit: Partial<CarbonCredit> }, { carbonCredit: CarbonCredit }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateCarbonCredit",
      { carbonCredit }
    ),

  updateCarbonCredit: (id: number, carbonCredit: Partial<CarbonCredit>) =>
    callRPC<{ id: number; carbonCredit: Partial<CarbonCredit> }, { carbonCredit: CarbonCredit }>(
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
  listHeatSinks: (pagination?: { page?: number; pageSize?: number }) =>
    callRPC<{ pagination?: { page?: number; pageSize?: number } }, { heatSinks: HeatSink[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListHeatSinks",
      { pagination }
    ),

  getHeatSink: (id: number) =>
    callRPC<{ id: number }, { heatSink: HeatSink }>(
      "pyrecycleheat.v1.PredictionService",
      "GetHeatSink",
      { id }
    ),

  createHeatSink: (heatSink: Partial<HeatSink>) =>
    callRPC<{ heatSink: Partial<HeatSink> }, { heatSink: HeatSink }>(
      "pyrecycleheat.v1.PredictionService",
      "CreateHeatSink",
      { heatSink }
    ),

  createHeatSinkFull: (heatSink: Partial<HeatSink>) =>
    callRPC<{ heatSink: Partial<HeatSink> }, { heatSink: HeatSink }>(
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
      { heatSinks: HeatSink[] }
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
    callRPC<typeof input, CalculatePredictionResponse>(
      "pyrecycleheat.v1.PredictionService",
      "CalculatePrediction",
      input
    ),

  listPredictionResults: (params?: {
    pagination?: { page?: number; pageSize?: number };
    dataCenterId?: number;
    scenarioName?: string;
  }) =>
    callRPC<typeof params, { predictionResults: PredictionResult[]; pagination: unknown }>(
      "pyrecycleheat.v1.PredictionService",
      "ListPredictionResults",
      params || {}
    ),

  getPredictionResult: (id: number) =>
    callRPC<{ id: number }, { predictionResult: PredictionResult }>(
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
    callRPC<Record<string, never>, { predictionAnalytics: PredictionAnalytics }>(
      "pyrecycleheat.v1.PredictionService",
      "GetPredictionAnalytics",
      {}
    ),

  checkCompliance: (request: {
    jurisdiction: string;
    totalItLoadKw: number;
    planDate?: string;
    heatRecoveryReady: boolean;
  }) =>
    callRPC<typeof request, CheckComplianceResponse>(
      "pyrecycleheat.v1.PredictionService",
      "CheckCompliance",
      request
    ),

  // Dashboard & Settings
  getDashboardStats: () =>
    callRPC<Record<string, never>, DashboardStats>(
      "pyrecycleheat.v1.PredictionService",
      "GetDashboardStats",
      {}
    ),

  listActivityStream: (limit: number) =>
    callRPC<{ limit: number }, { activities: ActivityLogItem[] }>(
      "pyrecycleheat.v1.PredictionService",
      "ListActivityStream",
      { limit }
    ),

  getUser: (email?: string) =>
    callRPC<{ email?: string }, { user: UserProfile }>(
      "pyrecycleheat.v1.PredictionService",
      "GetUser",
      { email }
    ),

  updateUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
    notifyAssessmentComplete: boolean;
    notifyRegulatoryUpdates: boolean;
  }) =>
    callRPC<typeof user, { user: UserProfile }>(
      "pyrecycleheat.v1.PredictionService",
      "UpdateUser",
      user
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
