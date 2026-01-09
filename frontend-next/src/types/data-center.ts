export interface Location {
  latitude: number;
  longitude: number;
}

export interface DataCenter {
  id: number;
  name: string;
  location: Location;
  address?: string;
  dcType?: string;
  totalItLoadKw: number;
  pue?: number;
  utilizationPercent?: number;
  coolingType?: string;
  energySource?: string;
  renewablePercent?: number;
  electricityCostKwh?: number;
  operatingHoursYear?: number;
  heatRecoveryEnabled?: boolean;
  createdAt?: string;
}

export interface CreateDataCenterInput {
  name: string;
  location: Location;
  address?: string;
  dcType?: string;
  totalItLoadKw: number;
  pue?: number;
  utilizationPercent?: number;
  coolingType?: string;
  energySource?: string;
  renewablePercent?: number;
  electricityCostKwh?: number;
  operatingHoursYear?: number;
  heatRecoveryEnabled?: boolean;
}

export interface UpdateDataCenterInput extends Partial<CreateDataCenterInput> {
  id: number;
}
