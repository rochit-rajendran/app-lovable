import { useState } from 'react';
import { UseOfProceedsCategory } from '@/types/esg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, MapPin, Beaker, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UseOfProceedsSectionProps {
  categories: UseOfProceedsCategory[];
  currency: string;
}

function formatAmount(value: number, currency: string): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: 'bg-accent/10 text-accent',
    Ongoing: 'bg-info/10 text-info',
    Planned: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

function CategorySection({ category, currency }: { category: UseOfProceedsCategory; currency: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-border/60">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <div className="text-left">
                <h4 className="text-sm font-semibold text-foreground">{category.category}</h4>
                {category.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-right flex-shrink-0">
              <div>
                <p className="text-sm font-semibold tabular-nums text-foreground">{formatAmount(category.allocatedAmount, currency)}</p>
                <p className="text-xs text-muted-foreground tabular-nums">{category.allocatedPercentage}% of proceeds</p>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-5 space-y-5 border-t border-border/40 pt-4">
            {/* Projects */}
            {category.projects.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Projects</h5>
                <div className="space-y-3">
                  {category.projects.map((project) => (
                    <div key={project.id} className="rounded-lg border border-border/50 p-3.5 bg-muted/20">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{project.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {project.location}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Beaker className="h-3 w-3" />
                              {project.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {project.allocationAmount && (
                            <span className="text-xs font-medium tabular-nums text-foreground">{formatAmount(project.allocationAmount, currency)}</span>
                          )}
                          <StatusBadge status={project.status} />
                        </div>
                      </div>

                      {/* Project-level KPIs */}
                      {project.impactKPIs.length > 0 && (
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 pt-2.5 border-t border-border/30">
                          {project.impactKPIs.map((kpi, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="text-[11px] text-muted-foreground">{kpi.name}:</span>
                              <span className="text-xs font-semibold tabular-nums text-foreground">
                                {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value} {kpi.unit}
                              </span>
                              {kpi.methodology && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground/50" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    {kpi.methodology}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category-level Impact KPIs */}
            {category.impactKPIs.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Impact KPIs</h5>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-8 text-xs">KPI</TableHead>
                      <TableHead className="h-8 text-xs text-right">Value</TableHead>
                      <TableHead className="h-8 text-xs">Unit</TableHead>
                      <TableHead className="h-8 text-xs text-right">Year</TableHead>
                      <TableHead className="h-8 text-xs w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.impactKPIs.map((kpi, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/30">
                        <TableCell className="py-2 text-sm">{kpi.name}</TableCell>
                        <TableCell className="py-2 text-sm text-right tabular-nums font-semibold">
                          {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-muted-foreground">{kpi.unit}</TableCell>
                        <TableCell className="py-2 text-sm text-right tabular-nums text-muted-foreground">{kpi.reportingYear}</TableCell>
                        <TableCell className="py-2">
                          {kpi.methodology && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-muted-foreground/50" />
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs text-xs">
                                {kpi.methodology}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function UseOfProceedsSection({ categories, currency }: UseOfProceedsSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Use of Proceeds · Projects · Impact</h2>
      <div className="space-y-3">
        {categories.map((category) => (
          <CategorySection key={category.category} category={category} currency={currency} />
        ))}
      </div>
    </div>
  );
}
