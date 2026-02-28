import { useState } from 'react';
import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAllUoPCategories, formatComparisonAmount } from '@/lib/comparisonAggregation';
import { cn } from '@/lib/utils';

interface UoPComparisonMatrixProps {
  subjects: ComparisonSubject[];
}

export function UoPComparisonMatrix({ subjects }: UoPComparisonMatrixProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const categories = getAllUoPCategories(subjects);

  if (categories.length === 0) return null;

  // Find max percentage for each category to highlight leader
  const maxPerCategory = new Map<string, number>();
  categories.forEach(cat => {
    let max = 0;
    subjects.forEach(s => {
      const uop = s.uopAllocation.find(u => u.category === cat);
      if (uop && uop.percentage > max) max = uop.percentage;
    });
    maxPerCategory.set(cat, max);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Use of Proceeds Allocation</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
            <Button
              variant={!showAbsolute ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setShowAbsolute(false)}
            >
              %
            </Button>
            <Button
              variant={showAbsolute ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setShowAbsolute(true)}
            >
              Absolute
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[200px] font-semibold sticky left-0 bg-muted/30 z-10">
                  ICMA Use of Proceeds Category
                </TableHead>
                {subjects.map(s => (
                  <TableHead key={s.id} className="min-w-[140px] text-right">
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[140px]">{s.isin || s.label}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat}>
                  <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">
                    {cat}
                  </TableCell>
                  {subjects.map(s => {
                    const uop = s.uopAllocation.find(u => u.category === cat);
                    const isMax = uop && uop.percentage === maxPerCategory.get(cat) && maxPerCategory.get(cat)! > 0;
                    return (
                      <TableCell key={s.id} className="text-right tabular-nums">
                        {uop ? (
                          <div>
                            <span className={cn(
                              'text-sm',
                              isMax && subjects.length > 1 ? 'font-semibold text-accent' : 'text-foreground'
                            )}>
                              {showAbsolute
                                ? formatComparisonAmount(uop.amount)
                                : `${uop.percentage.toFixed(1)}%`
                              }
                            </span>
                            {!showAbsolute && (
                              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-accent/60 transition-all"
                                  style={{ width: `${uop.percentage}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
