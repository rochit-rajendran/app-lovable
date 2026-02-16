// Framework Detail types for Framework Detail Page

export interface EligibilityCriterion {
  category: string;
  sdgs: number[];
  criteria: string[];
  spoAssessment: 'Aligned' | 'Aligned with recommendations' | 'Partially aligned' | 'Not assessed';
  spoComment?: string;
}

export interface FrameworkUoPCategory {
  category: string;
  description?: string;
  sdgs: number[];
}

export interface FrameworkDocument {
  name: string;
  type: 'Framework' | 'SPO' | 'Guidance' | 'Other';
  provider?: string;
  date: string;
  url?: string;
}

export interface FrameworkAllocationSummary {
  category: string;
  allocatedAmount: number;
  allocatedPercentage: number;
}

export interface Framework {
  id: string;
  name: string;
  issuer: string; // matches issuer name key
  year: number;
  type: 'Green' | 'Social' | 'Sustainability';
  status: 'Active' | 'Superseded';
  currency?: string;
  bondTypesCovered: string[];
  alignments: {
    standard: string;
    version?: string;
    status: 'Aligned' | 'Partially Aligned' | 'Not Reported';
  }[];
  spoProvider?: string;
  spoDate?: string;
  spoSummary?: string;
  useOfProceedsCategories: FrameworkUoPCategory[];
  eligibilityCriteria: EligibilityCriterion[];
  allocationSummary: FrameworkAllocationSummary[]; // aggregate across all bonds using this framework
  allocationCurrency: string;
  linkedBondIds: string[]; // bond IDs that use this framework
  documents: FrameworkDocument[];
}
