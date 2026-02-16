import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { resolveComparisonSubjects, formatComparisonAmount, getAllUoPCategories, getAllSDGs, getComparableKPIs, formatKPIDisplay } from '@/lib/comparisonAggregation';
import { ComparisonType } from '@/types/comparison';
import { ReportLayout, ReportSection, MetricCard } from './ReportLayout';

export default function ComparisonReport() {
  const [params] = useSearchParams();
  const type = (params.get('type') || 'bond') as ComparisonType;
  const ids = params.get('ids')?.split(',') || [];
  const title = params.get('title') || 'ESG Comparison Report';
  const subtitle = params.get('subtitle') || undefined;
  const reportingDate = params.get('date') || new Date().toISOString().split('T')[0];
  const enabledSections = params.get('sections')?.split(',') || [];
  const showAll = enabledSections.length === 0;

  const { portfolios } = usePortfolioContext();
  const subjects = useMemo(
    () => resolveComparisonSubjects(type, ids, portfolios),
    [type, ids, portfolios]
  );

  const allUoP = useMemo(() => getAllUoPCategories(subjects), [subjects]);
  const allSdgs = useMemo(() => getAllSDGs(subjects), [subjects]);
  const comparableKpis = useMemo(() => getComparableKPIs(subjects), [subjects]);

  const show = (id: string) => showAll || enabledSections.includes(id);

  if (subjects.length < 2) {
    return <div className="p-10 text-center text-gray-500">Not enough items to compare.</div>;
  }

  return (
    <ReportLayout title={title} subtitle={subtitle} reportingDate={reportingDate}>
      {/* Overview */}
      {show('overview') && (
        <ReportSection title="Comparison Overview">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Context</th>
                <th className="num">Bonds</th>
                <th className="num">Total Issuance</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.label}</td>
                  <td style={{ color: '#6b7280' }}>{s.subLabel || '—'}</td>
                  <td className="num">{s.bondCount}</td>
                  <td className="num">{formatComparisonAmount(s.totalIssuance, s.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* UoP Comparison */}
      {show('uop') && allUoP.length > 0 && (
        <ReportSection title="Use of Proceeds Comparison">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                {subjects.map(s => (
                  <th key={s.id} className="num">{s.label}<br /><span style={{ fontWeight: 400, fontSize: '0.625rem' }}>% / Absolute</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allUoP.map(cat => (
                <tr key={cat}>
                  <td>{cat}</td>
                  {subjects.map(s => {
                    const uop = s.uopAllocation.find(u => u.category === cat);
                    return (
                      <td key={s.id} className="num">
                        {uop ? `${uop.percentage.toFixed(1)}%` : '—'}
                        <br />
                        <span style={{ color: '#9ca3af', fontSize: '0.6875rem' }}>
                          {uop ? formatComparisonAmount(uop.amount, s.currency) : ''}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* SDG Comparison */}
      {show('sdg') && allSdgs.length > 0 && (
        <ReportSection title="SDG Allocation Comparison">
          <table>
            <thead>
              <tr>
                <th>SDG</th>
                <th>Name</th>
                {subjects.map(s => (
                  <th key={s.id} className="num">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSdgs.map(sdg => (
                <tr key={sdg.sdgNumber}>
                  <td>SDG {sdg.sdgNumber}</td>
                  <td>{sdg.sdgName}</td>
                  {subjects.map(s => {
                    const alloc = s.sdgAllocation.find(x => x.sdgNumber === sdg.sdgNumber);
                    return (
                      <td key={s.id} className="num">
                        {alloc ? `${alloc.percentage.toFixed(1)}%` : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2 italic">
            SDG mapping based on issuer-reported use-of-proceeds allocation.
          </p>
        </ReportSection>
      )}

      {/* Impact KPIs */}
      {show('impact') && comparableKpis.length > 0 && (
        <ReportSection title="Impact KPI Benchmarking">
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th>Unit</th>
                {subjects.map(s => (
                  <th key={s.id} className="num">{s.label}<br /><span style={{ fontWeight: 400, fontSize: '0.625rem' }}>Total / per €1M</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparableKpis.map(key => {
                const [name, unit] = key.split('|');
                return (
                  <tr key={key}>
                    <td>{name}</td>
                    <td>{unit}</td>
                    {subjects.map(s => {
                      const kpi = s.impactKPIs.find(k => k.name === name && k.unit === unit);
                      return (
                        <td key={s.id} className="num">
                          {kpi ? formatKPIDisplay(kpi.totalValue) : '—'}
                          <br />
                          <span style={{ color: '#9ca3af', fontSize: '0.6875rem' }}>
                            {kpi ? formatKPIDisplay(kpi.normalizedValue) : ''}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2 italic">
            Normalized values represent impact per €1M of financed amount. Only methodologically comparable KPIs shown.
          </p>
        </ReportSection>
      )}

      {/* Coverage */}
      {show('coverage') && (
        <ReportSection title="Data Quality & Coverage">
          <table>
            <thead>
              <tr>
                <th>Indicator</th>
                {subjects.map(s => (
                  <th key={s.id} className="num">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bonds with Framework</td>
                {subjects.map(s => (
                  <td key={s.id} className="num">{s.coverage.bondsWithFramework}/{s.bondCount}</td>
                ))}
              </tr>
              <tr>
                <td>Bonds with SPO</td>
                {subjects.map(s => (
                  <td key={s.id} className="num">{s.coverage.bondsWithSPO}/{s.bondCount}</td>
                ))}
              </tr>
              <tr>
                <td>Bonds with Impact Report</td>
                {subjects.map(s => (
                  <td key={s.id} className="num">{s.coverage.bondsWithImpactReport}/{s.bondCount}</td>
                ))}
              </tr>
              <tr>
                <td>Reporting Completeness</td>
                {subjects.map(s => (
                  <td key={s.id} className="num">{s.coverage.reportingCompleteness}%</td>
                ))}
              </tr>
              <tr>
                <td>Frameworks</td>
                {subjects.map(s => (
                  <td key={s.id} style={{ fontSize: '0.75rem' }}>{s.coverage.frameworks.join(', ') || '—'}</td>
                ))}
              </tr>
              <tr>
                <td>SPO Providers</td>
                {subjects.map(s => (
                  <td key={s.id} style={{ fontSize: '0.75rem' }}>{s.coverage.spoProviders.join(', ') || '—'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </ReportSection>
      )}
    </ReportLayout>
  );
}
