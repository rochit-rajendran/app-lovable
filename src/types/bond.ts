export interface Bond {
  id: string;
  isin: string;
  name: string;
  issuer: string;
  issuerType: 'Corporate' | 'Sovereign' | 'Municipal' | 'Supranational';
  sector: string;
  country: string;
  currency: string;
  couponRate: number;
  maturityDate: string;
  issueDate: string;
  faceValue: number;
  currentPrice: number;
  yield: number;
  yieldToMaturity: number;
  duration: number;
  modifiedDuration: number;
  creditRating: string;
  ratingAgency: string;
  outstandingAmount: number;
  tenor: number;
  bondSizeEur: number;
  label: 'Green' | 'Social' | 'Sustainability' | 'Sustainability-Linked';
  subsector: string;
  moodysRating?: string;
  spRating?: string;
  fitchRating?: string;
  // ESG & Sustainability
  isGreen: boolean;
  isSustainability: boolean;
  isClimateAligned: boolean;
  esgScore?: number;
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  greenBondFramework?: string;
  useOfProceeds?: string[];
  // Risk metrics
  spreadToBenchmark: number;
  zSpread: number;
  volatility: number;
}

export interface BondFilter {
  search?: string;
  issuerTypes?: string[];
  sectors?: string[];
  countries?: string[];
  currencies?: string[];
  creditRatings?: string[];
  maturityRange?: [Date, Date];
  couponRange?: [number, number];
  labels?: string[];
  regions?: string[];
  subsectors?: string[];
}

export type SortField = 'name' | 'issuer' | 'yield' | 'maturityDate' | 'duration' | 'esgScore' | 'currentPrice';
export type SortDirection = 'asc' | 'desc';