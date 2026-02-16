import { Bond } from '@/types/bond';
import { BondEsgDetail } from '@/types/esg';
import { PortfolioHolding } from '@/types/portfolio';

// --- SDG Aggregation ---
export interface AggregatedSDG {
  sdgNumber: number;
  sdgName: string;
  totalAmount: number;
  percentage: number;
}

export function aggregateSDGs(
  holdings: PortfolioHolding[],
  bonds: Bond[],
  esgData: Record<string, BondEsgDetail>
): AggregatedSDG[] {
  const sdgMap = new Map<number, { name: string; total: number }>();
  let grandTotal = 0;

  holdings.forEach((h) => {
    const esg = esgData[h.bondId];
    if (!esg?.sdgAllocations) return;
    const weight = (h.weight ?? 100) / 100;
    esg.sdgAllocations.forEach((sdg) => {
      const amount = sdg.allocationAmount * weight;
      const existing = sdgMap.get(sdg.sdgNumber);
      if (existing) {
        existing.total += amount;
      } else {
        sdgMap.set(sdg.sdgNumber, { name: sdg.sdgName, total: amount });
      }
      grandTotal += amount;
    });
  });

  return Array.from(sdgMap.entries())
    .map(([num, { name, total }]) => ({
      sdgNumber: num,
      sdgName: name,
      totalAmount: total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// --- Use of Proceeds Aggregation ---
export interface AggregatedUoP {
  category: string;
  totalAmount: number;
  percentage: number;
}

export function aggregateUseOfProceeds(
  holdings: PortfolioHolding[],
  bonds: Bond[],
  esgData: Record<string, BondEsgDetail>
): AggregatedUoP[] {
  const uopMap = new Map<string, number>();
  let grandTotal = 0;

  holdings.forEach((h) => {
    const esg = esgData[h.bondId];
    if (!esg?.useOfProceeds) return;
    const weight = (h.weight ?? 100) / 100;
    esg.useOfProceeds.forEach((uop) => {
      const amount = uop.allocatedAmount * weight;
      uopMap.set(uop.category, (uopMap.get(uop.category) || 0) + amount);
      grandTotal += amount;
    });
  });

  return Array.from(uopMap.entries())
    .map(([category, totalAmount]) => ({
      category,
      totalAmount,
      percentage: grandTotal > 0 ? (totalAmount / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

// --- Geographic Exposure ---
export interface GeoExposure {
  country: string;
  bondCount: number;
  totalAmount: number;
  percentage: number;
}

export function aggregateGeography(
  holdings: PortfolioHolding[],
  bonds: Bond[]
): GeoExposure[] {
  const geoMap = new Map<string, { count: number; amount: number }>();
  let grandTotal = 0;

  holdings.forEach((h) => {
    const bond = bonds.find((b) => b.id === h.bondId);
    if (!bond) return;
    const weight = (h.weight ?? 100) / 100;
    const amount = bond.outstandingAmount * weight;
    const existing = geoMap.get(bond.country);
    if (existing) {
      existing.count += 1;
      existing.amount += amount;
    } else {
      geoMap.set(bond.country, { count: 1, amount });
    }
    grandTotal += amount;
  });

  return Array.from(geoMap.entries())
    .map(([country, { count, amount }]) => ({
      country,
      bondCount: count,
      totalAmount: amount,
      percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// --- Currency Exposure ---
export interface CurrencyExposure {
  currency: string;
  totalAmount: number;
  percentage: number;
  bondCount: number;
}

export function aggregateCurrency(
  holdings: PortfolioHolding[],
  bonds: Bond[]
): CurrencyExposure[] {
  const ccyMap = new Map<string, { amount: number; count: number }>();
  let grandTotal = 0;

  holdings.forEach((h) => {
    const bond = bonds.find((b) => b.id === h.bondId);
    if (!bond) return;
    const weight = (h.weight ?? 100) / 100;
    const amount = bond.outstandingAmount * weight;
    const existing = ccyMap.get(bond.currency);
    if (existing) {
      existing.amount += amount;
      existing.count += 1;
    } else {
      ccyMap.set(bond.currency, { amount, count: 1 });
    }
    grandTotal += amount;
  });

  return Array.from(ccyMap.entries())
    .map(([currency, { amount, count }]) => ({
      currency,
      totalAmount: amount,
      percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      bondCount: count,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// --- Impact KPI Aggregation ---
export interface AggregatedImpactKPI {
  name: string;
  value: number;
  unit: string;
  bondCount: number;
  methodology?: string;
}

export function aggregateImpactKPIs(
  holdings: PortfolioHolding[],
  esgData: Record<string, BondEsgDetail>
): AggregatedImpactKPI[] {
  const kpiMap = new Map<string, { value: number; unit: string; bondCount: number; methodology?: string }>();

  holdings.forEach((h) => {
    const esg = esgData[h.bondId];
    if (!esg?.useOfProceeds) return;
    const weight = (h.weight ?? 100) / 100;
    esg.useOfProceeds.forEach((uop) => {
      uop.impactKPIs?.forEach((kpi) => {
        const numValue = typeof kpi.value === 'number' ? kpi.value : parseFloat(kpi.value);
        if (isNaN(numValue)) return;
        const key = `${kpi.name}|${kpi.unit}`;
        const existing = kpiMap.get(key);
        if (existing) {
          existing.value += numValue * weight;
          existing.bondCount += 1;
        } else {
          kpiMap.set(key, {
            value: numValue * weight,
            unit: kpi.unit,
            bondCount: 1,
            methodology: kpi.methodology,
          });
        }
      });
    });
  });

  // Only return KPIs that aggregate meaningfully (appear in 2+ bonds or are high-value)
  return Array.from(kpiMap.entries())
    .map(([key, data]) => ({
      name: key.split('|')[0],
      ...data,
    }))
    .sort((a, b) => b.bondCount - a.bondCount || b.value - a.value);
}

// --- Coverage Snapshot ---
export interface CoverageSnapshot {
  bondsWithFramework: number;
  bondsWithAllocationReport: number;
  bondsWithImpactReport: number;
  bondsWithSPO: number;
  spoProviders: { name: string; count: number }[];
  assuranceProviders: { name: string; count: number }[];
}

export function aggregateCoverage(
  holdings: PortfolioHolding[],
  esgData: Record<string, BondEsgDetail>
): CoverageSnapshot {
  let bondsWithFramework = 0;
  let bondsWithAllocationReport = 0;
  let bondsWithImpactReport = 0;
  let bondsWithSPO = 0;
  const spoMap = new Map<string, number>();
  const assuranceMap = new Map<string, number>();

  holdings.forEach((h) => {
    const esg = esgData[h.bondId];
    if (!esg) return;

    if (esg.documents?.some((d) => d.type === 'Framework')) bondsWithFramework++;
    if (esg.documents?.some((d) => d.type === 'Allocation Report')) bondsWithAllocationReport++;
    if (esg.documents?.some((d) => d.type === 'Impact Report')) bondsWithImpactReport++;
    if (esg.externalReviews?.some((r) => r.type === 'SPO')) bondsWithSPO++;

    esg.externalReviews?.forEach((r) => {
      if (r.type === 'SPO') {
        spoMap.set(r.provider, (spoMap.get(r.provider) || 0) + 1);
      } else {
        assuranceMap.set(r.provider, (assuranceMap.get(r.provider) || 0) + 1);
      }
    });
  });

  return {
    bondsWithFramework,
    bondsWithAllocationReport,
    bondsWithImpactReport,
    bondsWithSPO,
    spoProviders: Array.from(spoMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    assuranceProviders: Array.from(assuranceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  };
}

// --- Formatting Helpers ---
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) return `€${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value.toFixed(0)}`;
}

export function formatKPIValue(value: number, unit: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(value < 100 ? 1 : 0);
}
