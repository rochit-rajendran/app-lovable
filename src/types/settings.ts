export type Currency = 'EUR' | 'USD' | 'SEK' | 'GBP' | 'CHF' | 'NOK' | 'DKK' | 'JPY';

export type ThemePreference = 'light' | 'dark' | 'system';
export type TableDensity = 'comfortable' | 'compact';
export type LandingPage = '/' | '/bonds' | '/portfolios' | '/watchlists' | '/comparisons';

export interface TenantBranding {
  organizationName: string;
  tenantId: string;
  region: string;
  userCount: number;
  logoUrl: string | null;
}

export interface CurrencyPreferences {
  defaultCurrency: Currency;
  fxSource: string;
  fxReferenceDate: string;
}

export interface PlatformCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface DataDefaults {
  normalizationBasis: string;
  preferredReportingYear: 'latest' | 'previous' | 'two_years';
}

export interface UserPreferences {
  defaultLandingPage: LandingPage;
  tableDensity: TableDensity;
  theme: ThemePreference;
}

export interface TenantSettings {
  branding: TenantBranding;
  currency: CurrencyPreferences;
  capabilities: PlatformCapability[];
  dataDefaults: DataDefaults;
  userPreferences: UserPreferences;
}
