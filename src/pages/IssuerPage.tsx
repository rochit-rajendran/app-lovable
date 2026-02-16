import { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SustainabilityTags } from '@/components/bonds/ESGBadge';
import { mockIssuers } from '@/data/mockIssuers';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { getFrameworksForIssuer } from '@/data/mockFrameworks';
import { ArrowLeft, Building2, Globe, Briefcase, FileText, ChevronRight, Leaf, Download, ExternalLink, GitCompare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExportDialog } from '@/components/export/ExportDialog';
import { ExportConfig } from '@/types/export';
import { exportIssuerCSV } from '@/lib/csvExport';

const UOP_COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(217, 91%, 60%)',
  'hsl(280, 68%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(340, 75%, 55%)',
  'hsl(180, 60%, 45%)',
];

function formatLargeNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T ${currency}`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function IssuerPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const decodedName = name ? decodeURIComponent(name) : '';
  const issuer = mockIssuers[decodedName];

  if (!issuer) return <Navigate to="/bonds" replace />;

  // Find all bonds for this issuer
  const issuerBonds = mockBonds.filter(b => b.issuer === decodedName);

  const handleExport = (config: ExportConfig) => {
    if (config.format === 'csv') {
      exportIssuerCSV(issuer, issuerBonds, config.reportingDate);
    } else {
      const enabledSections = config.sections.filter(s => s.enabled).map(s => s.id);
      const params = new URLSearchParams({
        issuer: decodedName,
        title: config.title,
        date: config.reportingDate,
        sections: enabledSections.join(','),
      });
      if (config.subtitle) params.set('subtitle', config.subtitle);
      window.open(`/reports/issuer?${params.toString()}`, '_blank');
    }
  };

  // Aggregate use of proceeds across all bonds
  const aggregateUoP: Record<string, number> = {};
  const aggregateSDG: Record<string, { name: string; amount: number }> = {};

  issuerBonds.forEach(bond => {
    const esg = mockEsgDetails[bond.id];
    if (esg) {
      esg.useOfProceeds.forEach(uop => {
        aggregateUoP[uop.category] = (aggregateUoP[uop.category] || 0) + uop.allocatedAmount;
      });
      esg.sdgAllocations.forEach(sdg => {
        const key = `SDG ${sdg.sdgNumber}`;
        if (!aggregateSDG[key]) {
          aggregateSDG[key] = { name: sdg.sdgName, amount: 0 };
        }
        aggregateSDG[key].amount += sdg.allocationAmount;
      });
    }
  });

  const uopChartData = Object.entries(aggregateUoP).map(([name, value]) => ({ name, value }));
  const sdgChartData = Object.entries(aggregateSDG).map(([key, data]) => ({
    name: key,
    fullName: data.name,
    value: data.amount,
  }));

  const hasEsgData = uopChartData.length > 0;

  // Collect all unique documents across bonds
  const allDocuments: { name: string; type: string; provider?: string; date: string }[] = [];
  issuerBonds.forEach(bond => {
    const esg = mockEsgDetails[bond.id];
    if (esg) {
      esg.documents.forEach(doc => {
        if (!allDocuments.some(d => d.name === doc.name)) {
          allDocuments.push(doc);
        }
      });
    }
  });

  // Add issuer framework documents
  issuer.frameworks.forEach(fw => {
    if (!allDocuments.some(d => d.name === fw.name)) {
      allDocuments.push({
        name: fw.name,
        type: 'Framework',
        date: fw.date || '',
      });
    }
  });

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          {/* Back navigation */}
          <Link to="/bonds" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Bond Discovery
          </Link>

          {/* Issuer Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">{issuer.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{issuer.country}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span>{issuer.sector}{issuer.subSector ? ` / ${issuer.subSector}` : ''}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span>{issuer.issuerType}</span>
                  </div>
                </div>
              </div>
              {issuer.description && (
                <p className="text-sm text-muted-foreground max-w-2xl mt-3">{issuer.description}</p>
              )}
            </div>

            {/* Summary stats */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Sustainable Bonds</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">{issuer.sustainableBondCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Sustainable Issuance</p>
                <p className="text-2xl font-bold tabular-nums text-accent">
                  {formatLargeNumber(issuer.totalSustainableIssuance, issuer.currency)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => navigate(`/comparisons/view?type=issuer&ids=${encodeURIComponent(decodedName)}`)}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  Compare
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setExportOpen(true)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Bond List */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              Bonds ({issuerBonds.length})
            </h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="min-w-[200px]">Bond Name</TableHead>
                      <TableHead>ISIN</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Issue Year</TableHead>
                      <TableHead>Maturity</TableHead>
                      <TableHead className="text-right">Issue Size</TableHead>
                      <TableHead>Labels</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issuerBonds.map(bond => (
                      <TableRow key={bond.id} className="data-row">
                        <TableCell>
                          <Link 
                            to={`/bonds/${bond.id}`} 
                            className="text-sm font-medium text-primary hover:underline underline-offset-2"
                          >
                            {bond.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{bond.isin}</TableCell>
                        <TableCell className="text-sm">{bond.issuerType}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">
                          {new Date(bond.issueDate).getFullYear()}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(bond.maturityDate)}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">
                          {formatLargeNumber(bond.outstandingAmount, bond.currency)}
                        </TableCell>
                        <TableCell>
                          <SustainabilityTags
                            isGreen={bond.isGreen}
                            isSustainability={bond.isSustainability}
                            isClimateAligned={bond.isClimateAligned}
                          />
                        </TableCell>
                        <TableCell>
                          <Link to={`/bonds/${bond.id}`}>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Sustainability Summary */}
          {hasEsgData && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-accent" />
                Sustainability Summary
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aggregate UoP */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Allocation by Use of Proceeds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <div className="w-36 h-36 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={uopChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={32}
                              outerRadius={64}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {uopChartData.map((_, index) => (
                                <Cell key={index} fill={UOP_COLORS[index % UOP_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => [formatLargeNumber(value, issuer.currency), 'Allocation']}
                              contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-2">
                        {uopChartData.map((item, idx) => (
                          <div key={item.name} className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: UOP_COLORS[idx % UOP_COLORS.length] }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground tabular-nums">{formatLargeNumber(item.value, issuer.currency)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Aggregate SDG */}
                {sdgChartData.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Allocation by SDG</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2.5">
                        {sdgChartData.map((sdg) => (
                          <div key={sdg.name} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/30 last:border-0">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{sdg.name}</p>
                              <p className="text-xs text-muted-foreground">{sdg.fullName}</p>
                            </div>
                            <span className="text-sm font-semibold tabular-nums text-foreground flex-shrink-0">
                              {formatLargeNumber(sdg.value, issuer.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          {/* Documents */}
          {allDocuments.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Documents
              </h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="min-w-[250px]">Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allDocuments.map((doc, idx) => (
                        <TableRow key={idx} className="data-row">
                          <TableCell className="text-sm font-medium">{doc.name}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground">
                              {doc.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{doc.provider || '—'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.date ? new Date(doc.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Frameworks */}
          {issuer.frameworks.length > 0 && (() => {
            const detailedFrameworks = getFrameworksForIssuer(decodedName);
            return (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4">Frameworks</h2>
                <Card>
                  <CardContent className="py-4">
                    <div className="space-y-3">
                      {issuer.frameworks.map((fw, idx) => {
                        const detailedFw = detailedFrameworks.find(
                          d => d.name === fw.name || (d.name.includes(fw.name.split(' ')[0]) && d.year === (fw.date ? new Date(fw.date).getFullYear() : undefined))
                        );
                        return (
                          <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0">
                            <div>
                              {detailedFw ? (
                                <Link to={`/frameworks/${detailedFw.id}`} className="text-sm font-medium text-primary hover:underline underline-offset-2 inline-flex items-center gap-1">
                                  {fw.name}
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                <p className="text-sm font-medium text-foreground">{fw.name}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {fw.version && `Version ${fw.version}`}
                                {fw.date && ` · ${new Date(fw.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              fw.status === 'Active' ? 'bg-accent/10 text-accent' :
                              fw.status === 'Draft' ? 'bg-info/10 text-info' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {fw.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            );
          })()}
        </div>
      </div>
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        target="issuer"
        defaultTitle={`${issuer.name} — ESG Profile`}
        defaultSubtitle={`${issuer.country} · ${issuer.sector}`}
        onExport={handleExport}
      />
    </AppLayout>
  );
}
