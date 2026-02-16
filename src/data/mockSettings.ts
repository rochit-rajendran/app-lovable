import { TenantSettings } from '@/types/settings';

export const mockSettings: TenantSettings = {
  branding: {
    organizationName: 'Nordic Capital Advisors',
    tenantId: 'NCA-2024-001',
    region: 'Nordics & Europe',
    userCount: 14,
    logoUrl: null,
  },
  currency: {
    defaultCurrency: 'EUR',
    fxSource: 'ECB Daily Reference Rates',
    fxReferenceDate: 'T-1 close',
  },
  capabilities: [
    { id: 'portfolios', name: 'Portfolios & Watchlists', description: 'Create and manage bond collections', enabled: true },
    { id: 'portfolio-dash', name: 'Portfolio Dashboards', description: 'Aggregated ESG intelligence per portfolio', enabled: true },
    { id: 'bond-comparison', name: 'Bond Comparison', description: 'Side-by-side bond ESG analysis', enabled: true },
    { id: 'portfolio-comparison', name: 'Portfolio Comparison', description: 'Compare portfolio ESG profiles', enabled: true },
    { id: 'issuer-comparison', name: 'Issuer Comparison', description: 'Cross-issuer sustainability benchmarking', enabled: true },
    { id: 'impact-normalization', name: 'Impact Normalization', description: 'Per-unit-of-capital impact metrics', enabled: true },
    { id: 'pdf-exports', name: 'PDF Exports', description: 'Committee-ready ESG reports', enabled: true },
    { id: 'csv-exports', name: 'CSV Exports', description: 'Structured data for analysis workflows', enabled: true },
    { id: 'framework-deep-dives', name: 'Framework Deep Dives', description: 'Full framework & SPO analysis', enabled: false },
  ],
  dataDefaults: {
    normalizationBasis: 'per €1m financed',
    preferredReportingYear: 'latest',
  },
  userPreferences: {
    defaultLandingPage: '/',
    tableDensity: 'comfortable',
    theme: 'system',
  },
};
