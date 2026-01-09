import { Location } from "./data-center";

export interface HeatSink {
  id: number;
  name: string;
  location: Location;
  address?: string;
  sinkType?: string;
  capacityMw: number;
  currentDemandMw?: number;
  temperatureRequirementC?: number;
  seasonalFactor?: number;
  connectionCostPerKm?: number;
  heatPricePerMwh?: number;
  operatingHoursYear?: number;
  createdAt?: string;
}

export interface CreateHeatSinkInput {
  name: string;
  location: Location;
  address?: string;
  sinkType?: string;
  capacityMw: number;
  currentDemandMw?: number;
  temperatureRequirementC?: number;
  seasonalFactor?: number;
  connectionCostPerKm?: number;
  heatPricePerMwh?: number;
  operatingHoursYear?: number;
}
