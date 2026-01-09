export interface CarbonCredit {
  id: number;
  project_name: string;
  credit_type?: string;
  price_per_ton: number;
  available_tons: number;
  vintage_year?: number;
  verification_standard?: string;
  location?: string;
  project_description?: string;
  created_at?: string;
}

export interface CreateCarbonCreditInput {
  project_name: string;
  credit_type?: string;
  price_per_ton: number;
  available_tons: number;
  vintage_year?: number;
  verification_standard?: string;
  location?: string;
  project_description?: string;
}

export interface UpdateCarbonCreditInput extends Partial<CreateCarbonCreditInput> {
  id: number;
}
