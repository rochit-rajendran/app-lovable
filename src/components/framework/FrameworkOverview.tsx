import { Framework } from '@/types/framework';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FrameworkOverviewProps {
  framework: Framework;
}

function DefinitionRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-border/30 last:border-0">
      <dt className="text-sm text-muted-foreground w-48 flex-shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function FrameworkOverview({ framework }: FrameworkOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Framework Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          <dl>
            <DefinitionRow label="Issuer" value={framework.issuer} />
            <DefinitionRow label="Framework Name" value={framework.name} />
            <DefinitionRow label="Framework Year" value={framework.year} />
            <DefinitionRow label="Framework Type" value={framework.type} />
            <DefinitionRow label="Status" value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                framework.status === 'Active' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
              }`}>
                {framework.status}
              </span>
            } />
          </dl>
          <dl>
            {framework.currency && (
              <DefinitionRow label="Currency Scope" value={framework.currency} />
            )}
            <DefinitionRow label="Bond Types Covered" value={framework.bondTypesCovered.join(', ')} />
            <DefinitionRow label="Alignment" value={
              <div className="space-y-1">
                {framework.alignments.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{a.standard}{a.version ? ` (${a.version})` : ''}</span>
                    <span className={`inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium ${
                      a.status === 'Aligned' ? 'bg-accent/10 text-accent' :
                      a.status === 'Partially Aligned' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            } />
            <DefinitionRow label="SPO Provider" value={framework.spoProvider || '—'} />
            {framework.spoDate && (
              <DefinitionRow label="SPO Date" value={
                new Date(framework.spoDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              } />
            )}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
