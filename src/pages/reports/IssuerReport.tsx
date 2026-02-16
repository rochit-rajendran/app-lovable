import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { mockIssuers } from '@/data/mockIssuers';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { ReportLayout, ReportSection, MetricCard, PercentBar } from './ReportLayout';

function formatNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${currency} ${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${currency} ${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${currency} ${(value / 1e6).toFixed(0)}M`;
  return `${currency} ${value.toLocaleString()}`;
}

export default function IssuerReport() {
  const [params] = useSearchParams();
  const issuerName = decodeURIComponent(params.get('issuer') || '');
  const title = params.get('title') || `${issuerName} — ESG Profile`;
  const subtitle = params.get('subtitle') || undefined;
  const reportingDate = params.get('date') || new Date().toISOString().split('T')[0];
  const enabledSections = params.get('sections')?.split(',') || [];
  const showAll = enabledSections.length === 0;

  const issuer = mockIssuers[issuerName];
  const issuerBonds = useMemo(() => mockBonds.filter(b => b.issuer === issuerName), [issuerName]);

  // Aggregate
  const { uopData, sdgData, kpiData, uopTotal } = useMemo(() => {
    const uopMap = new Map<string, number>();
    const sdgMap = new Map<number, { name: string; amount: number }>();
    const kpiMap = new Map<string, { value: number; unit: string; count: number; methodology?: string }>();
    let total = 0;

    issuerBonds.forEach(bond => {
      const esg = mockEsgDetails[bond.id];
      if (!esg) return;
      esg.useOfProceeds.forEach(uop => {
        uopMap.set(uop.category, (uopMap.get(uop.category) || 0) + uop.allocatedAmount);
        total += uop.allocatedAmount;
        uop.impactKPIs?.forEach(kpi => {
          const numVal = typeof kpi.value === 'number' ? kpi.value : parseFloat(String(kpi.value));
          if (isNaN(numVal)) return;
          const key = `${kpi.name}|${kpi.unit}`;
          const existing = kpiMap.get(key);
          if (existing) { existing.value += numVal; existing.count++; }
          else kpiMap.set(key, { value: numVal, unit: kpi.unit, count: 1, methodology: kpi.methodology });
        });
      });
      esg.sdgAllocations.forEach(sdg => {
        const existing = sdgMap.get(sdg.sdgNumber);
        if (existing) existing.amount += sdg.allocationAmount;
        else sdgMap.set(sdg.sdgNumber, { name: sdg.sdgName, amount: sdg.allocationAmount });
      });
    });

    const sdgTotal = Array.from(sdgMap.values()).reduce((s, v) => s + v.amount, 0);
    const perMillion = total > 0 ? 1_000_000 / total : 0;

    return {
      uopData: Array.from(uopMap.entries()).map(([cat, amt]) => ({
        category: cat, amount: amt, percentage: total > 0 ? (amt / total) * 100 : 0,
      })).sort((a, b) => b.amount - a.amount),
      sdgData: Array.from(sdgMap.entries()).map(([num, data]) => ({
        sdgNumber: num, sdgName: data.name, amount: data.amount,
        percentage: sdgTotal > 0 ? (data.amount / sdgTotal) * 100 : 0,
      })).sort((a, b) => a.sdgNumber - b.sdgNumber),
      kpiData: Array.from(kpiMap.entries()).map(([key, data]) => ({
        name: key.split('|')[0], ...data, normalized: data.value * perMillion,
      })).sort((a, b) => b.count - a.count),
      uopTotal: total,
    };
  }, [issuerBonds]);

  // Coverage
  const coverage = useMemo(() => {
    let withFramework = 0, withSPO = 0, withImpact = 0;
    issuerBonds.forEach(bond => {
      const esg = mockEsgDetails[bond.id];
      if (!esg) return;
      if (esg.documents.some(d => d.type === 'Framework')) withFramework++;
      if (esg.externalReviews.some(r => r.type === 'SPO')) withSPO++;
      if (esg.documents.some(d => d.type === 'Impact Report')) withImpact++;
    });
    return { withFramework, withSPO, withImpact };
  }, [issuerBonds]);

  const show = (id: string) => showAll || enabledSections.includes(id);

  if (!issuer) {
    return <div className="p-10 text-center text-gray-500">Issuer not found.</div>;
  }

  return (
    <ReportLayout title={title} subtitle={subtitle} reportingDate={reportingDate}>
      {/* Snapshot */}
      {show('snapshot') && (
        <ReportSection title="Issuer Snapshot">
          <div className="metric-grid">
            <MetricCard label="Issuer" value={issuer.name} />
            <MetricCard label="Country" value={issuer.country} />
            <MetricCard label="Sector" value={`${issuer.sector}${issuer.subSector ? ` / ${issuer.subSector}` : ''}`} />
            <MetricCard label="Type" value={issuer.issuerType} />
            <MetricCard label="Sustainable Bonds" value={issuer.sustainableBondCount} />
            <MetricCard label="Total Issuance" value={formatNumber(issuer.totalSustainableIssuance, issuer.currency)} />
          </div>
          {issuer.description && (
            <p className="text-sm text-gray-600 mt-2">{issuer.description}</p>
          )}
        </ReportSection>
      )}

      {/* UoP */}
      {show('uop') && uopData.length > 0 && (
        <ReportSection title="Use of Proceeds Allocation">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th className="num">Amount</th>
                <th className="num">%</th>
                <th style={{ width: '30%' }}>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {uopData.map(uop => (
                <tr key={uop.category}>
                  <td>{uop.category}</td>
                  <td className="num">{formatNumber(uop.amount, issuer.currency)}</td>
                  <td className="num">{uop.percentage.toFixed(1)}%</td>
                  <td>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${uop.percentage}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* SDG */}
      {show('sdg') && sdgData.length > 0 && (
        <ReportSection title="SDG Allocation">
          <table>
            <thead>
              <tr>
                <th>SDG</th>
                <th>Name</th>
                <th className="num">Amount</th>
                <th className="num">%</th>
              </tr>
            </thead>
            <tbody>
              {sdgData.map(sdg => (
                <tr key={sdg.sdgNumber}>
                  <td>SDG {sdg.sdgNumber}</td>
                  <td>{sdg.sdgName}</td>
                  <td className="num">{formatNumber(sdg.amount, issuer.currency)}</td>
                  <td className="num">{sdg.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2 italic">
            Aggregated from post-issuance allocation data across all bonds.
          </p>
        </ReportSection>
      )}

      {/* Impact KPIs */}
      {show('impact') && kpiData.length > 0 && (
        <ReportSection title="Impact KPIs">
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th className="num">Total</th>
                <th className="num">per €1M</th>
                <th>Unit</th>
                <th className="num">Bonds</th>
                <th>Methodology</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map(kpi => (
                <tr key={kpi.name}>
                  <td>{kpi.name}</td>
                  <td className="num">{kpi.value >= 1e6 ? `${(kpi.value / 1e6).toFixed(1)}M` : kpi.value >= 1e3 ? `${(kpi.value / 1e3).toFixed(1)}K` : kpi.value.toFixed(0)}</td>
                  <td className="num">{kpi.normalized >= 1e3 ? `${(kpi.normalized / 1e3).toFixed(1)}K` : kpi.normalized.toFixed(1)}</td>
                  <td>{kpi.unit}</td>
                  <td className="num">{kpi.count}</td>
                  <td style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{kpi.methodology || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Frameworks */}
      {show('frameworks') && issuer.frameworks.length > 0 && (
        <ReportSection title="Frameworks">
          <table>
            <thead>
              <tr>
                <th>Framework</th>
                <th>Version</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issuer.frameworks.map((fw, i) => (
                <tr key={i}>
                  <td>{fw.name}</td>
                  <td>{fw.version || '—'}</td>
                  <td>{fw.date ? new Date(fw.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      background: fw.status === 'Active' ? '#d1fae5' : '#f3f4f6',
                      color: fw.status === 'Active' ? '#065f46' : '#6b7280',
                    }}>
                      {fw.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Coverage */}
      {show('coverage') && (
        <ReportSection title="Reporting Coverage">
          <div className="space-y-3">
            <PercentBar value={issuerBonds.length ? (coverage.withFramework / issuerBonds.length) * 100 : 0} label="Framework" />
            <PercentBar value={issuerBonds.length ? (coverage.withSPO / issuerBonds.length) * 100 : 0} label="SPO" />
            <PercentBar value={issuerBonds.length ? (coverage.withImpact / issuerBonds.length) * 100 : 0} label="Impact Report" />
          </div>
        </ReportSection>
      )}

      {/* Bond List */}
      {show('bonds') && (
        <ReportSection title="Bond List">
          <table>
            <thead>
              <tr>
                <th>Bond</th>
                <th>ISIN</th>
                <th>Maturity</th>
                <th className="num">Outstanding</th>
                <th>Labels</th>
              </tr>
            </thead>
            <tbody>
              {issuerBonds.map(bond => (
                <tr key={bond.id}>
                  <td>{bond.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.6875rem' }}>{bond.isin}</td>
                  <td>{new Date(bond.maturityDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                  <td className="num">{formatNumber(bond.outstandingAmount, bond.currency)}</td>
                  <td>
                    {[
                      bond.isGreen && 'Green',
                      bond.isSustainability && 'Sustainable',
                      bond.isClimateAligned && 'Climate',
                    ].filter(Boolean).join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}
    </ReportLayout>
  );
}
