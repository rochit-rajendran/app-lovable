import { AggregatedImpactKPI, formatKPIValue } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Zap, Wind, TreePine, Users, Droplets, Factory } from 'lucide-react';

// Map KPI names to relevant icons
function getKPIIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('ghg') || lower.includes('co₂') || lower.includes('emission')) return Factory;
  if (lower.includes('energy') && lower.includes('generat')) return Zap;
  if (lower.includes('capacity') && lower.includes('renew')) return Wind;
  if (lower.includes('capacity')) return Wind;
  if (lower.includes('marine') || lower.includes('water') || lower.includes('ocean')) return Droplets;
  if (lower.includes('passenger') || lower.includes('beneficiar') || lower.includes('housing')) return Users;
  if (lower.includes('forest') || lower.includes('land') || lower.includes('biodiv')) return TreePine;
  return Zap;
}

// Select the most impactful/meaningful KPIs for display
function selectTopKPIs(kpis: AggregatedImpactKPI[], maxCount = 6): AggregatedImpactKPI[] {
  // Prioritize: GHG emissions, energy generation/savings, capacity, then others
  const priority = [
    'ghg', 'emission', 'co₂',
    'energy generat', 'energy sav',
    'capacity',
    'marine', 'passenger',
  ];

  const scored = kpis.map((kpi) => {
    const lower = kpi.name.toLowerCase();
    let score = 0;
    priority.forEach((p, i) => {
      if (lower.includes(p)) score = Math.max(score, priority.length - i);
    });
    // Boost KPIs from multiple bonds
    score += kpi.bondCount * 2;
    return { kpi, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map((s) => s.kpi);
}

interface Props {
  data: AggregatedImpactKPI[];
}

export function ImpactKPICards({ data }: Props) {
  const topKPIs = selectTopKPIs(data);

  if (topKPIs.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Impact KPIs</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregated portfolio-level impact indicators
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Impact KPIs are aggregated from issuer-reported data across portfolio holdings. Values are weighted by portfolio allocation where applicable.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {topKPIs.map((kpi) => {
            const Icon = getKPIIcon(kpi.name);
            return (
              <div
                key={`${kpi.name}-${kpi.unit}`}
                className="p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-accent/10">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                  </div>
                  {kpi.methodology && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{kpi.methodology}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-xl font-bold tabular-nums text-foreground">
                  {formatKPIValue(kpi.value, kpi.unit)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.unit}</p>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-tight">
                  {kpi.name}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  From {kpi.bondCount} bond{kpi.bondCount > 1 ? 's' : ''}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground mt-4 italic">
          Aggregated from issuer-reported KPIs. Only methodologically compatible metrics are combined.
        </p>
      </CardContent>
    </Card>
  );
}
