export interface Issuer {
  id: string;
  name: string;
  country: string;
  sector: string;
  subSector?: string;
  issuerType: 'Corporate' | 'Sovereign' | 'Municipal' | 'Supranational';
  sustainableBondCount: number;
  totalSustainableIssuance: number;
  currency: string;
  description?: string;
  frameworks: IssuerFramework[];
}

export interface IssuerFramework {
  name: string;
  version?: string;
  date?: string;
  status: 'Active' | 'Superseded' | 'Draft';
}
