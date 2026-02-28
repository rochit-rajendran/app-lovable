import { useMemo, useState } from 'react';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { formatComparisonAmount } from '@/lib/comparisonAggregation';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ComparisonDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bondIds: string[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ComparisonDrawer({ open, onOpenChange, bondIds }: ComparisonDrawerProps) {
  const [showAbsoluteUop, setShowAbsoluteUop] = useState(false);

  const bonds = useMemo(
    () => bondIds.map((id) => mockBonds.find((b) => b.id === id)).filter(Boolean) as typeof mockBonds,
    [bondIds]
  );

  if (bonds.length < 2) return null;

  // i. Bond to Bond (Bond Quick View)
  const quickViewRows: { label: string; values: (string | React.ReactNode)[] }[] = [
    { label: 'ISIN', values: bonds.map((b) => <span className="font-mono">{b.isin || '—'}</span>) },
    { label: 'Issuer', values: bonds.map((b) => b.issuer || '—') },
    { label: 'Sector', values: bonds.map((b) => b.sector || '—') },
    { label: 'Bond size', values: bonds.map((b) => b.outstandingAmount ? formatComparisonAmount(b.outstandingAmount, b.currency) : '—') },
    { label: 'Currency', values: bonds.map((b) => b.currency || '—') },
    { label: 'Bond size (EUR)', values: bonds.map((b) => b.bondSizeEur ? formatComparisonAmount(b.bondSizeEur, 'EUR') : '—') },
    { label: 'Coupon', values: bonds.map((b) => b.couponRate !== undefined ? `${b.couponRate.toFixed(3)}%` : '—') },
    { label: 'Maturity', values: bonds.map((b) => b.maturityDate ? formatDate(b.maturityDate) : '—') },
    { label: 'Tenor', values: bonds.map((b) => b.tenor ? `${b.tenor} yr` : '—') },
    { label: 'Label', values: bonds.map((b) => b.label || '—') },
  ];

  // ii. UoP Allocation categories (aggregate)
  const uopCategories = new Set<string>();
  bonds.forEach(b => {
    const esg = mockEsgDetails[b.id];
    if (esg?.useOfProceeds) {
      esg.useOfProceeds.forEach(u => uopCategories.add(u.category));
    }
  });
  const allUopCategories = Array.from(uopCategories).sort();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-auto px-6 max-w-7xl mx-auto w-full rounded-t-xl">
        <SheetHeader className="pb-6 pt-2 sticky top-0 bg-background z-20 border-b border-border/50">
          <SheetTitle className="text-xl">Bond Comparison ({bonds.length})</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-12">

          {/* SECTION 1: Bond Quick View */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comparison Data</h2>
              <p className="text-xl font-bold mt-1">Bond to Bond (Bond Quick View)</p>
            </div>
            <div className="border border-border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-48 font-semibold sticky left-0 bg-muted/30 z-10 border-r border-border/50">Attribute</TableHead>
                    {bonds.map((b) => (
                      <TableHead key={b.id} className="min-w-[180px]">
                        <span className="font-semibold text-foreground">{b.isin || b.name}</span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quickViewRows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium text-sm sticky left-0 bg-card z-10 border-r border-border/50">
                        {row.label}
                      </TableCell>
                      {row.values.map((val, i) => (
                        <TableCell key={i}>
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* SECTION 2: UoP Allocation */}
          {allUopCategories.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comparison Data</h2>
                  <p className="text-xl font-bold mt-1">UoP Allocation</p>
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                  <Button
                    variant={!showAbsoluteUop ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={() => setShowAbsoluteUop(false)}
                  >
                    %
                  </Button>
                  <Button
                    variant={showAbsoluteUop ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={() => setShowAbsoluteUop(true)}
                  >
                    Absolute
                  </Button>
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-48 font-semibold sticky left-0 bg-muted/30 z-10 border-r border-border/50">
                        ICMA Use of Proceeds Category
                      </TableHead>
                      {bonds.map((b) => (
                        <TableHead key={b.id} className="min-w-[180px]">
                          <span className="font-semibold text-foreground">{b.isin || b.name}</span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUopCategories.map(cat => (
                      <TableRow key={cat}>
                        <TableCell className="font-medium text-sm sticky left-0 bg-card z-10 border-r border-border/50">
                          {cat}
                        </TableCell>
                        {bonds.map(b => {
                          const esg = mockEsgDetails[b.id];
                          const uop = esg?.useOfProceeds?.find(u => u.category === cat);

                          return (
                            <TableCell key={b.id}>
                              {uop ? (
                                <span className="font-medium text-foreground">
                                  {showAbsoluteUop
                                    ? formatComparisonAmount(uop.allocatedAmount)
                                    : `${uop.allocatedPercentage.toFixed(1)}%`
                                  }
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          {/* SECTION 3: Framework Criteria */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comparison Data</h2>
              <p className="text-xl font-bold mt-1">Framework Criteria</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bonds.map(b => {
                const esg = mockEsgDetails[b.id];
                const primaryFramework = esg?.documents?.find(d => d.type === 'Framework')?.name ||
                  esg?.frameworks?.[0]?.framework;
                const hasUop = esg?.useOfProceeds && esg.useOfProceeds.length > 0;

                return (
                  <div key={b.id} className="border border-border rounded-lg bg-card overflow-hidden flex flex-col">
                    {/* Header Strip */}
                    <div className="bg-muted/30 p-4 border-b border-border/50 flex flex-col gap-2">
                      <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
                        <div>
                          <span className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-0.5">ISIN</span>
                          <span className="font-semibold text-sm font-mono">{b.isin || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-0.5">Issuer</span>
                          <span className="font-semibold text-sm">{b.issuer || '—'}</span>
                        </div>
                        {primaryFramework && (
                          <div className="flex-1 min-w-[200px]">
                            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-0.5">Framework</span>
                            <span className="text-sm font-medium line-clamp-1" title={primaryFramework}>{primaryFramework}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Criteria List */}
                    <div className="p-4 flex-1">
                      {hasUop ? (
                        <div className="space-y-4">
                          {esg.useOfProceeds.map((uop, idx) => (
                            <div key={idx} className="bg-muted/10 rounded-lg p-3 border border-border/30">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                                    ICMA Use of Proceeds Category
                                  </span>
                                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                                    {uop.category}
                                  </h4>
                                  <p className="text-xs text-foreground/80 leading-relaxed">
                                    {uop.description || 'No description provided.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center p-6 text-sm text-muted-foreground italic text-center">
                          No framework criteria available for this bond.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </SheetContent>
    </Sheet>
  );
}
