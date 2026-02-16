import { Bond } from '@/types/bond';
import { BondEsgDetail } from '@/types/esg';
import { Portfolio } from '@/types/portfolio';
import { Issuer } from '@/types/issuer';
import {
  ComparisonSubject,
  ComparisonUoP,
  ComparisonSDG,
  ComparisonKPI,
  ComparisonCoverage,
  ComparisonType,
} from '@/types/comparison';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { mockIssuers } from '@/data/mockIssuers';

// ---------- Bond → ComparisonSubject ----------

function bondToSubject(bond: Bond): ComparisonSubject {
  const esg = mockEsgDetails[bond.id];

  let uopAllocation: ComparisonUoP[] = [];
  let sdgAllocation: ComparisonSDG[] = [];
  let impactKPIs: ComparisonKPI[] = [];
  let coverage: ComparisonCoverage = {
    bondsWithFramework: 0,
    bondsWithSPO: 0,
    bondsWithImpactReport: 0,
    reportingCompleteness: 0,
    frameworks: [],
    spoProviders: [],
  };

  if (esg) {
    uopAllocation = esg.useOfProceeds.map(u => ({
      category: u.category,
      amount: u.allocatedAmount,
      percentage: u.allocatedPercentage,
    }));

    sdgAllocation = esg.sdgAllocations.map(s => ({
      sdgNumber: s.sdgNumber,
      sdgName: s.sdgName,
      amount: s.allocationAmount,
      percentage: s.allocationPercentage,
    }));

    const totalFinanced = esg.useOfProceeds.reduce((sum, u) => sum + u.allocatedAmount, 0);
    const perMillion = totalFinanced > 0 ? 1_000_000 / totalFinanced : 0;

    impactKPIs = collectImpactKPIs([esg], totalFinanced);

    coverage = {
      bondsWithFramework: esg.documents.some(d => d.type === 'Framework') ? 1 : 0,
      bondsWithSPO: esg.externalReviews.some(r => r.type === 'SPO') ? 1 : 0,
      bondsWithImpactReport: esg.documents.some(d => d.type === 'Impact Report') ? 1 : 0,
      reportingCompleteness: esg.dataProvenance.completeness,
      frameworks: esg.frameworks.map(f => f.framework),
      spoProviders: esg.externalReviews.filter(r => r.type === 'SPO').map(r => r.provider),
    };
  }

  return {
    id: bond.id,
    label: bond.name,
    subLabel: bond.issuer,
    currency: bond.currency,
    bondCount: 1,
    totalIssuance: bond.outstandingAmount,
    uopAllocation,
    sdgAllocation,
    impactKPIs,
    coverage,
  };
}

// ---------- Portfolio → ComparisonSubject ----------

function portfolioToSubject(portfolio: Portfolio): ComparisonSubject {
  const bonds = portfolio.holdings
    .map(h => mockBonds.find(b => b.id === h.bondId))
    .filter(Boolean) as Bond[];

  const esgList = portfolio.holdings
    .map(h => mockEsgDetails[h.bondId])
    .filter(Boolean);

  const uopMap = new Map<string, number>();
  let uopTotal = 0;
  const sdgMap = new Map<number, { name: string; amount: number }>();
  let sdgTotal = 0;
  let totalFinanced = 0;

  portfolio.holdings.forEach(h => {
    const esg = mockEsgDetails[h.bondId];
    if (!esg) return;
    const weight = (h.weight ?? 100) / 100;

    esg.useOfProceeds.forEach(u => {
      const amt = u.allocatedAmount * weight;
      uopMap.set(u.category, (uopMap.get(u.category) || 0) + amt);
      uopTotal += amt;
      totalFinanced += amt;
    });

    esg.sdgAllocations.forEach(s => {
      const amt = s.allocationAmount * weight;
      const existing = sdgMap.get(s.sdgNumber);
      if (existing) existing.amount += amt;
      else sdgMap.set(s.sdgNumber, { name: s.sdgName, amount: amt });
      sdgTotal += amt;
    });
  });

  const uopAllocation: ComparisonUoP[] = Array.from(uopMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: uopTotal > 0 ? (amount / uopTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const sdgAllocation: ComparisonSDG[] = Array.from(sdgMap.entries())
    .map(([num, { name, amount }]) => ({
      sdgNumber: num,
      sdgName: name,
      amount,
      percentage: sdgTotal > 0 ? (amount / sdgTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const impactKPIs = collectImpactKPIs(esgList, totalFinanced);

  // Coverage
  let bondsWithFramework = 0, bondsWithSPO = 0, bondsWithImpactReport = 0;
  let completenessSum = 0, completenessCount = 0;
  const frameworkSet = new Set<string>();
  const spoSet = new Set<string>();

  esgList.forEach(esg => {
    if (esg.documents.some(d => d.type === 'Framework')) bondsWithFramework++;
    if (esg.externalReviews.some(r => r.type === 'SPO')) bondsWithSPO++;
    if (esg.documents.some(d => d.type === 'Impact Report')) bondsWithImpactReport++;
    completenessSum += esg.dataProvenance.completeness;
    completenessCount++;
    esg.frameworks.forEach(f => frameworkSet.add(f.framework));
    esg.externalReviews.filter(r => r.type === 'SPO').forEach(r => spoSet.add(r.provider));
  });

  const totalIss = bonds.reduce((sum, b) => sum + b.outstandingAmount, 0);

  return {
    id: portfolio.id,
    label: portfolio.name,
    subLabel: `${portfolio.type} · ${bonds.length} bonds`,
    currency: 'EUR', // simplified
    bondCount: bonds.length,
    totalIssuance: totalIss,
    uopAllocation,
    sdgAllocation,
    impactKPIs,
    coverage: {
      bondsWithFramework,
      bondsWithSPO,
      bondsWithImpactReport,
      reportingCompleteness: completenessCount > 0 ? Math.round(completenessSum / completenessCount) : 0,
      frameworks: Array.from(frameworkSet),
      spoProviders: Array.from(spoSet),
    },
  };
}

// ---------- Issuer → ComparisonSubject ----------

function issuerToSubject(issuerName: string): ComparisonSubject {
  const issuer = mockIssuers[issuerName];
  const issuerBonds = mockBonds.filter(b => b.issuer === issuerName);
  const esgList = issuerBonds
    .map(b => mockEsgDetails[b.id])
    .filter(Boolean);

  const uopMap = new Map<string, number>();
  let uopTotal = 0;
  const sdgMap = new Map<number, { name: string; amount: number }>();
  let sdgTotal = 0;
  let totalFinanced = 0;

  esgList.forEach(esg => {
    esg.useOfProceeds.forEach(u => {
      uopMap.set(u.category, (uopMap.get(u.category) || 0) + u.allocatedAmount);
      uopTotal += u.allocatedAmount;
      totalFinanced += u.allocatedAmount;
    });
    esg.sdgAllocations.forEach(s => {
      const existing = sdgMap.get(s.sdgNumber);
      if (existing) existing.amount += s.allocationAmount;
      else sdgMap.set(s.sdgNumber, { name: s.sdgName, amount: s.allocationAmount });
      sdgTotal += s.allocationAmount;
    });
  });

  const uopAllocation: ComparisonUoP[] = Array.from(uopMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: uopTotal > 0 ? (amount / uopTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const sdgAllocation: ComparisonSDG[] = Array.from(sdgMap.entries())
    .map(([num, { name, amount }]) => ({
      sdgNumber: num,
      sdgName: name,
      amount,
      percentage: sdgTotal > 0 ? (amount / sdgTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const impactKPIs = collectImpactKPIs(esgList, totalFinanced);

  // Coverage
  let bondsWithFramework = 0, bondsWithSPO = 0, bondsWithImpactReport = 0;
  let completenessSum = 0, completenessCount = 0;
  const frameworkSet = new Set<string>();
  const spoSet = new Set<string>();

  esgList.forEach(esg => {
    if (esg.documents.some(d => d.type === 'Framework')) bondsWithFramework++;
    if (esg.externalReviews.some(r => r.type === 'SPO')) bondsWithSPO++;
    if (esg.documents.some(d => d.type === 'Impact Report')) bondsWithImpactReport++;
    completenessSum += esg.dataProvenance.completeness;
    completenessCount++;
    esg.frameworks.forEach(f => frameworkSet.add(f.framework));
    esg.externalReviews.filter(r => r.type === 'SPO').forEach(r => spoSet.add(r.provider));
  });

  return {
    id: issuer?.id || issuerName,
    label: issuerName,
    subLabel: issuer ? `${issuer.country} · ${issuer.sector}` : undefined,
    currency: issuer?.currency || 'EUR',
    bondCount: issuerBonds.length,
    totalIssuance: issuer?.totalSustainableIssuance || 0,
    uopAllocation,
    sdgAllocation,
    impactKPIs,
    coverage: {
      bondsWithFramework,
      bondsWithSPO,
      bondsWithImpactReport,
      reportingCompleteness: completenessCount > 0 ? Math.round(completenessSum / completenessCount) : 0,
      frameworks: Array.from(frameworkSet),
      spoProviders: Array.from(spoSet),
    },
  };
}

// ---------- Shared: Impact KPI collection ----------

function collectImpactKPIs(esgList: BondEsgDetail[], totalFinanced: number): ComparisonKPI[] {
  const kpiMap = new Map<string, { value: number; unit: string; bondCount: number; methodology?: string }>();

  esgList.forEach(esg => {
    esg.useOfProceeds.forEach(uop => {
      uop.impactKPIs?.forEach(kpi => {
        const numVal = typeof kpi.value === 'number' ? kpi.value : parseFloat(String(kpi.value));
        if (isNaN(numVal)) return;
        const key = `${kpi.name}|${kpi.unit}`;
        const existing = kpiMap.get(key);
        if (existing) {
          existing.value += numVal;
          existing.bondCount++;
        } else {
          kpiMap.set(key, { value: numVal, unit: kpi.unit, bondCount: 1, methodology: kpi.methodology });
        }
      });
    });
  });

  const perMillion = totalFinanced > 0 ? 1_000_000 / totalFinanced : 0;

  return Array.from(kpiMap.entries())
    .map(([key, data]) => ({
      name: key.split('|')[0],
      totalValue: data.value,
      normalizedValue: data.value * perMillion,
      unit: data.unit,
      bondCount: data.bondCount,
      methodology: data.methodology,
    }))
    .sort((a, b) => b.bondCount - a.bondCount || b.totalValue - a.totalValue);
}

// ---------- Public API ----------

export function resolveComparisonSubjects(
  type: ComparisonType,
  itemIds: string[],
  portfolios?: Portfolio[]
): ComparisonSubject[] {
  switch (type) {
    case 'bond':
      return itemIds
        .map(id => mockBonds.find(b => b.id === id))
        .filter(Boolean)
        .map(b => bondToSubject(b!));
    case 'portfolio':
      return itemIds
        .map(id => portfolios?.find(p => p.id === id))
        .filter(Boolean)
        .map(p => portfolioToSubject(p!));
    case 'issuer':
      return itemIds.map(name => issuerToSubject(name));
  }
}

// ---------- Formatting helpers ----------

export function formatComparisonAmount(value: number, currency?: string): string {
  const ccy = currency || '€';
  const symbol = ccy === 'EUR' ? '€' : ccy === 'USD' ? '$' : ccy === 'GBP' ? '£' : `${ccy} `;
  if (value >= 1e12) return `${symbol}${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `${symbol}${(value / 1e3).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

export function formatKPIDisplay(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(value < 100 ? 1 : 0);
}

// Collect all unique UoP categories across subjects
export function getAllUoPCategories(subjects: ComparisonSubject[]): string[] {
  const set = new Set<string>();
  subjects.forEach(s => s.uopAllocation.forEach(u => set.add(u.category)));
  return Array.from(set).sort();
}

// Collect all unique SDGs across subjects
export function getAllSDGs(subjects: ComparisonSubject[]): { sdgNumber: number; sdgName: string }[] {
  const map = new Map<number, string>();
  subjects.forEach(s => s.sdgAllocation.forEach(sdg => map.set(sdg.sdgNumber, sdg.sdgName)));
  return Array.from(map.entries())
    .map(([sdgNumber, sdgName]) => ({ sdgNumber, sdgName }))
    .sort((a, b) => a.sdgNumber - b.sdgNumber);
}

// Collect all comparable KPI names (appear in 2+ subjects)
export function getComparableKPIs(subjects: ComparisonSubject[]): string[] {
  const kpiCount = new Map<string, number>();
  subjects.forEach(s => {
    const seen = new Set<string>();
    s.impactKPIs.forEach(k => {
      const key = `${k.name}|${k.unit}`;
      if (!seen.has(key)) {
        seen.add(key);
        kpiCount.set(key, (kpiCount.get(key) || 0) + 1);
      }
    });
  });
  return Array.from(kpiCount.entries())
    .filter(([, count]) => count >= 2)
    .map(([key]) => key);
}
