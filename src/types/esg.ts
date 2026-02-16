// ESG Detail types for Bond Detail Page

export interface SDGAllocation {
  sdgNumber: number;
  sdgName: string;
  allocationAmount: number; // in bond currency
  allocationPercentage: number;
}

export interface ImpactKPI {
  name: string;
  value: number | string;
  unit: string;
  reportingYear: number;
  methodology?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  allocationAmount?: number;
  status: 'Planned' | 'Ongoing' | 'Completed';
  impactKPIs: ImpactKPI[];
}

export interface UseOfProceedsCategory {
  category: string;
  allocatedAmount: number;
  allocatedPercentage: number;
  description?: string;
  projects: Project[];
  impactKPIs: ImpactKPI[];
}

export interface FrameworkAlignment {
  framework: string;
  status: 'Aligned' | 'Partially Aligned' | 'Not Reported';
}

export interface ExternalReview {
  provider: string;
  type: 'SPO' | 'Verification' | 'Certification';
  date: string;
  documentUrl?: string;
}

export interface TaxonomyData {
  eligibleShare: number;
  alignedShare: number;
  reportedVsEstimated: 'Reported' | 'Estimated' | 'Mixed';
  activities: {
    name: string;
    eligibleShare: number;
    alignedShare: number;
  }[];
}

export interface BondDocument {
  name: string;
  type: 'Framework' | 'Allocation Report' | 'Impact Report' | 'SPO' | 'Assurance' | 'Other';
  provider?: string;
  date: string;
  url?: string;
}

export interface DataProvenance {
  sources: string[];
  lastUpdate: string;
  completeness: number; // 0-100
  notes?: string[];
}

export interface BondEsgDetail {
  bondId: string;
  bondLabel: 'Green' | 'Social' | 'Sustainability' | 'SLB' | 'Conventional';
  isClimateAligned: boolean;
  sdgAllocations: SDGAllocation[];
  useOfProceeds: UseOfProceedsCategory[];
  unallocatedAmount?: number;
  unallocatedPercentage?: number;
  frameworks: FrameworkAlignment[];
  externalReviews: ExternalReview[];
  taxonomy?: TaxonomyData;
  documents: BondDocument[];
  dataProvenance: DataProvenance;
}
