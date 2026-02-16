import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getComparableKPIs, formatKPIDisplay } from '@/lib/comparisonAggregation';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpactKPIComparisonProps {
  subjects: ComparisonSubject[];
}

export function ImpactKPIComparison({ subjects }: ImpactKPIComparisonProps) {
  const comparableKeys = getComparableKPIs(subjects);

  if (comparableKeys.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Normalized Impact KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No methodologically comparable impact KPIs found across the selected items. 
            Impact metrics are only compared when they share the same unit and methodology.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Normalized Impact KPIs</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-xs">
                Impact KPIs are normalized per €1M of total financed amount to enable fair comparison 
                across issuers and instruments of different sizes. Only KPIs with compatible methodology 
                are shown.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[200px] font-semibold sticky left-0 bg-muted/30 z-10">
                  KPI
                </TableHead>
                {subjects.map(s => (
                  <TableHead key={s.id} className="min-w-[160px]">
                    <p className="font-semibold text-foreground truncate max-w-[160px]">{s.label}</p>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparableKeys.map(key => {
                const [name, unit] = key.split('|');

                // Find max normalized value for highlighting
                let maxNormalized = 0;
                subjects.forEach(s => {
                  const kpi = s.impactKPIs.find(k => k.name === name && k.unit === unit);
                  if (kpi && kpi.normalizedValue > maxNormalized) maxNormalized = kpi.normalizedValue;
                });

                return (
                  <TableRow key={key}>
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div>
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <p className="text-[11px] text-muted-foreground">{unit}</p>
                      </div>
                    </TableCell>
                    {subjects.map(s => {
                      const kpi = s.impactKPIs.find(k => k.name === name && k.unit === unit);
                      const isMax = kpi && kpi.normalizedValue === maxNormalized && maxNormalized > 0;
                      return (
                        <TableCell key={s.id}>
                          {kpi ? (
                            <div className="space-y-0.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-semibold tabular-nums text-foreground">
                                  {formatKPIDisplay(kpi.totalValue)}
                                </span>
                                <span className="text-[11px] text-muted-foreground">total</span>
                              </div>
                              <div className="flex items-baseline gap-1.5">
                                <span className={cn(
                                  'text-xs tabular-nums',
                                  isMax && subjects.length > 1 ? 'font-semibold text-accent' : 'text-muted-foreground'
                                )}>
                                  {formatKPIDisplay(kpi.normalizedValue)}
                                </span>
                                <span className="text-[10px] text-muted-foreground/70">per €1M</span>
                              </div>
                              {kpi.methodology && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-[10px] text-muted-foreground/50 underline decoration-dotted cursor-help">
                                      methodology
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-xs">{kpi.methodology}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not reported</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-3 border-t border-border/50">
          <p className="text-[11px] text-muted-foreground italic">
            Only KPIs with compatible methodology across compared items are shown. Normalized values calculated 
            per €1M of total allocated financing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
