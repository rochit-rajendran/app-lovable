// Integrations Hub Types — BondDB API & Integrations

export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiScope {
  id: string;
  label: string;
  description: string;
  entitled: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdDate: string;
  lastUsed: string | null;
  scopes: string[];
  status: ApiKeyStatus;
  expiresAt: string | null;
}

export interface ApiEndpoint {
  method: 'GET';
  path: string;
  name: string;
  description: string;
  scope: string;
  exampleRequest: string;
  exampleResponse: string;
  fields: { name: string; type: string; description: string }[];
  notes: string[];
}

export interface ApiEndpointGroup {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export interface UsageStats {
  requests24h: number;
  requests7d: number;
  lastRequestTimestamp: string | null;
  topEndpoints: { endpoint: string; count: number }[];
  softRateLimit: string;
}

export interface IntegrationsOverview {
  apiAccessEnabled: boolean;
  lastDataRefresh: string;
  defaultCurrency: string;
  activeKeyCount: number;
}
