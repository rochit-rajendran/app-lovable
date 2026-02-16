import { useMemo } from 'react';
import { mockBonds } from '@/data/mockBonds';
import { SustainabilityTags } from '@/components/bonds/ESGBadge';
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
  const bonds = useMemo(
    () => bondIds.map((id) => mockBonds.find((b) => b.id === id)).filter(Boolean) as typeof mockBonds,
    [bondIds]
  );

  if (bonds.length < 2) return null;

  const rows: { label: string; values: (string | React.ReactNode)[] }[] = [
    { label: 'ISIN', values: bonds.map((b) => <span className="font-mono text-xs">{b.isin}</span>) },
    { label: 'Issuer', values: bonds.map((b) => b.issuer) },
    { label: 'Coupon', values: bonds.map((b) => `${b.couponRate.toFixed(3)}%`) },
    { label: 'YTM', values: bonds.map((b) => `${b.yieldToMaturity.toFixed(2)}%`) },
    { label: 'Price', values: bonds.map((b) => b.currentPrice.toFixed(2)) },
    { label: 'Duration', values: bonds.map((b) => `${b.duration.toFixed(1)}y`) },
    { label: 'Maturity', values: bonds.map((b) => formatDate(b.maturityDate)) },
    { label: 'Credit Rating', values: bonds.map((b) => (
      <span className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
        b.creditRating.startsWith('AAA') || b.creditRating.startsWith('AA')
          ? 'bg-positive/10 text-positive'
          : b.creditRating.startsWith('A')
            ? 'bg-info/10 text-info'
            : 'bg-warning/10 text-warning'
      )}>
        {b.creditRating}
      </span>
    )) },
    { label: 'Spread (bps)', values: bonds.map((b) => b.spreadToBenchmark.toString()) },
    { label: 'Z-Spread (bps)', values: bonds.map((b) => b.zSpread.toString()) },
    { label: 'Sustainability', values: bonds.map((b) => (
      <SustainabilityTags isGreen={b.isGreen} isSustainability={b.isSustainability} isClimateAligned={b.isClimateAligned} />
    )) },
    { label: 'ESG Score', values: bonds.map((b) => b.esgScore ? b.esgScore.toString() : '—') },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] overflow-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Bond Comparison ({bonds.length})</SheetTitle>
        </SheetHeader>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-36 font-semibold sticky left-0 bg-muted/30 z-10">Metric</TableHead>
                {bonds.map((b) => (
                  <TableHead key={b.id} className="min-w-[180px]">
                    <div>
                      <p className="font-semibold text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{b.issuer}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-muted-foreground text-xs uppercase tracking-wider sticky left-0 bg-card z-10">
                    {row.label}
                  </TableCell>
                  {row.values.map((val, i) => (
                    <TableCell key={i} className="tabular-nums">
                      {val}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
