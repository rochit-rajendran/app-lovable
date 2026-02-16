import { BondEsgDetail } from '@/types/esg';

export const mockEsgDetails: Record<string, BondEsgDetail> = {
  '1': {
    bondId: '1',
    bondLabel: 'Green',
    isClimateAligned: true,
    sdgAllocations: [
      { sdgNumber: 7, sdgName: 'Affordable and Clean Energy', allocationAmount: 2500000000, allocationPercentage: 50 },
      { sdgNumber: 9, sdgName: 'Industry, Innovation and Infrastructure', allocationAmount: 1250000000, allocationPercentage: 25 },
      { sdgNumber: 11, sdgName: 'Sustainable Cities and Communities', allocationAmount: 750000000, allocationPercentage: 15 },
      { sdgNumber: 13, sdgName: 'Climate Action', allocationAmount: 500000000, allocationPercentage: 10 },
    ],
    useOfProceeds: [
      {
        category: 'Renewable Energy',
        allocatedAmount: 2500000000,
        allocatedPercentage: 50,
        description: 'Financing wind, solar, and hydroelectric power generation projects across the EU.',
        projects: [
          { id: 'p1', name: 'North Sea Wind Farm Phase III', location: 'Netherlands', type: 'Offshore Wind', allocationAmount: 1200000000, status: 'Ongoing', impactKPIs: [
            { name: 'Installed capacity', value: 1200, unit: 'MW', reportingYear: 2025, methodology: 'Nameplate capacity at commissioning' },
            { name: 'Energy generated', value: 4380, unit: 'GWh/year', reportingYear: 2025, methodology: 'P50 estimate based on wind resource assessment' },
          ]},
          { id: 'p2', name: 'Iberian Solar Portfolio', location: 'Spain / Portugal', type: 'Solar PV', allocationAmount: 800000000, status: 'Completed', impactKPIs: [
            { name: 'Installed capacity', value: 650, unit: 'MW', reportingYear: 2024 },
            { name: 'Energy generated', value: 1170, unit: 'GWh/year', reportingYear: 2024 },
          ]},
          { id: 'p3', name: 'Alpine Hydropower Modernization', location: 'Austria', type: 'Hydroelectric', allocationAmount: 500000000, status: 'Ongoing', impactKPIs: [
            { name: 'Capacity upgrade', value: 320, unit: 'MW', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Total renewable capacity installed', value: 2170, unit: 'MW', reportingYear: 2025 },
          { name: 'Annual energy generated', value: 5550, unit: 'GWh/year', reportingYear: 2025 },
          { name: 'GHG emissions avoided', value: 2220000, unit: 'tCO₂e/year', reportingYear: 2025, methodology: 'Based on EU average grid emission factor of 0.4 tCO₂/MWh' },
        ],
      },
      {
        category: 'Clean Transportation',
        allocatedAmount: 1500000000,
        allocatedPercentage: 30,
        description: 'Investment in zero-emission public transit and rail electrification.',
        projects: [
          { id: 'p4', name: 'Scandinavian Rail Electrification', location: 'Sweden / Norway', type: 'Rail Infrastructure', allocationAmount: 900000000, status: 'Ongoing', impactKPIs: [
            { name: 'Track electrified', value: 480, unit: 'km', reportingYear: 2025 },
            { name: 'Diesel trains replaced', value: 45, unit: 'units', reportingYear: 2025 },
          ]},
          { id: 'p5', name: 'Paris Metro Fleet Renewal', location: 'France', type: 'Public Transit', allocationAmount: 600000000, status: 'Planned', impactKPIs: [
            { name: 'New electric trains', value: 120, unit: 'units', reportingYear: 2026 },
          ]},
        ],
        impactKPIs: [
          { name: 'GHG emissions avoided', value: 185000, unit: 'tCO₂e/year', reportingYear: 2025 },
          { name: 'Passengers served', value: 42000000, unit: 'passengers/year', reportingYear: 2025 },
        ],
      },
      {
        category: 'Green Buildings',
        allocatedAmount: 750000000,
        allocatedPercentage: 15,
        description: 'Energy-efficient commercial and residential construction meeting NZEB standards.',
        projects: [
          { id: 'p6', name: 'Berlin Net-Zero Office Complex', location: 'Germany', type: 'Commercial Real Estate', allocationAmount: 400000000, status: 'Completed', impactKPIs: [
            { name: 'Floor area', value: 85000, unit: 'm²', reportingYear: 2024 },
            { name: 'Energy savings vs baseline', value: 65, unit: '%', reportingYear: 2024 },
          ]},
          { id: 'p7', name: 'Helsinki Affordable Housing', location: 'Finland', type: 'Residential', allocationAmount: 350000000, status: 'Ongoing', impactKPIs: [
            { name: 'Housing units', value: 1200, unit: 'units', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Energy savings', value: 28500, unit: 'MWh/year', reportingYear: 2025 },
        ],
      },
    ],
    unallocatedAmount: 250000000,
    unallocatedPercentage: 5,
    frameworks: [
      { framework: 'ICMA Green Bond Principles (2021)', status: 'Aligned' },
      { framework: 'EU Green Bond Standard', status: 'Aligned' },
      { framework: 'Climate Bonds Standard v4.0', status: 'Aligned' },
    ],
    externalReviews: [
      { provider: 'Sustainalytics', type: 'SPO', date: '2023-08-15' },
      { provider: 'KPMG', type: 'Verification', date: '2024-09-30' },
    ],
    taxonomy: {
      eligibleShare: 95,
      alignedShare: 88,
      reportedVsEstimated: 'Reported',
      activities: [
        { name: 'Electricity generation from wind', eligibleShare: 50, alignedShare: 50 },
        { name: 'Electricity generation from solar', eligibleShare: 16, alignedShare: 16 },
        { name: 'Infrastructure for rail transport', eligibleShare: 18, alignedShare: 15 },
        { name: 'Construction of new buildings', eligibleShare: 11, alignedShare: 7 },
      ],
    },
    documents: [
      { name: 'EIB Green Bond Framework 2023', type: 'Framework', provider: 'European Investment Bank', date: '2023-06-01' },
      { name: 'Annual Allocation Report 2024', type: 'Allocation Report', provider: 'European Investment Bank', date: '2024-04-15' },
      { name: 'Impact Report 2024', type: 'Impact Report', provider: 'European Investment Bank', date: '2024-06-30' },
      { name: 'Second Party Opinion', type: 'SPO', provider: 'Sustainalytics', date: '2023-08-15' },
      { name: 'Limited Assurance Report', type: 'Assurance', provider: 'KPMG', date: '2024-09-30' },
    ],
    dataProvenance: {
      sources: ['EIB Investor Relations', 'Sustainalytics SPO', 'KPMG Assurance Report'],
      lastUpdate: '2025-01-15',
      completeness: 95,
      notes: [
        'SDG mapping based on issuer-reported allocation categories',
        'Impact KPIs are issuer-reported with third-party verification',
      ],
    },
  },
  '3': {
    bondId: '3',
    bondLabel: 'Sustainability',
    isClimateAligned: true,
    sdgAllocations: [
      { sdgNumber: 7, sdgName: 'Affordable and Clean Energy', allocationAmount: 600000000, allocationPercentage: 30 },
      { sdgNumber: 9, sdgName: 'Industry, Innovation and Infrastructure', allocationAmount: 800000000, allocationPercentage: 40 },
      { sdgNumber: 12, sdgName: 'Responsible Consumption and Production', allocationAmount: 400000000, allocationPercentage: 20 },
      { sdgNumber: 13, sdgName: 'Climate Action', allocationAmount: 200000000, allocationPercentage: 10 },
    ],
    useOfProceeds: [
      {
        category: 'Electric Vehicle Production',
        allocatedAmount: 1200000000,
        allocatedPercentage: 60,
        description: 'Scaling manufacturing capacity for battery electric vehicles across European plants.',
        projects: [
          { id: 'vw1', name: 'Zwickau EV Plant Expansion', location: 'Germany', type: 'Manufacturing', allocationAmount: 700000000, status: 'Completed', impactKPIs: [
            { name: 'Annual EV production capacity', value: 330000, unit: 'vehicles/year', reportingYear: 2024 },
            { name: 'GHG avoided per vehicle', value: 28, unit: 'tCO₂e over lifetime', reportingYear: 2024, methodology: 'Compared to equivalent ICE vehicle, EU average grid' },
          ]},
          { id: 'vw2', name: 'Emden Plant Conversion', location: 'Germany', type: 'Manufacturing', allocationAmount: 500000000, status: 'Ongoing', impactKPIs: [
            { name: 'Annual EV production capacity', value: 250000, unit: 'vehicles/year', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Total EV production capacity', value: 580000, unit: 'vehicles/year', reportingYear: 2025 },
          { name: 'GHG emissions avoided', value: 2900000, unit: 'tCO₂e/year', reportingYear: 2025, methodology: 'Based on average vehicle lifetime of 15 years and EU grid mix' },
        ],
      },
      {
        category: 'Battery Technology',
        allocatedAmount: 600000000,
        allocatedPercentage: 30,
        description: 'R&D and production of next-generation solid-state battery cells.',
        projects: [
          { id: 'vw3', name: 'Salzgitter Battery Gigafactory', location: 'Germany', type: 'Battery Manufacturing', allocationAmount: 600000000, status: 'Ongoing', impactKPIs: [
            { name: 'Annual cell production capacity', value: 40, unit: 'GWh', reportingYear: 2025 },
            { name: 'Energy density improvement', value: 25, unit: '% vs current gen', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Battery production capacity', value: 40, unit: 'GWh/year', reportingYear: 2025 },
        ],
      },
    ],
    unallocatedAmount: 200000000,
    unallocatedPercentage: 10,
    frameworks: [
      { framework: 'ICMA Green Bond Principles (2021)', status: 'Aligned' },
      { framework: 'ICMA Sustainability Bond Guidelines', status: 'Aligned' },
      { framework: 'EU Green Bond Standard', status: 'Partially Aligned' },
    ],
    externalReviews: [
      { provider: 'ISS ESG', type: 'SPO', date: '2024-02-20' },
    ],
    taxonomy: {
      eligibleShare: 78,
      alignedShare: 62,
      reportedVsEstimated: 'Mixed',
      activities: [
        { name: 'Manufacture of low carbon transport', eligibleShare: 55, alignedShare: 48 },
        { name: 'Manufacture of batteries', eligibleShare: 23, alignedShare: 14 },
      ],
    },
    documents: [
      { name: 'VW Sustainability Financing Framework', type: 'Framework', provider: 'Volkswagen AG', date: '2024-01-15' },
      { name: 'Allocation Report H1 2024', type: 'Allocation Report', provider: 'Volkswagen AG', date: '2024-08-01' },
      { name: 'ISS ESG Second Party Opinion', type: 'SPO', provider: 'ISS ESG', date: '2024-02-20' },
    ],
    dataProvenance: {
      sources: ['Volkswagen Investor Relations', 'ISS ESG SPO'],
      lastUpdate: '2024-11-20',
      completeness: 82,
      notes: [
        'Battery impact metrics are preliminary estimates',
        'EU Taxonomy alignment partially estimated by data provider',
      ],
    },
  },
  '4': {
    bondId: '4',
    bondLabel: 'Green',
    isClimateAligned: true,
    sdgAllocations: [
      { sdgNumber: 7, sdgName: 'Affordable and Clean Energy', allocationAmount: 900000000, allocationPercentage: 60 },
      { sdgNumber: 9, sdgName: 'Industry, Innovation and Infrastructure', allocationAmount: 450000000, allocationPercentage: 30 },
      { sdgNumber: 13, sdgName: 'Climate Action', allocationAmount: 150000000, allocationPercentage: 10 },
    ],
    useOfProceeds: [
      {
        category: 'Nuclear Energy',
        allocatedAmount: 750000000,
        allocatedPercentage: 50,
        description: 'Lifecycle extension and safety upgrades for existing nuclear fleet.',
        projects: [
          { id: 'edf1', name: 'Gravelines Reactor Modernization', location: 'France', type: 'Nuclear', allocationAmount: 450000000, status: 'Ongoing', impactKPIs: [
            { name: 'Generation capacity maintained', value: 5460, unit: 'MW', reportingYear: 2025 },
            { name: 'Zero-carbon electricity', value: 38000, unit: 'GWh/year', reportingYear: 2025 },
          ]},
          { id: 'edf2', name: 'Tricastin Safety Upgrade', location: 'France', type: 'Nuclear', allocationAmount: 300000000, status: 'Planned', impactKPIs: [] },
        ],
        impactKPIs: [
          { name: 'Zero-carbon generation maintained', value: 38000, unit: 'GWh/year', reportingYear: 2025 },
          { name: 'GHG emissions avoided', value: 15200000, unit: 'tCO₂e/year', reportingYear: 2025, methodology: 'Based on EU average fossil fuel emission factor' },
        ],
      },
      {
        category: 'Grid Infrastructure',
        allocatedAmount: 600000000,
        allocatedPercentage: 40,
        description: 'Grid modernization to integrate intermittent renewable generation.',
        projects: [
          { id: 'edf3', name: 'Smart Grid Île-de-France', location: 'France', type: 'Grid Modernization', allocationAmount: 350000000, status: 'Ongoing', impactKPIs: [
            { name: 'Grid capacity upgraded', value: 12000, unit: 'MW', reportingYear: 2025 },
            { name: 'Renewable integration enabled', value: 8500, unit: 'MW', reportingYear: 2025 },
          ]},
          { id: 'edf4', name: 'Cross-border Interconnector', location: 'France / Spain', type: 'Transmission', allocationAmount: 250000000, status: 'Ongoing', impactKPIs: [
            { name: 'Interconnection capacity', value: 3000, unit: 'MW', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Grid capacity upgraded', value: 12000, unit: 'MW', reportingYear: 2025 },
        ],
      },
    ],
    unallocatedAmount: 150000000,
    unallocatedPercentage: 10,
    frameworks: [
      { framework: 'ICMA Green Bond Principles (2021)', status: 'Aligned' },
      { framework: 'EU Green Bond Standard', status: 'Partially Aligned' },
    ],
    externalReviews: [
      { provider: 'Vigeo Eiris (V.E)', type: 'SPO', date: '2024-05-10' },
      { provider: 'EY', type: 'Verification', date: '2025-01-15' },
    ],
    documents: [
      { name: 'EDF Green Bond Framework 2024', type: 'Framework', provider: 'Électricité de France', date: '2024-04-01' },
      { name: 'Impact Report 2024', type: 'Impact Report', provider: 'Électricité de France', date: '2024-12-15' },
      { name: 'V.E Second Party Opinion', type: 'SPO', provider: 'Vigeo Eiris', date: '2024-05-10' },
    ],
    dataProvenance: {
      sources: ['EDF Investor Relations', 'Vigeo Eiris SPO', 'EY Assurance Report'],
      lastUpdate: '2025-01-20',
      completeness: 88,
      notes: [
        'Nuclear taxonomy eligibility subject to EU Complementary Delegated Act conditions',
      ],
    },
  },
  '9': {
    bondId: '9',
    bondLabel: 'Green',
    isClimateAligned: true,
    sdgAllocations: [
      { sdgNumber: 13, sdgName: 'Climate Action', allocationAmount: 4000000000, allocationPercentage: 40 },
      { sdgNumber: 14, sdgName: 'Life Below Water', allocationAmount: 3000000000, allocationPercentage: 30 },
      { sdgNumber: 7, sdgName: 'Affordable and Clean Energy', allocationAmount: 2000000000, allocationPercentage: 20 },
      { sdgNumber: 15, sdgName: 'Life on Land', allocationAmount: 1000000000, allocationPercentage: 10 },
    ],
    useOfProceeds: [
      {
        category: 'Climate Mitigation',
        allocatedAmount: 5000000000,
        allocatedPercentage: 50,
        description: 'Government expenditures on climate mitigation initiatives including carbon capture and renewable subsidies.',
        projects: [
          { id: 'no1', name: 'Northern Lights CCS Project', location: 'Norway', type: 'Carbon Capture & Storage', allocationAmount: 2500000000, status: 'Ongoing', impactKPIs: [
            { name: 'CO₂ storage capacity', value: 5000000, unit: 'tCO₂/year', reportingYear: 2025 },
          ]},
          { id: 'no2', name: 'Offshore Wind Subsidies', location: 'Norway', type: 'Renewable Energy Policy', allocationAmount: 2500000000, status: 'Ongoing', impactKPIs: [
            { name: 'Renewable capacity supported', value: 4500, unit: 'MW', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'GHG emissions avoided or captured', value: 8500000, unit: 'tCO₂e/year', reportingYear: 2025 },
        ],
      },
      {
        category: 'Ocean Conservation',
        allocatedAmount: 4000000000,
        allocatedPercentage: 40,
        description: 'Marine biodiversity protection and sustainable fisheries management.',
        projects: [
          { id: 'no3', name: 'Arctic Marine Protected Areas', location: 'Norway', type: 'Marine Conservation', allocationAmount: 2000000000, status: 'Ongoing', impactKPIs: [
            { name: 'Protected marine area', value: 125000, unit: 'km²', reportingYear: 2025 },
          ]},
          { id: 'no4', name: 'Sustainable Fisheries Program', location: 'Norway', type: 'Fisheries', allocationAmount: 2000000000, status: 'Ongoing', impactKPIs: [
            { name: 'Fish stocks under sustainable management', value: 92, unit: '%', reportingYear: 2025 },
          ]},
        ],
        impactKPIs: [
          { name: 'Marine area protected', value: 125000, unit: 'km²', reportingYear: 2025 },
        ],
      },
    ],
    unallocatedAmount: 1000000000,
    unallocatedPercentage: 10,
    frameworks: [
      { framework: 'ICMA Green Bond Principles (2021)', status: 'Aligned' },
      { framework: 'EU Green Bond Standard', status: 'Aligned' },
      { framework: 'Climate Bonds Standard v4.0', status: 'Aligned' },
    ],
    externalReviews: [
      { provider: 'CICERO', type: 'SPO', date: '2025-01-10' },
      { provider: 'Deloitte', type: 'Verification', date: '2025-02-01' },
    ],
    taxonomy: {
      eligibleShare: 82,
      alignedShare: 76,
      reportedVsEstimated: 'Reported',
      activities: [
        { name: 'Carbon capture and storage', eligibleShare: 25, alignedShare: 25 },
        { name: 'Electricity generation from wind', eligibleShare: 25, alignedShare: 25 },
        { name: 'Conservation and restoration of marine habitats', eligibleShare: 32, alignedShare: 26 },
      ],
    },
    documents: [
      { name: 'Norwegian Government Green Bond Framework', type: 'Framework', provider: 'Kingdom of Norway', date: '2024-12-01' },
      { name: 'Allocation & Impact Report 2025', type: 'Allocation Report', provider: 'Kingdom of Norway', date: '2025-01-31' },
      { name: 'CICERO Second Party Opinion', type: 'SPO', provider: 'CICERO', date: '2025-01-10' },
      { name: 'Limited Assurance Report', type: 'Assurance', provider: 'Deloitte', date: '2025-02-01' },
    ],
    dataProvenance: {
      sources: ['Norwegian Ministry of Finance', 'CICERO SPO', 'Deloitte Assurance'],
      lastUpdate: '2025-02-01',
      completeness: 97,
    },
  },
};
