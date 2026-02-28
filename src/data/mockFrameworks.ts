import { Framework } from '@/types/framework';

export const mockFrameworks: Record<string, Framework> = {
  'fw-eib-cab': {//F001 - framework
    id: 'fw-eib-cab',
    name: 'EIB Climate Awareness Bond Framework', // framework name - from framework
    issuer: 'European Investment Bank', //issuer - from framework
    year: 2023, // year - framework
    type: 'Green',
    status: 'Active',
    currency: 'EUR',
    bondTypesCovered: ['Senior Unsecured', 'Green Bond'],
    alignments: [
      { standard: 'ICMA Green Bond Principles', version: '2021', status: 'Aligned' },
      { standard: 'EU Green Bond Standard', status: 'Aligned' },
      { standard: 'Climate Bonds Standard', version: 'v4.0', status: 'Aligned' },
    ],
    spoProvider: 'Sustainalytics',
    spoDate: '2023-08-15',
    spoSummary: 'Sustainalytics considers the EIB Climate Awareness Bond Framework to be credible, impactful, and aligned with the four core components of the ICMA Green Bond Principles 2021. Key strengths include a robust project selection process, transparent allocation reporting, and strong impact measurement. Sustainalytics recommends enhanced disclosure on taxonomy alignment at the activity level.',
    useOfProceedsCategories: [
      { category: 'Renewable Energy', description: 'Wind, solar, hydroelectric, and geothermal power generation projects.', sdgs: [7, 13] },
      { category: 'Clean Transportation', description: 'Zero-emission public transit, rail electrification, and cycling infrastructure.', sdgs: [9, 11, 13] },
      { category: 'Green Buildings', description: 'Energy-efficient construction meeting NZEB or equivalent standards.', sdgs: [11, 13] },
      { category: 'Energy Efficiency', description: 'Industrial and building energy efficiency improvement projects.', sdgs: [7, 9] },
      { category: 'Water Management', description: 'Sustainable water treatment, distribution, and flood prevention.', sdgs: [6, 14] },
    ],
    eligibilityCriteria: [
      {
        category: 'Renewable Energy',
        sdgs: [7, 13],
        criteria: [
          'Solar PV and concentrated solar with lifecycle emissions < 100 gCO₂e/kWh',
          'Onshore and offshore wind projects',
          'Hydroelectric with power density > 5 W/m² or lifecycle emissions < 100 gCO₂e/kWh',
          'Geothermal with lifecycle emissions < 100 gCO₂e/kWh',
        ],
        spoAssessment: 'Aligned',
        spoComment: 'Sustainalytics considers the criteria to be robust and aligned with best market practices.',
      },
      {
        category: 'Clean Transportation',
        sdgs: [9, 11, 13],
        criteria: [
          'Electrified rail infrastructure (new and upgraded)',
          'Zero-emission public transit fleet (battery electric and hydrogen)',
          'Cycling infrastructure and pedestrian mobility projects',
          'Electric vehicle charging infrastructure',
        ],
        spoAssessment: 'Aligned',
      },
      {
        category: 'Green Buildings',
        sdgs: [11, 13],
        criteria: [
          'New buildings achieving top 15% energy performance in jurisdiction',
          'Renovations achieving 30%+ energy savings vs pre-renovation baseline',
          'NZEB-compliant construction (EU Energy Performance of Buildings Directive)',
        ],
        spoAssessment: 'Aligned with recommendations',
        spoComment: 'Sustainalytics recommends EIB clarify minimum certification standards for non-EU projects.',
      },
      {
        category: 'Energy Efficiency',
        sdgs: [7, 9],
        criteria: [
          'Industrial process efficiency improvements with measurable energy reduction',
          'District heating and cooling network upgrades',
          'Smart grid technologies enabling demand response',
        ],
        spoAssessment: 'Aligned',
      },
      {
        category: 'Water Management',
        sdgs: [6, 14],
        criteria: [
          'Water treatment plants with reduced energy consumption',
          'Flood defence and climate adaptation infrastructure',
          'Sustainable urban drainage systems',
        ],
        spoAssessment: 'Partially aligned',
        spoComment: 'Sustainalytics notes that certain flood defence projects may lack quantified climate adaptation metrics.',
      },
    ],
    allocationSummary: [
      { category: 'Renewable Energy', allocatedAmount: 2500000000, allocatedPercentage: 50 },
      { category: 'Clean Transportation', allocatedAmount: 1500000000, allocatedPercentage: 30 },
      { category: 'Green Buildings', allocatedAmount: 750000000, allocatedPercentage: 15 },
      { category: 'Energy Efficiency', allocatedAmount: 0, allocatedPercentage: 0 },
      { category: 'Water Management', allocatedAmount: 0, allocatedPercentage: 0 },
    ],
    allocationCurrency: 'EUR',
    linkedBondIds: ['1'],
    documents: [
      { name: 'EIB Climate Awareness Bond Framework v3.0', type: 'Framework', provider: 'European Investment Bank', date: '2023-06-01' },
      { name: 'Second Party Opinion – EIB CAB Framework', type: 'SPO', provider: 'Sustainalytics', date: '2023-08-15' },
      { name: 'ICMA GBP Guidance Handbook 2022', type: 'Guidance', provider: 'ICMA', date: '2022-06-01' },
    ],
  },
  'fw-vw-sf': {
    id: 'fw-vw-sf',
    name: 'Volkswagen Sustainability Financing Framework',
    issuer: 'Volkswagen AG',
    year: 2024,
    type: 'Sustainability',
    status: 'Active',
    currency: 'EUR',
    bondTypesCovered: ['Green Bond', 'Sustainability Bond', 'Sustainability-Linked Bond'],
    alignments: [
      { standard: 'ICMA Green Bond Principles', version: '2021', status: 'Aligned' },
      { standard: 'ICMA Sustainability Bond Guidelines', status: 'Aligned' },
      { standard: 'EU Green Bond Standard', status: 'Partially Aligned' },
    ],
    spoProvider: 'ISS ESG',
    spoDate: '2024-02-20',
    spoSummary: 'ISS ESG assesses the Volkswagen Sustainability Financing Framework as aligned with the ICMA Green Bond Principles and Sustainability Bond Guidelines. The framework demonstrates a credible commitment to electrification. ISS ESG notes that taxonomy alignment for battery production activities requires further substantiation, and recommends enhanced lifecycle assessment disclosures for battery materials sourcing.',
    useOfProceedsCategories: [
      { category: 'Electric Vehicle Production', description: 'Scaling manufacturing capacity for battery electric vehicles.', sdgs: [7, 9, 13] },
      { category: 'Battery Technology', description: 'R&D and production of next-generation battery cells.', sdgs: [9, 12] },
      { category: 'Circular Economy', description: 'End-of-life vehicle recycling and materials recovery.', sdgs: [12] },
    ],
    eligibilityCriteria: [
      {
        category: 'Electric Vehicle Production',
        sdgs: [7, 9, 13],
        criteria: [
          'Battery electric vehicle manufacturing facilities',
          'Conversion of ICE production lines to EV production',
          'EV platform development (MEB and SSP platforms)',
          'Zero-emission vehicle testing and validation infrastructure',
        ],
        spoAssessment: 'Aligned',
        spoComment: 'ISS ESG considers the EV criteria robust and well-defined, with clear links to emissions reduction targets.',
      },
      {
        category: 'Battery Technology',
        sdgs: [9, 12],
        criteria: [
          'Solid-state and lithium-ion battery cell production',
          'Battery R&D for improved energy density and longevity',
          'Responsible sourcing programs for critical minerals (lithium, cobalt, nickel)',
        ],
        spoAssessment: 'Aligned with recommendations',
        spoComment: 'ISS ESG recommends Volkswagen disclose full lifecycle emissions for battery production, including upstream mining impacts.',
      },
      {
        category: 'Circular Economy',
        sdgs: [12],
        criteria: [
          'Battery recycling and second-life applications',
          'Vehicle materials recovery exceeding 95% by weight',
          'Closed-loop manufacturing processes',
        ],
        spoAssessment: 'Partially aligned',
        spoComment: 'Circular economy criteria are broadly defined; ISS ESG recommends more granular quantitative thresholds.',
      },
    ],
    allocationSummary: [
      { category: 'Electric Vehicle Production', allocatedAmount: 1200000000, allocatedPercentage: 60 },
      { category: 'Battery Technology', allocatedAmount: 600000000, allocatedPercentage: 30 },
      { category: 'Circular Economy', allocatedAmount: 0, allocatedPercentage: 0 },
    ],
    allocationCurrency: 'EUR',
    linkedBondIds: ['3'],
    documents: [
      { name: 'VW Sustainability Financing Framework v1.0', type: 'Framework', provider: 'Volkswagen AG', date: '2024-01-15' },
      { name: 'ISS ESG Second Party Opinion', type: 'SPO', provider: 'ISS ESG', date: '2024-02-20' },
    ],
  },
  'fw-edf-gb': {
    id: 'fw-edf-gb',
    name: 'EDF Green Bond Framework',
    issuer: 'Électricité de France',
    year: 2024,
    type: 'Green',
    status: 'Active',
    currency: 'EUR',
    bondTypesCovered: ['Green Bond'],
    alignments: [
      { standard: 'ICMA Green Bond Principles', version: '2021', status: 'Aligned' },
      { standard: 'EU Green Bond Standard', status: 'Partially Aligned' },
    ],
    spoProvider: 'Vigeo Eiris (V.E)',
    spoDate: '2024-05-10',
    spoSummary: 'Vigeo Eiris considers the EDF Green Bond Framework to provide a credible and robust approach to green bond issuance. The framework clearly defines eligible project categories with quantitative thresholds. V.E notes that nuclear energy eligibility is contingent on compliance with the EU Complementary Delegated Act conditions, and recommends transparent reporting on radioactive waste management practices.',
    useOfProceedsCategories: [
      { category: 'Nuclear Energy', description: 'Lifecycle extension and safety upgrades for existing nuclear fleet.', sdgs: [7, 13] },
      { category: 'Grid Infrastructure', description: 'Grid modernization for renewable energy integration.', sdgs: [7, 9] },
      { category: 'Renewable Energy', description: 'Onshore and offshore wind, solar PV development.', sdgs: [7, 13] },
    ],
    eligibilityCriteria: [
      {
        category: 'Nuclear Energy',
        sdgs: [7, 13],
        criteria: [
          'Lifecycle extension of existing nuclear plants meeting EU Taxonomy Complementary Delegated Act conditions',
          'Safety system upgrades to meet post-Fukushima regulatory standards',
          'Nuclear waste management compliant with national and IAEA standards',
        ],
        spoAssessment: 'Aligned with recommendations',
        spoComment: 'V.E recommends EDF provide enhanced transparency on radioactive waste storage timelines and decommissioning provisions.',
      },
      {
        category: 'Grid Infrastructure',
        sdgs: [7, 9],
        criteria: [
          'High-voltage transmission lines enabling renewable energy transport',
          'Smart grid systems for demand-side management',
          'Cross-border interconnectors improving grid resilience',
        ],
        spoAssessment: 'Aligned',
      },
      {
        category: 'Renewable Energy',
        sdgs: [7, 13],
        criteria: [
          'Onshore wind with capacity factor > 25%',
          'Offshore wind projects',
          'Solar PV installations > 5 MW capacity',
        ],
        spoAssessment: 'Aligned',
        spoComment: 'Renewable energy criteria are considered best-in-class by V.E.',
      },
    ],
    allocationSummary: [
      { category: 'Nuclear Energy', allocatedAmount: 750000000, allocatedPercentage: 50 },
      { category: 'Grid Infrastructure', allocatedAmount: 600000000, allocatedPercentage: 40 },
      { category: 'Renewable Energy', allocatedAmount: 0, allocatedPercentage: 0 },
    ],
    allocationCurrency: 'EUR',
    linkedBondIds: ['4'],
    documents: [
      { name: 'EDF Green Bond Framework v2.0', type: 'Framework', provider: 'Électricité de France', date: '2024-04-01' },
      { name: 'Vigeo Eiris Second Party Opinion', type: 'SPO', provider: 'Vigeo Eiris (V.E)', date: '2024-05-10' },
    ],
  },
  'fw-norway-gb': {
    id: 'fw-norway-gb',
    name: 'Norwegian Government Green Bond Framework',
    issuer: 'Kingdom of Norway',
    year: 2024,
    type: 'Green',
    status: 'Active',
    currency: 'NOK',
    bondTypesCovered: ['Sovereign Green Bond'],
    alignments: [
      { standard: 'ICMA Green Bond Principles', version: '2021', status: 'Aligned' },
      { standard: 'EU Green Bond Standard', status: 'Aligned' },
      { standard: 'Climate Bonds Standard', version: 'v4.0', status: 'Aligned' },
    ],
    spoProvider: 'CICERO',
    spoDate: '2025-01-10',
    spoSummary: 'CICERO assigns a Dark Green shading to the Norwegian Government Green Bond Framework, reflecting the highest level of climate ambition. The framework demonstrates a clear alignment with Norway\'s long-term climate strategy. CICERO highlights the inclusion of ocean conservation as a distinctive strength and notes strong governance and transparency practices. No material weaknesses were identified.',
    useOfProceedsCategories: [
      { category: 'Climate Mitigation', description: 'Government expenditures on carbon capture, renewable subsidies, and emissions reduction.', sdgs: [7, 13] },
      { category: 'Ocean Conservation', description: 'Marine biodiversity protection and sustainable fisheries.', sdgs: [14, 15] },
      { category: 'Climate Adaptation', description: 'Infrastructure resilience and flood protection.', sdgs: [11, 13] },
    ],
    eligibilityCriteria: [
      {
        category: 'Climate Mitigation',
        sdgs: [7, 13],
        criteria: [
          'Carbon capture and storage (CCS) projects with permanent geological storage',
          'Renewable energy subsidies and feed-in tariffs',
          'Energy efficiency programs in public buildings',
          'Electric vehicle purchase incentives and charging infrastructure',
        ],
        spoAssessment: 'Aligned',
        spoComment: 'CICERO considers all climate mitigation activities to be consistent with a well-below 2°C pathway.',
      },
      {
        category: 'Ocean Conservation',
        sdgs: [14, 15],
        criteria: [
          'Marine protected area establishment and enforcement',
          'Sustainable aquaculture certification programs',
          'Ocean plastic remediation and waste management',
          'Marine ecosystem research and monitoring',
        ],
        spoAssessment: 'Aligned',
        spoComment: 'CICERO highlights this as a distinctive and progressive category, well-aligned with Norway\'s ocean economy strategy.',
      },
      {
        category: 'Climate Adaptation',
        sdgs: [11, 13],
        criteria: [
          'Coastal flood defence infrastructure',
          'Climate-resilient water supply systems',
          'Urban heat island mitigation',
        ],
        spoAssessment: 'Aligned with recommendations',
        spoComment: 'CICERO recommends Norway establish clearer adaptation metrics and baselines for measuring resilience outcomes.',
      },
    ],
    allocationSummary: [
      { category: 'Climate Mitigation', allocatedAmount: 5000000000, allocatedPercentage: 50 },
      { category: 'Ocean Conservation', allocatedAmount: 4000000000, allocatedPercentage: 40 },
      { category: 'Climate Adaptation', allocatedAmount: 0, allocatedPercentage: 0 },
    ],
    allocationCurrency: 'NOK',
    linkedBondIds: ['9'],
    documents: [
      { name: 'Norwegian Government Green Bond Framework v1.0', type: 'Framework', provider: 'Kingdom of Norway', date: '2024-12-01' },
      { name: 'CICERO Second Party Opinion', type: 'SPO', provider: 'CICERO', date: '2025-01-10' },
      { name: 'Nordic Council Green Bond Guidance', type: 'Guidance', provider: 'Nordic Council', date: '2023-06-15' },
    ],
  },
};

// Helper to find framework by issuer name
export function getFrameworksForIssuer(issuerName: string): Framework[] {
  return Object.values(mockFrameworks).filter(fw => fw.issuer === issuerName);
}

// Helper to find framework by ID
export function getFrameworkById(id: string): Framework | undefined {
  return mockFrameworks[id];
}
