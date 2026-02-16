import type { ApiKey, ApiScope, ApiEndpointGroup, UsageStats, IntegrationsOverview } from '@/types/integrations';

export const mockIntegrationsOverview: IntegrationsOverview = {
  apiAccessEnabled: true,
  lastDataRefresh: '2026-02-07T06:00:00Z',
  defaultCurrency: 'EUR',
  activeKeyCount: 2,
};

export const mockApiScopes: ApiScope[] = [
  { id: 'read:bonds', label: 'Bonds', description: 'Access bond universe, details, and ESG metadata', entitled: true },
  { id: 'read:issuers', label: 'Issuers', description: 'Access issuer profiles and sustainability strategies', entitled: true },
  { id: 'read:portfolios', label: 'Portfolios', description: 'Access portfolio holdings and aggregates', entitled: true },
  { id: 'read:allocations_uop', label: 'Use of Proceeds', description: 'Access UoP allocation breakdowns', entitled: true },
  { id: 'read:allocations_sdg', label: 'SDG Allocations', description: 'Access SDG alignment and allocation data', entitled: true },
  { id: 'read:kpis', label: 'Impact KPIs', description: 'Access impact KPIs (raw and normalized per currency unit)', entitled: true },
  { id: 'read:documents', label: 'Documents', description: 'Access framework documents and SPOs', entitled: false },
  { id: 'read:exports', label: 'Exports', description: 'Access generated PDF/CSV export metadata', entitled: false },
];

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key-001',
    name: 'Power BI – ESG Reporting',
    description: 'Weekly ESG dashboard refresh for investment committee',
    createdBy: 'Anna Lindqvist',
    createdDate: '2026-01-15T09:30:00Z',
    lastUsed: '2026-02-07T06:12:00Z',
    scopes: ['read:bonds', 'read:portfolios', 'read:allocations_uop', 'read:kpis'],
    status: 'active',
    expiresAt: null,
  },
  {
    id: 'key-002',
    name: 'Excel – Portfolio Monitoring',
    description: 'Daily holdings check via Power Query',
    createdBy: 'Erik Johansson',
    createdDate: '2026-01-20T14:00:00Z',
    lastUsed: '2026-02-06T15:45:00Z',
    scopes: ['read:bonds', 'read:portfolios'],
    status: 'active',
    expiresAt: '2026-04-20T14:00:00Z',
  },
  {
    id: 'key-003',
    name: 'Legacy Data Pull',
    description: null,
    createdBy: 'Anna Lindqvist',
    createdDate: '2025-11-01T10:00:00Z',
    lastUsed: '2025-12-15T08:00:00Z',
    scopes: ['read:bonds'],
    status: 'revoked',
    expiresAt: null,
  },
];

export const mockApiCatalog: ApiEndpointGroup[] = [
  {
    name: 'Bonds',
    description: 'Access the full bond universe with ESG metadata, framework references, and financial context.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/bonds',
        name: 'List Bonds',
        description: 'Returns the full bond universe for your tenant. Supports pagination, filtering by issuer, currency, and green bond status.',
        scope: 'read:bonds',
        exampleRequest: 'GET /v1/bonds?currency=EUR&green=true&updated_since=2026-02-01&page=1&limit=50',
        exampleResponse: `{
  "data": [
    {
      "isin": "XS1234567890",
      "name": "Green Bond 2030",
      "issuer": "Nordic Energy Corp",
      "currency": "EUR",
      "amount_issued": 500000000,
      "maturity_date": "2030-06-15",
      "green_bond": true,
      "framework_id": "FW-001",
      "updated_at": "2026-02-07T06:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 842 }
}`,
        fields: [
          { name: 'isin', type: 'string', description: 'ISIN identifier' },
          { name: 'name', type: 'string', description: 'Bond display name' },
          { name: 'issuer', type: 'string', description: 'Issuer name' },
          { name: 'currency', type: 'string', description: 'Issuance currency (ISO 4217)' },
          { name: 'amount_issued', type: 'number', description: 'Face value in issuance currency' },
          { name: 'maturity_date', type: 'string', description: 'Maturity date (ISO 8601)' },
          { name: 'green_bond', type: 'boolean', description: 'Whether classified as green bond' },
          { name: 'framework_id', type: 'string', description: 'Associated framework identifier' },
          { name: 'updated_at', type: 'string', description: 'Last data update timestamp' },
        ],
        notes: ['Data refreshed weekly (Saturdays 06:00 UTC)', 'Use updated_since for incremental refresh in Power BI'],
      },
      {
        method: 'GET',
        path: '/v1/bonds/{isin}',
        name: 'Get Bond Detail',
        description: 'Returns full ESG detail for a specific bond including allocations, KPIs, and framework alignment.',
        scope: 'read:bonds',
        exampleRequest: 'GET /v1/bonds/XS1234567890',
        exampleResponse: `{
  "isin": "XS1234567890",
  "name": "Green Bond 2030",
  "issuer": "Nordic Energy Corp",
  "currency": "EUR",
  "amount_issued": 500000000,
  "esg_rating": "Strong",
  "uop_categories": ["Renewable Energy", "Energy Efficiency"],
  "sdg_alignment": [7, 13],
  "framework_id": "FW-001"
}`,
        fields: [
          { name: 'esg_rating', type: 'string', description: 'ESG assessment rating' },
          { name: 'uop_categories', type: 'string[]', description: 'Use of proceeds categories' },
          { name: 'sdg_alignment', type: 'number[]', description: 'Aligned UN SDG numbers' },
        ],
        notes: ['Includes all fields from list endpoint plus ESG detail'],
      },
    ],
  },
  {
    name: 'Issuers',
    description: 'Access issuer profiles including sustainability strategy and framework references.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/issuers',
        name: 'List Issuers',
        description: 'Returns all issuers in the universe with bond counts and sector classifications.',
        scope: 'read:issuers',
        exampleRequest: 'GET /v1/issuers?sector=utilities&page=1&limit=25',
        exampleResponse: `{
  "data": [
    {
      "id": "ISS-001",
      "name": "Nordic Energy Corp",
      "sector": "Utilities",
      "country": "Sweden",
      "bond_count": 12,
      "total_issued_eur": 4500000000
    }
  ],
  "pagination": { "page": 1, "limit": 25, "total": 156 }
}`,
        fields: [
          { name: 'id', type: 'string', description: 'Issuer identifier' },
          { name: 'name', type: 'string', description: 'Issuer name' },
          { name: 'sector', type: 'string', description: 'Industry sector' },
          { name: 'country', type: 'string', description: 'Country of domicile' },
          { name: 'bond_count', type: 'number', description: 'Active bonds count' },
        ],
        notes: [],
      },
      {
        method: 'GET',
        path: '/v1/issuers/{issuer_id}',
        name: 'Get Issuer Detail',
        description: 'Returns full issuer profile with sustainability strategy and linked frameworks.',
        scope: 'read:issuers',
        exampleRequest: 'GET /v1/issuers/ISS-001',
        exampleResponse: `{
  "id": "ISS-001",
  "name": "Nordic Energy Corp",
  "sector": "Utilities",
  "country": "Sweden",
  "sustainability_strategy": "Net zero by 2040",
  "frameworks": ["FW-001", "FW-003"],
  "bond_count": 12
}`,
        fields: [
          { name: 'sustainability_strategy', type: 'string', description: 'Issuer sustainability commitment' },
          { name: 'frameworks', type: 'string[]', description: 'Associated framework IDs' },
        ],
        notes: [],
      },
    ],
  },
  {
    name: 'Portfolios',
    description: 'Access portfolio holdings, aggregates, and ESG profiles.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/portfolios',
        name: 'List Portfolios',
        description: 'Returns all portfolios for your tenant with summary metrics.',
        scope: 'read:portfolios',
        exampleRequest: 'GET /v1/portfolios',
        exampleResponse: `{
  "data": [
    {
      "id": "PF-001",
      "name": "ESG Core Fund",
      "type": "live",
      "holdings_count": 45,
      "total_value_eur": 125000000,
      "green_share_pct": 78.5
    }
  ]
}`,
        fields: [
          { name: 'id', type: 'string', description: 'Portfolio identifier' },
          { name: 'type', type: 'string', description: 'Portfolio type: live, model, or research' },
          { name: 'green_share_pct', type: 'number', description: 'Percentage of green-classified holdings' },
        ],
        notes: [],
      },
      {
        method: 'GET',
        path: '/v1/portfolios/{portfolio_id}/holdings',
        name: 'Get Portfolio Holdings',
        description: 'Returns individual holdings with weights, ESG ratings, and allocation data.',
        scope: 'read:portfolios',
        exampleRequest: 'GET /v1/portfolios/PF-001/holdings',
        exampleResponse: `{
  "portfolio_id": "PF-001",
  "holdings": [
    {
      "isin": "XS1234567890",
      "name": "Green Bond 2030",
      "weight_pct": 3.2,
      "market_value_eur": 4000000,
      "esg_rating": "Strong"
    }
  ]
}`,
        fields: [
          { name: 'weight_pct', type: 'number', description: 'Portfolio weight (%)' },
          { name: 'market_value_eur', type: 'number', description: 'Market value in tenant currency' },
        ],
        notes: ['Values converted using tenant default currency'],
      },
    ],
  },
  {
    name: 'Allocations',
    description: 'Access Use of Proceeds and SDG allocation data at bond, portfolio, or issuer level.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/allocations/uop',
        name: 'Use of Proceeds Allocations',
        description: 'Returns UoP category breakdowns for a bond, portfolio, or issuer.',
        scope: 'read:allocations_uop',
        exampleRequest: 'GET /v1/allocations/uop?entity_type=bond&entity_id=XS1234567890',
        exampleResponse: `{
  "entity_type": "bond",
  "entity_id": "XS1234567890",
  "allocations": [
    { "category": "Renewable Energy", "share_pct": 65.0, "amount_eur": 325000000 },
    { "category": "Energy Efficiency", "share_pct": 35.0, "amount_eur": 175000000 }
  ]
}`,
        fields: [
          { name: 'category', type: 'string', description: 'ICMA UoP category' },
          { name: 'share_pct', type: 'number', description: 'Share of total allocation (%)' },
          { name: 'amount_eur', type: 'number', description: 'Allocated amount in tenant currency' },
        ],
        notes: ['Allocation data based on issuer-reported frameworks', 'Amounts in tenant default currency'],
      },
      {
        method: 'GET',
        path: '/v1/allocations/sdg',
        name: 'SDG Allocations',
        description: 'Returns SDG alignment breakdowns for a bond, portfolio, or issuer.',
        scope: 'read:allocations_sdg',
        exampleRequest: 'GET /v1/allocations/sdg?entity_type=portfolio&entity_id=PF-001',
        exampleResponse: `{
  "entity_type": "portfolio",
  "entity_id": "PF-001",
  "allocations": [
    { "sdg": 7, "label": "Affordable and Clean Energy", "share_pct": 42.0 },
    { "sdg": 13, "label": "Climate Action", "share_pct": 31.0 },
    { "sdg": 11, "label": "Sustainable Cities", "share_pct": 18.0 }
  ]
}`,
        fields: [
          { name: 'sdg', type: 'number', description: 'UN SDG number (1–17)' },
          { name: 'label', type: 'string', description: 'SDG name' },
          { name: 'share_pct', type: 'number', description: 'Allocation share (%)' },
        ],
        notes: [],
      },
    ],
  },
  {
    name: 'Impact KPIs',
    description: 'Access impact KPIs including raw values and normalized per-unit-of-capital metrics.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/kpis',
        name: 'Impact KPIs',
        description: 'Returns impact KPIs for a bond, portfolio, or issuer. Includes both raw reported values and normalized metrics (per €1m financed).',
        scope: 'read:kpis',
        exampleRequest: 'GET /v1/kpis?entity_type=bond&entity_id=XS1234567890',
        exampleResponse: `{
  "entity_type": "bond",
  "entity_id": "XS1234567890",
  "kpis": [
    {
      "name": "CO₂ Avoided",
      "value": 12500,
      "unit": "tCO₂e/year",
      "normalized_value": 25.0,
      "normalized_unit": "tCO₂e per €1m financed",
      "reporting_year": 2025,
      "data_type": "reported"
    },
    {
      "name": "Renewable Energy Generated",
      "value": 85000,
      "unit": "MWh/year",
      "normalized_value": 170.0,
      "normalized_unit": "MWh per €1m financed",
      "reporting_year": 2025,
      "data_type": "estimated"
    }
  ]
}`,
        fields: [
          { name: 'name', type: 'string', description: 'KPI metric name' },
          { name: 'value', type: 'number', description: 'Raw reported value' },
          { name: 'unit', type: 'string', description: 'Measurement unit' },
          { name: 'normalized_value', type: 'number', description: 'Value per unit of capital invested' },
          { name: 'normalized_unit', type: 'string', description: 'Normalization unit description' },
          { name: 'data_type', type: 'string', description: '"reported" or "estimated"' },
        ],
        notes: [
          'Normalization basis determined by tenant settings (default: per €1m financed)',
          'Data type clearly labeled: "reported" = issuer-disclosed, "estimated" = BondDB modeled',
        ],
      },
    ],
  },
];

export const mockUsageStats: UsageStats = {
  requests24h: 127,
  requests7d: 843,
  lastRequestTimestamp: '2026-02-10T08:32:00Z',
  topEndpoints: [
    { endpoint: 'GET /v1/bonds', count: 312 },
    { endpoint: 'GET /v1/kpis', count: 198 },
    { endpoint: 'GET /v1/portfolios/{id}/holdings', count: 156 },
    { endpoint: 'GET /v1/allocations/uop', count: 102 },
    { endpoint: 'GET /v1/allocations/sdg', count: 75 },
  ],
  softRateLimit: '1,000 requests per hour per API key. If you need higher limits, contact your BondDB account manager.',
};
