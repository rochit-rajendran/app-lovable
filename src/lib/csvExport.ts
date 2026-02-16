import { Bond } from '@/types/bond';
import { BondEsgDetail } from '@/types/esg';
import { Portfolio } from '@/types/portfolio';
import { ComparisonSubject } from '@/types/comparison';
import { Issuer } from '@/types/issuer';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';

// ---------- Download helper ----------

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSVRow(values: (string | number | undefined | null)[]): string {
  return values.map(escapeCSV).join(',');
}

// ---------- Portfolio CSV ----------

export function exportPortfolioCSV(portfolio: Portfolio, bonds: Bond[], reportingDate: string) {
  const sheets: string[] = [];

  // Sheet 1: Holdings
  sheets.push('=== PORTFOLIO HOLDINGS ===');
  sheets.push(`Portfolio: ${portfolio.name}`);
  sheets.push(`Type: ${portfolio.type}`);
  sheets.push(`Reporting Date: ${reportingDate}`);
  sheets.push(`Generated: ${new Date().toISOString()}`);
  sheets.push('');
  sheets.push(toCSVRow([
    'Bond ID', 'ISIN', 'Bond Name', 'Issuer', 'Country', 'Currency',
    'Issue Date', 'Maturity', 'Outstanding Amount', 'Weight %',
    'Green', 'Sustainability', 'Climate Aligned', 'Framework',
    'Coverage Status'
  ]));

  portfolio.holdings.forEach(h => {
    const bond = bonds.find(b => b.id === h.bondId);
    if (!bond) return;
    const esg = mockEsgDetails[bond.id];
    const coverage = esg ? 'Reported' : 'No ESG Data';
    sheets.push(toCSVRow([
      bond.id, bond.isin, bond.name, bond.issuer, bond.country, bond.currency,
      bond.issueDate, bond.maturityDate, bond.outstandingAmount, h.weight ?? '',
      bond.isGreen ? 'Yes' : 'No',
      bond.isSustainability ? 'Yes' : 'No',
      bond.isClimateAligned ? 'Yes' : 'No',
      bond.greenBondFramework || '',
      coverage
    ]));
  });

  // Sheet 2: Use of Proceeds
  sheets.push('');
  sheets.push('=== USE OF PROCEEDS ALLOCATION ===');
  sheets.push(toCSVRow(['Bond ID', 'Bond Name', 'Category', 'Amount', 'Percentage']));

  portfolio.holdings.forEach(h => {
    const bond = bonds.find(b => b.id === h.bondId);
    const esg = mockEsgDetails[h.bondId];
    if (!bond || !esg) return;
    esg.useOfProceeds.forEach(uop => {
      sheets.push(toCSVRow([
        bond.id, bond.name, uop.category, uop.allocatedAmount, uop.allocatedPercentage
      ]));
    });
  });

  // Sheet 3: SDG Allocation
  sheets.push('');
  sheets.push('=== SDG ALLOCATION ===');
  sheets.push(toCSVRow(['Bond ID', 'Bond Name', 'SDG Number', 'SDG Name', 'Amount', 'Percentage']));

  portfolio.holdings.forEach(h => {
    const bond = bonds.find(b => b.id === h.bondId);
    const esg = mockEsgDetails[h.bondId];
    if (!bond || !esg) return;
    esg.sdgAllocations.forEach(sdg => {
      sheets.push(toCSVRow([
        bond.id, bond.name, sdg.sdgNumber, sdg.sdgName, sdg.allocationAmount, sdg.allocationPercentage
      ]));
    });
  });

  // Sheet 4: Impact KPIs
  sheets.push('');
  sheets.push('=== IMPACT KPIS ===');
  sheets.push(toCSVRow(['Bond ID', 'Bond Name', 'Category', 'KPI Name', 'Value', 'Unit', 'Reporting Year', 'Methodology']));

  portfolio.holdings.forEach(h => {
    const bond = bonds.find(b => b.id === h.bondId);
    const esg = mockEsgDetails[h.bondId];
    if (!bond || !esg) return;
    esg.useOfProceeds.forEach(uop => {
      uop.impactKPIs?.forEach(kpi => {
        sheets.push(toCSVRow([
          bond.id, bond.name, uop.category, kpi.name, kpi.value, kpi.unit, kpi.reportingYear, kpi.methodology || ''
        ]));
      });
    });
  });

  const filename = `${portfolio.name.replace(/\s+/g, '_')}_ESG_Export_${reportingDate}.csv`;
  downloadCSV(sheets.join('\n'), filename);
}

// ---------- Comparison CSV ----------

export function exportComparisonCSV(
  name: string,
  type: string,
  subjects: ComparisonSubject[],
  reportingDate: string
) {
  const sheets: string[] = [];

  // Header
  sheets.push('=== COMPARISON EXPORT ===');
  sheets.push(`Comparison: ${name}`);
  sheets.push(`Type: ${type}`);
  sheets.push(`Reporting Date: ${reportingDate}`);
  sheets.push(`Generated: ${new Date().toISOString()}`);
  sheets.push('');

  // Overview
  sheets.push('=== OVERVIEW ===');
  sheets.push(toCSVRow(['Item', 'Sub-label', 'Currency', 'Bond Count', 'Total Issuance']));
  subjects.forEach(s => {
    sheets.push(toCSVRow([s.label, s.subLabel || '', s.currency, s.bondCount, s.totalIssuance]));
  });

  // UoP comparison
  sheets.push('');
  sheets.push('=== USE OF PROCEEDS COMPARISON ===');
  const uopHeader = ['Category', ...subjects.flatMap(s => [`${s.label} (%)`, `${s.label} (Absolute)`])];
  sheets.push(toCSVRow(uopHeader));

  const allCategories = new Set<string>();
  subjects.forEach(s => s.uopAllocation.forEach(u => allCategories.add(u.category)));

  Array.from(allCategories).sort().forEach(cat => {
    const row: (string | number)[] = [cat];
    subjects.forEach(s => {
      const uop = s.uopAllocation.find(u => u.category === cat);
      row.push(uop ? uop.percentage.toFixed(1) : '0');
      row.push(uop ? uop.amount : 0);
    });
    sheets.push(toCSVRow(row));
  });

  // SDG comparison
  sheets.push('');
  sheets.push('=== SDG ALLOCATION COMPARISON ===');
  const sdgHeader = ['SDG', 'Name', ...subjects.flatMap(s => [`${s.label} (%)`, `${s.label} (Absolute)`])];
  sheets.push(toCSVRow(sdgHeader));

  const allSdgs = new Map<number, string>();
  subjects.forEach(s => s.sdgAllocation.forEach(sdg => allSdgs.set(sdg.sdgNumber, sdg.sdgName)));

  Array.from(allSdgs.entries()).sort((a, b) => a[0] - b[0]).forEach(([num, name]) => {
    const row: (string | number)[] = [`SDG ${num}`, name];
    subjects.forEach(s => {
      const sdg = s.sdgAllocation.find(x => x.sdgNumber === num);
      row.push(sdg ? sdg.percentage.toFixed(1) : '0');
      row.push(sdg ? sdg.amount : 0);
    });
    sheets.push(toCSVRow(row));
  });

  // Impact KPIs
  sheets.push('');
  sheets.push('=== IMPACT KPI COMPARISON ===');
  const kpiHeader = ['KPI', 'Unit', ...subjects.flatMap(s => [`${s.label} (Total)`, `${s.label} (per €1M)`])];
  sheets.push(toCSVRow(kpiHeader));

  const allKpis = new Set<string>();
  subjects.forEach(s => s.impactKPIs.forEach(k => allKpis.add(`${k.name}|${k.unit}`)));

  Array.from(allKpis).forEach(key => {
    const [kpiName, unit] = key.split('|');
    const row: (string | number)[] = [kpiName, unit];
    subjects.forEach(s => {
      const kpi = s.impactKPIs.find(k => k.name === kpiName && k.unit === unit);
      row.push(kpi ? kpi.totalValue : '');
      row.push(kpi ? Number(kpi.normalizedValue.toFixed(2)) : '');
    });
    sheets.push(toCSVRow(row));
  });

  // Disclaimer
  sheets.push('');
  sheets.push('=== METHODOLOGY NOTES ===');
  sheets.push('"SDG mapping based on issuer-reported use-of-proceeds allocation."');
  sheets.push('"Impact KPIs are normalized per €1M of financed amount. Only methodologically comparable KPIs are shown."');
  sheets.push('"Data is issuer-reported unless otherwise noted. Coverage indicators reflect reporting completeness."');

  const filename = `${name.replace(/\s+/g, '_')}_Comparison_${reportingDate}.csv`;
  downloadCSV(sheets.join('\n'), filename);
}

// ---------- Issuer CSV ----------

export function exportIssuerCSV(
  issuer: Issuer,
  issuerBonds: Bond[],
  reportingDate: string
) {
  const sheets: string[] = [];

  // Header
  sheets.push('=== ISSUER ESG PROFILE ===');
  sheets.push(`Issuer: ${issuer.name}`);
  sheets.push(`Country: ${issuer.country}`);
  sheets.push(`Sector: ${issuer.sector}${issuer.subSector ? ` / ${issuer.subSector}` : ''}`);
  sheets.push(`Type: ${issuer.issuerType}`);
  sheets.push(`Sustainable Bonds: ${issuer.sustainableBondCount}`);
  sheets.push(`Total Sustainable Issuance: ${issuer.totalSustainableIssuance} ${issuer.currency}`);
  sheets.push(`Reporting Date: ${reportingDate}`);
  sheets.push(`Generated: ${new Date().toISOString()}`);
  sheets.push('');

  // Bond-level data
  sheets.push('=== BOND LIST ===');
  sheets.push(toCSVRow([
    'Bond ID', 'ISIN', 'Bond Name', 'Currency', 'Issue Date', 'Maturity',
    'Outstanding Amount', 'Green', 'Sustainability', 'Climate Aligned', 'Framework'
  ]));

  issuerBonds.forEach(bond => {
    sheets.push(toCSVRow([
      bond.id, bond.isin, bond.name, bond.currency, bond.issueDate, bond.maturityDate,
      bond.outstandingAmount,
      bond.isGreen ? 'Yes' : 'No',
      bond.isSustainability ? 'Yes' : 'No',
      bond.isClimateAligned ? 'Yes' : 'No',
      bond.greenBondFramework || ''
    ]));
  });

  // Aggregate UoP
  const uopMap = new Map<string, number>();
  issuerBonds.forEach(bond => {
    const esg = mockEsgDetails[bond.id];
    if (!esg) return;
    esg.useOfProceeds.forEach(uop => {
      uopMap.set(uop.category, (uopMap.get(uop.category) || 0) + uop.allocatedAmount);
    });
  });

  const uopTotal = Array.from(uopMap.values()).reduce((s, v) => s + v, 0);
  sheets.push('');
  sheets.push('=== AGGREGATE USE OF PROCEEDS ===');
  sheets.push(toCSVRow(['Category', 'Amount', 'Percentage']));
  Array.from(uopMap.entries()).sort((a, b) => b[1] - a[1]).forEach(([cat, amt]) => {
    sheets.push(toCSVRow([cat, amt, uopTotal > 0 ? ((amt / uopTotal) * 100).toFixed(1) : '0']));
  });

  // Aggregate SDG
  const sdgMap = new Map<number, { name: string; amount: number }>();
  issuerBonds.forEach(bond => {
    const esg = mockEsgDetails[bond.id];
    if (!esg) return;
    esg.sdgAllocations.forEach(sdg => {
      const existing = sdgMap.get(sdg.sdgNumber);
      if (existing) existing.amount += sdg.allocationAmount;
      else sdgMap.set(sdg.sdgNumber, { name: sdg.sdgName, amount: sdg.allocationAmount });
    });
  });

  const sdgTotal = Array.from(sdgMap.values()).reduce((s, v) => s + v.amount, 0);
  sheets.push('');
  sheets.push('=== AGGREGATE SDG ALLOCATION ===');
  sheets.push(toCSVRow(['SDG Number', 'SDG Name', 'Amount', 'Percentage']));
  Array.from(sdgMap.entries()).sort((a, b) => a[0] - b[0]).forEach(([num, data]) => {
    sheets.push(toCSVRow([num, data.name, data.amount, sdgTotal > 0 ? ((data.amount / sdgTotal) * 100).toFixed(1) : '0']));
  });

  // Impact KPIs
  const kpiMap = new Map<string, { value: number; unit: string; bondCount: number; methodology?: string }>();
  issuerBonds.forEach(bond => {
    const esg = mockEsgDetails[bond.id];
    if (!esg) return;
    esg.useOfProceeds.forEach(uop => {
      uop.impactKPIs?.forEach(kpi => {
        const numVal = typeof kpi.value === 'number' ? kpi.value : parseFloat(String(kpi.value));
        if (isNaN(numVal)) return;
        const key = `${kpi.name}|${kpi.unit}`;
        const existing = kpiMap.get(key);
        if (existing) { existing.value += numVal; existing.bondCount++; }
        else kpiMap.set(key, { value: numVal, unit: kpi.unit, bondCount: 1, methodology: kpi.methodology });
      });
    });
  });

  const perMillion = uopTotal > 0 ? 1_000_000 / uopTotal : 0;
  sheets.push('');
  sheets.push('=== IMPACT KPIS ===');
  sheets.push(toCSVRow(['KPI Name', 'Total Value', 'Normalized (per €1M)', 'Unit', 'Bond Count', 'Methodology']));
  Array.from(kpiMap.entries()).forEach(([key, data]) => {
    sheets.push(toCSVRow([
      key.split('|')[0], data.value, Number((data.value * perMillion).toFixed(2)),
      data.unit, data.bondCount, data.methodology || ''
    ]));
  });

  // Frameworks
  sheets.push('');
  sheets.push('=== FRAMEWORKS ===');
  sheets.push(toCSVRow(['Name', 'Version', 'Date', 'Status']));
  const issuerData = issuer;
  issuerData.frameworks.forEach(fw => {
    sheets.push(toCSVRow([fw.name, fw.version || '', fw.date || '', fw.status]));
  });

  // Disclaimer
  sheets.push('');
  sheets.push('=== METHODOLOGY NOTES ===');
  sheets.push('"Data aggregated across all sustainable bonds issued by this entity."');
  sheets.push('"Impact KPIs normalized per €1M of total financed amount."');
  sheets.push('"SDG mapping based on issuer-reported use-of-proceeds allocation."');

  const filename = `${issuer.name.replace(/\s+/g, '_')}_ESG_Profile_${reportingDate}.csv`;
  downloadCSV(sheets.join('\n'), filename);
}
