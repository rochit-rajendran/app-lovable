import { useState } from 'react';
import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllSDGs, formatComparisonAmount } from '@/lib/comparisonAggregation';
import { cn } from '@/lib/utils';

interface SDGComparisonTableProps {
  subjects: ComparisonSubject[];
}

export function SDGComparisonTable({ subjects }: SDGComparisonTableProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const allSDGs = getAllSDGs(subjects);

  if (allSDGs.length === 0) return null;

  // Count how many subjects contribute to each SDG
  const sdgPresence = new Map<number, number>();
  allSDGs.forEach(sdg => {
    let count = 0;
    subjects.forEach(s => {
      if (s.sdgAllocation.some(a => a.sdgNumber === sdg.sdgNumber)) count++;
    });
    sdgPresence.set(sdg.sdgNumber, count);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">SDG Allocation Comparison</CardTitle>
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
                <TableHead className="min-w-[220px] font-semibold sticky left-0 bg-muted/30 z-10">
                  SDG
                </TableHead>
                {subjects.map(s => (
                  <TableHead key={s.id} className="min-w-[140px] text-right">
                    <p className="font-semibold text-foreground truncate max-w-[140px]">{s.label}</p>
                  </TableHead>
                ))}
                <TableHead className="w-20 text-center">Coverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSDGs.map(sdg => {
                const presence = sdgPresence.get(sdg.sdgNumber) || 0;
                const isShared = presence === subjects.length;
                const isUnique = presence === 1;

                return (
                  <TableRow key={sdg.sdgNumber}>
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground w-6 tabular-nums">
                          {sdg.sdgNumber}
                        </span>
                        <span className="text-sm font-medium text-foreground">{sdg.sdgName}</span>
                      </div>
                    </TableCell>
                    {subjects.map(s => {
                      const alloc = s.sdgAllocation.find(a => a.sdgNumber === sdg.sdgNumber);
                      return (
                        <TableCell key={s.id} className="text-right tabular-nums">
                          {alloc ? (
                            <span className="text-sm text-foreground">
                              {showAbsolute
                                ? formatComparisonAmount(alloc.amount)
                                : `${alloc.percentage.toFixed(1)}%`
                              }
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          isShared && 'border-accent/40 text-accent',
                          isUnique && 'border-info/40 text-info'
                        )}
                      >
                        {isShared ? 'Shared' : isUnique ? 'Unique' : `${presence}/${subjects.length}`}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-3 border-t border-border/50">
          <p className="text-[11px] text-muted-foreground italic">
            SDG mapping based on issuer-reported use-of-proceeds allocation. Methodology may vary across issuers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
