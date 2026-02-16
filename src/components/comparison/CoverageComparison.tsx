import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, BarChart3, CheckCircle2 } from 'lucide-react';

interface CoverageComparisonProps {
  subjects: ComparisonSubject[];
}

export function CoverageComparison({ subjects }: CoverageComparisonProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Coverage & Data Quality</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(s => (
            <div key={s.id} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                {s.subLabel && <p className="text-xs text-muted-foreground">{s.subLabel}</p>}
              </div>

              {/* Reporting completeness */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Reporting Completeness</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {s.coverage.reportingCompleteness}%
                  </span>
                </div>
                <Progress value={s.coverage.reportingCompleteness} className="h-1.5" />
              </div>

              {/* Coverage indicators */}
              <div className="space-y-2">
                <CoverageItem
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="Framework"
                  count={s.coverage.bondsWithFramework}
                  total={s.bondCount}
                />
                <CoverageItem
                  icon={<Shield className="h-3.5 w-3.5" />}
                  label="SPO"
                  count={s.coverage.bondsWithSPO}
                  total={s.bondCount}
                />
                <CoverageItem
                  icon={<BarChart3 className="h-3.5 w-3.5" />}
                  label="Impact Report"
                  count={s.coverage.bondsWithImpactReport}
                  total={s.bondCount}
                />
              </div>

              {/* SPO Providers */}
              {s.coverage.spoProviders.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">SPO Providers</p>
                  <div className="flex flex-wrap gap-1">
                    {s.coverage.spoProviders.map(p => (
                      <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Frameworks */}
              {s.coverage.frameworks.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Frameworks</p>
                  <div className="flex flex-wrap gap-1">
                    {s.coverage.frameworks.slice(0, 3).map(f => (
                      <Badge key={f} variant="outline" className="text-[10px] max-w-[180px] truncate">{f}</Badge>
                    ))}
                    {s.coverage.frameworks.length > 3 && (
                      <Badge variant="outline" className="text-[10px]">+{s.coverage.frameworks.length - 3}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CoverageItem({ icon, label, count, total }: { icon: React.ReactNode; label: string; count: number; total: number }) {
  const coverage = total > 0 ? count / total : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-foreground flex-1">{label}</span>
      <span className="text-xs tabular-nums text-muted-foreground">
        {count}/{total}
      </span>
      {coverage >= 1 && <CheckCircle2 className="h-3 w-3 text-accent" />}
    </div>
  );
}
