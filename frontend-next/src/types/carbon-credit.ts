export interface CarbonCredit {
  id: number;
  projectName: string;
  creditType?: string;
  pricePerTon: number;
  availableTons: number;
  vintageYear?: number;
  verificationStandard?: string;
  location?: string;
  projectDescription?: string;
  createdAt?: string;
}

export interface CreateCarbonCreditInput {
  projectName: string;
  creditType?: string;
  pricePerTon: number;
  availableTons: number;
  vintageYear?: number;
  verificationStandard?: string;
  location?: string;
  projectDescription?: string;
}

export interface UpdateCarbonCreditInput extends Partial<CreateCarbonCreditInput> {
  id: number;
}
