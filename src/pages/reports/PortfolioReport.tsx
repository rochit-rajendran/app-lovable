import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { Bond } from '@/types/bond';
import {
  aggregateSDGs,
  aggregateUseOfProceeds,
  aggregateGeography,
  aggregateCurrency,
  aggregateImpactKPIs,
  aggregateCoverage,
  formatLargeNumber,
  formatKPIValue,
} from '@/lib/portfolioAggregation';
import { ReportLayout, ReportSection, MetricCard, PercentBar } from './ReportLayout';

function formatNumber(value: number, currency?: string): string {
  const ccy = currency || '€';
  if (value >= 1e9) return `${ccy}${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${ccy}${(value / 1e6).toFixed(0)}M`;
  return `${ccy}${value.toLocaleString()}`;
}

export default function PortfolioReport() {
  const [params] = useSearchParams();
  const portfolioId = params.get('id') || '';
  const title = params.get('title') || 'Portfolio ESG Report';
  const subtitle = params.get('subtitle') || undefined;
  const reportingDate = params.get('date') || new Date().toISOString().split('T')[0];
  const enabledSections = params.get('sections')?.split(',') || [];
  const showAll = enabledSections.length === 0;

  const { portfolios } = usePortfolioContext();
  const portfolio = portfolios.find(p => p.id === portfolioId);

  const bonds = useMemo(
    () => portfolio?.holdings.map(h => mockBonds.find(b => b.id === h.bondId)).filter(Boolean) as Bond[] || [],
    [portfolio]
  );

  const totalSize = bonds.reduce((s, b) => s + b.outstandingAmount, 0);
  const greenCount = bonds.filter(b => b.isGreen).length;
  const sustainableCount = bonds.filter(b => b.isSustainability).length;

  const sdgData = useMemo(() => portfolio ? aggregateSDGs(portfolio.holdings, bonds, mockEsgDetails) : [], [portfolio, bonds]);
  const uopData = useMemo(() => portfolio ? aggregateUseOfProceeds(portfolio.holdings, bonds, mockEsgDetails) : [], [portfolio, bonds]);
  const geoData = useMemo(() => portfolio ? aggregateGeography(portfolio.holdings, bonds) : [], [portfolio, bonds]);
  const ccyData = useMemo(() => portfolio ? aggregateCurrency(portfolio.holdings, bonds) : [], [portfolio, bonds]);
  const impactData = useMemo(() => portfolio ? aggregateImpactKPIs(portfolio.holdings, mockEsgDetails) : [], [portfolio]);
  const coverageData = useMemo(() => portfolio ? aggregateCoverage(portfolio.holdings, mockEsgDetails) : null, [portfolio]);

  const show = (id: string) => showAll || enabledSections.includes(id);

  if (!portfolio) {
    return <div className="p-10 text-center text-gray-500">Portfolio not found.</div>;
  }

  return (
    <ReportLayout title={title} subtitle={subtitle} reportingDate={reportingDate}>
      {/* Overview */}
      {show('overview') && (
        <ReportSection title="Portfolio Overview">
          <div className="metric-grid">
            <MetricCard label="Portfolio" value={portfolio.name} />
            <MetricCard label="Type" value={portfolio.type} />
            <MetricCard label="Holdings" value={bonds.length} unit="bonds" />
            <MetricCard label="Total Size" value={formatNumber(totalSize)} />
            <MetricCard label="Green" value={`${bonds.length ? ((greenCount / bonds.length) * 100).toFixed(0) : 0}%`} />
            <MetricCard label="Sustainable" value={`${bonds.length ? ((sustainableCount / bonds.length) * 100).toFixed(0) : 0}%`} />
          </div>
        </ReportSection>
      )}

      {/* SDG Allocation */}
      {show('sdg') && sdgData.length > 0 && (
        <ReportSection title="SDG Allocation">
          <table>
            <thead>
              <tr>
                <th>SDG</th>
                <th>Name</th>
                <th className="num">Allocation</th>
                <th className="num">%</th>
              </tr>
            </thead>
            <tbody>
              {sdgData.map(sdg => (
                <tr key={sdg.sdgNumber}>
                  <td>SDG {sdg.sdgNumber}</td>
                  <td>{sdg.sdgName}</td>
                  <td className="num">{formatNumber(sdg.totalAmount)}</td>
                  <td className="num">{sdg.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Use of Proceeds */}
      {show('uop') && uopData.length > 0 && (
        <ReportSection title="Use of Proceeds Allocation">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th className="num">Allocation</th>
                <th className="num">%</th>
                <th style={{ width: '30%' }}>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {uopData.map(uop => (
                <tr key={uop.category}>
                  <td>{uop.category}</td>
                  <td className="num">{formatNumber(uop.totalAmount)}</td>
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

      {/* Geography */}
      {show('geography') && geoData.length > 0 && (
        <ReportSection title="Geographic Exposure">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th className="num">Bonds</th>
                <th className="num">Exposure</th>
                <th className="num">%</th>
              </tr>
            </thead>
            <tbody>
              {geoData.map(g => (
                <tr key={g.country}>
                  <td>{g.country}</td>
                  <td className="num">{g.bondCount}</td>
                  <td className="num">{formatNumber(g.totalAmount)}</td>
                  <td className="num">{g.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Currency */}
      {show('currency') && ccyData.length > 0 && (
        <ReportSection title="Currency Exposure">
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th className="num">Bonds</th>
                <th className="num">Exposure</th>
                <th className="num">%</th>
              </tr>
            </thead>
            <tbody>
              {ccyData.map(c => (
                <tr key={c.currency}>
                  <td>{c.currency}</td>
                  <td className="num">{c.bondCount}</td>
                  <td className="num">{formatNumber(c.totalAmount)}</td>
                  <td className="num">{c.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Impact KPIs */}
      {show('impact') && impactData.length > 0 && (
        <ReportSection title="Impact Indicators">
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th className="num">Total Value</th>
                <th>Unit</th>
                <th className="num">Bonds Reporting</th>
                <th>Methodology</th>
              </tr>
            </thead>
            <tbody>
              {impactData.map(kpi => (
                <tr key={kpi.name}>
                  <td>{kpi.name}</td>
                  <td className="num">{formatKPIValue(kpi.value, kpi.unit)}</td>
                  <td>{kpi.unit}</td>
                  <td className="num">{kpi.bondCount}</td>
                  <td style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{kpi.methodology || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Coverage */}
      {show('coverage') && coverageData && (
        <ReportSection title="Coverage & Methodology">
          <div className="space-y-3 mb-4">
            <PercentBar value={(coverageData.bondsWithFramework / bonds.length) * 100} label="Framework" />
            <PercentBar value={(coverageData.bondsWithSPO / bonds.length) * 100} label="SPO" />
            <PercentBar value={(coverageData.bondsWithImpactReport / bonds.length) * 100} label="Impact Report" />
            <PercentBar value={(coverageData.bondsWithAllocationReport / bonds.length) * 100} label="Allocation Report" />
          </div>
          {coverageData.spoProviders.length > 0 && (
            <p className="text-xs text-gray-500">
              <strong>SPO providers:</strong> {coverageData.spoProviders.map(p => p.name).join(', ')}
            </p>
          )}
        </ReportSection>
      )}

      {/* Holdings */}
      {show('holdings') && (
        <ReportSection title="Bond Holdings">
          <table>
            <thead>
              <tr>
                <th>Bond</th>
                <th>Issuer</th>
                <th>ISIN</th>
                <th className="num">Size</th>
                <th className="num">Weight</th>
                <th>Labels</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map(h => {
                const bond = bonds.find(b => b.id === h.bondId);
                if (!bond) return null;
                return (
                  <tr key={bond.id}>
                    <td>{bond.name}</td>
                    <td>{bond.issuer}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.6875rem' }}>{bond.isin}</td>
                    <td className="num">{formatNumber(bond.outstandingAmount)}</td>
                    <td className="num">{h.weight != null ? `${h.weight}%` : '—'}</td>
                    <td>
                      {[
                        bond.isGreen && 'Green',
                        bond.isSustainability && 'Sustainable',
                        bond.isClimateAligned && 'Climate',
                      ].filter(Boolean).join(', ') || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ReportSection>
      )}
    </ReportLayout>
  );
}
