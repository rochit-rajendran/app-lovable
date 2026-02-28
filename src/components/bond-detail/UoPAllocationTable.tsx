import { useState } from 'react';
import { UseOfProceedsCategory } from '@/types/esg';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatComparisonAmount } from '@/lib/comparisonAggregation';

interface UoPAllocationTableProps {
    categories: UseOfProceedsCategory[];
    currency: string;
}

export function UoPAllocationTable({ categories, currency }: UoPAllocationTableProps) {
    const [showAbsolute, setShowAbsolute] = useState(false);

    if (!categories || categories.length === 0) return null;

    // Find max percentage to scale the progress bars
    const maxPercentage = Math.max(...categories.map(c => c.allocatedPercentage));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Allocation Summary</h4>
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

            <div className="rounded-md border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-1/2 font-semibold">Category</TableHead>
                            <TableHead className="w-1/2 font-semibold text-right">Allocation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => {
                            const displayPercentage = !showAbsolute;
                            // we calculate relative width against maxPercentage so the largest bar fills its container
                            const barWidth = maxPercentage > 0 ? (cat.allocatedPercentage / maxPercentage) * 100 : 0;

                            return (
                                <TableRow key={cat.category} className="hover:bg-muted/10">
                                    <TableCell className="font-medium text-sm py-3">
                                        {cat.category}
                                    </TableCell>
                                    <TableCell className="text-right py-3 tabular-nums">
                                        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                                            <span className="text-sm font-semibold text-accent">
                                                {showAbsolute
                                                    ? formatComparisonAmount(cat.allocatedAmount) + ' ' + currency
                                                    : `${cat.allocatedPercentage.toFixed(1)}%`
                                                }
                                            </span>
                                            {displayPercentage && (
                                                <div className="h-1.5 w-full max-w-[150px] rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-accent/60 transition-all duration-500 ease-in-out"
                                                        style={{ width: `${barWidth}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
