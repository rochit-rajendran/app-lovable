import { Bond } from '@/types/bond';
import { SustainabilityTags } from './ESGBadge';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
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
             <TableHead className="min-w-[280px]">
               <Button variant="ghost" size="sm" className="gap-1 -ml-2 h-8 text-xs font-semibold">
                 Bond / Issuer
                 <ArrowUpDown className="h-3 w-3" />
               </Button>
             </TableHead>
             <TableHead className="text-right">
               <Button variant="ghost" size="sm" className="gap-1 -mr-2 h-8 text-xs font-semibold">
                 Coupon
                 <ArrowUpDown className="h-3 w-3" />
               </Button>
             </TableHead>
             <TableHead className="text-right">
               <Button variant="ghost" size="sm" className="gap-1 -mr-2 h-8 text-xs font-semibold">
                 YTM
                 <ArrowUpDown className="h-3 w-3" />
               </Button>
             </TableHead>
             <TableHead className="text-right">
               <Button variant="ghost" size="sm" className="gap-1 -mr-2 h-8 text-xs font-semibold">
                 Price
                 <ArrowUpDown className="h-3 w-3" />
               </Button>
             </TableHead>
             <TableHead>
               <Button variant="ghost" size="sm" className="gap-1 -ml-2 h-8 text-xs font-semibold">
                 Maturity
                 <ArrowUpDown className="h-3 w-3" />
               </Button>
             </TableHead>
             <TableHead>Rating</TableHead>
             <TableHead className="text-right">Duration</TableHead>
             <TableHead className="text-right">Outstanding</TableHead>
             <TableHead>Sustainability</TableHead>
             <TableHead className="w-10"></TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {bonds.map((bond) => (
             <TableRow 
               key={bond.id} 
               className={cn(
                 'data-row cursor-pointer',
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
               <TableCell>
                 <div>
                   <p className="font-medium text-foreground">{bond.name}</p>
                   <p className="text-sm text-muted-foreground">{bond.issuer}</p>
                   <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">{bond.isin}</p>
                 </div>
               </TableCell>
               <TableCell className="text-right tabular-nums font-medium">
                 {bond.couponRate.toFixed(3)}%
               </TableCell>
               <TableCell className="text-right tabular-nums font-medium">
                 {bond.yieldToMaturity.toFixed(2)}%
               </TableCell>
               <TableCell className="text-right tabular-nums">
                 {bond.currentPrice.toFixed(2)}
               </TableCell>
               <TableCell className="text-sm">
                 {formatDate(bond.maturityDate)}
               </TableCell>
               <TableCell>
                 <span className={cn(
                   'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                   bond.creditRating.startsWith('AAA') || bond.creditRating.startsWith('AA') 
                     ? 'bg-positive/10 text-positive' 
                     : bond.creditRating.startsWith('A') 
                       ? 'bg-info/10 text-info'
                       : 'bg-warning/10 text-warning'
                 )}>
                   {bond.creditRating}
                 </span>
               </TableCell>
               <TableCell className="text-right tabular-nums">
                 {bond.duration.toFixed(1)}y
               </TableCell>
               <TableCell className="text-right text-sm tabular-nums">
                 {formatLargeNumber(bond.outstandingAmount)} {bond.currency}
               </TableCell>
               <TableCell>
                 <SustainabilityTags 
                   isGreen={bond.isGreen}
                   isSustainability={bond.isSustainability}
                   isClimateAligned={bond.isClimateAligned}
                 />
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