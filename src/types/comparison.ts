export type ComparisonType = 'bond' | 'portfolio' | 'issuer';

export interface SavedComparison {
  id: string;
  name: string;
  type: ComparisonType;
  itemIds: string[]; // bond IDs, portfolio IDs, or issuer names
  createdAt: string;
  updatedAt: string;
}

// Unified shape that all comparison subjects (bond, portfolio, issuer) normalise into
export interface ComparisonSubject {
  id: string;
  label: string;        // display name
  subLabel?: string;     // e.g. issuer name for bonds, type for portfolios
  currency: string;
  bondCount: number;
  totalIssuance: number; // total sustainable issuance
  uopAllocation: ComparisonUoP[];
  sdgAllocation: ComparisonSDG[];
  impactKPIs: ComparisonKPI[];
  coverage: ComparisonCoverage;
}

export interface ComparisonUoP {
  category: string;
  amount: number;
  percentage: number;
}

export interface ComparisonSDG {
  sdgNumber: number;
  sdgName: string;
  amount: number;
  percentage: number;
}

export interface ComparisonKPI {
  name: string;
  totalValue: number;
  normalizedValue: number; // per €1M financed
  unit: string;
  bondCount: number;
  methodology?: string;
}

export interface ComparisonCoverage {
  bondsWithFramework: number;
  bondsWithSPO: number;
  bondsWithImpactReport: number;
  reportingCompleteness: number; // 0-100
  frameworks: string[];
  spoProviders: string[];
}
