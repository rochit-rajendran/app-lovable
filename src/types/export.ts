export type ExportFormat = 'pdf' | 'csv';

export type ExportTarget = 'portfolio' | 'comparison' | 'issuer';

export interface ExportConfig {
  format: ExportFormat;
  target: ExportTarget;
  title: string;
  subtitle?: string;
  reportingDate: string; // ISO date
  currency: string;
  sections: ExportSectionToggle[];
}

export interface ExportSectionToggle {
  id: string;
  label: string;
  enabled: boolean;
}

// Default section configs per export target
export const PORTFOLIO_SECTIONS: ExportSectionToggle[] = [
  { id: 'overview', label: 'Portfolio Overview', enabled: true },
  { id: 'sdg', label: 'SDG Allocation', enabled: true },
  { id: 'uop', label: 'Use of Proceeds Allocation', enabled: true },
  { id: 'geography', label: 'Geographic Exposure', enabled: true },
  { id: 'currency', label: 'Currency Exposure', enabled: true },
  { id: 'impact', label: 'Impact KPIs', enabled: true },
  { id: 'coverage', label: 'Coverage & Methodology', enabled: true },
  { id: 'holdings', label: 'Bond Holdings', enabled: true },
];

export const COMPARISON_SECTIONS: ExportSectionToggle[] = [
  { id: 'overview', label: 'Comparison Overview', enabled: true },
  { id: 'uop', label: 'Use of Proceeds Comparison', enabled: true },
  { id: 'sdg', label: 'SDG Comparison', enabled: true },
  { id: 'impact', label: 'Impact KPI Benchmarking', enabled: true },
  { id: 'coverage', label: 'Data Quality & Coverage', enabled: true },
  { id: 'summary', label: 'Summary Insights', enabled: true },
];

export const ISSUER_SECTIONS: ExportSectionToggle[] = [
  { id: 'snapshot', label: 'Issuer Snapshot', enabled: true },
  { id: 'uop', label: 'Use of Proceeds Allocation', enabled: true },
  { id: 'sdg', label: 'SDG Allocation', enabled: true },
  { id: 'impact', label: 'Impact KPIs', enabled: true },
  { id: 'frameworks', label: 'Frameworks', enabled: true },
  { id: 'coverage', label: 'Reporting Coverage', enabled: true },
  { id: 'bonds', label: 'Bond List', enabled: true },
];
