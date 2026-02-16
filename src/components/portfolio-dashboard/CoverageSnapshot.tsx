import { CoverageSnapshot as CoverageSnapshotType } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, ClipboardCheck, BookOpen } from 'lucide-react';

interface Props {
  data: CoverageSnapshotType;
  totalBonds: number;
}

export function CoverageSnapshotSection({ data, totalBonds }: Props) {
  const coverageItems = [
    {
      icon: BookOpen,
      label: 'Framework',
      count: data.bondsWithFramework,
      total: totalBonds,
    },
    {
      icon: ClipboardCheck,
      label: 'Allocation Report',
      count: data.bondsWithAllocationReport,
      total: totalBonds,
    },
    {
      icon: FileText,
      label: 'Impact Report',
      count: data.bondsWithImpactReport,
      total: totalBonds,
    },
    {
      icon: Shield,
      label: 'SPO',
      count: data.bondsWithSPO,
      total: totalBonds,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Bond & Framework Coverage</CardTitle>
        <p className="text-xs text-muted-foreground">
          Documentation and review coverage across portfolio holdings
        </p>
      </CardHeader>
      <CardContent>
        {/* Coverage tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {coverageItems.map(({ icon: Icon, label, count, total }) => {
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
            return (
              <div key={label} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {count}/{total}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{pct}% coverage</p>
              </div>
            );
          })}
        </div>

        {/* Provider lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.spoProviders.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                SPO Providers
              </p>
              <div className="space-y-1.5">
                {data.spoProviders.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {p.count} bond{p.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.assuranceProviders.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Assurance Providers
              </p>
              <div className="space-y-1.5">
                {data.assuranceProviders.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {p.count} bond{p.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
