import { Bond } from '@/types/bond';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface BondTableProps {
  bonds: Bond[];
  selectedBonds: string[];
  onSelectBond: (id: string) => void;
  onSelectAll: () => void;
  onBondClick: (bond: Bond) => void;
  navigateToDetail?: boolean;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Helper to determine badge color based on label
function getLabelColor(label: string) {
  switch (label) {
    case 'Green':
      return 'border-emerald-500 text-emerald-700 bg-emerald-50';
    case 'Social':
      return 'border-blue-500 text-blue-700 bg-blue-50';
    case 'Sustainability':
      return 'border-orange-500 text-orange-700 bg-orange-50';
    case 'Sustainability-Linked':
      return 'border-purple-500 text-purple-700 bg-purple-50';
    default:
      return 'border-gray-500 text-gray-700 bg-gray-50';
  }
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BondTable({
  bonds,
  selectedBonds,
  onSelectBond,
  onSelectAll,
  onBondClick,
  navigateToDetail = false,
}: BondTableProps) {
  const navigate = useNavigate();
  const allSelected = bonds.length > 0 && selectedBonds.length === bonds.length;
  const someSelected = selectedBonds.length > 0 && selectedBonds.length < bonds.length;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
                }}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>
              ISIN
            </TableHead>
            <TableHead>
              Issuer
            </TableHead>
            <TableHead>
              Sector
            </TableHead>
            <TableHead className="text-right">
              Bond size
            </TableHead>
            <TableHead>
              Currency
            </TableHead>
            <TableHead className="text-right">
              Bond size (EUR)
            </TableHead>
            <TableHead className="text-right">
              Coupon
            </TableHead>
            <TableHead>
              Maturity
            </TableHead>
            <TableHead className="text-right">
              Tenor
            </TableHead>
            <TableHead>
              Label
            </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bonds.map((bond) => (
            <TableRow
              key={bond.id}
              className={cn(
                'data-row cursor-pointer text-xs',
                selectedBonds.includes(bond.id) && 'bg-accent/5'
              )}
              onClick={() => {
                if (navigateToDetail) {
                  navigate(`/bonds/${bond.id}`);
                } else {
                  onBondClick(bond);
                }
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedBonds.includes(bond.id)}
                  onCheckedChange={() => onSelectBond(bond.id)}
                />
              </TableCell>

              <TableCell className="font-mono text-xs text-muted-foreground">
                {bond.isin}
              </TableCell>

              <TableCell className="font-medium">
                {bond.issuer}
              </TableCell>

              <TableCell>
                {bond.sector}
              </TableCell>

              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatLargeNumber(bond.outstandingAmount)}
              </TableCell>

              <TableCell>
                {bond.currency}
              </TableCell>

              <TableCell className="text-right tabular-nums font-medium">
                {formatCurrency(bond.bondSizeEur, 'EUR')}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {bond.couponRate.toFixed(3)}%
              </TableCell>

              <TableCell>
                {formatDate(bond.maturityDate)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {bond.tenor.toFixed(1)}y
              </TableCell>

              <TableCell>
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border',
                  getLabelColor(bond.label)
                )}>
                  {bond.label}
                </span>
              </TableCell>

              <TableCell>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}