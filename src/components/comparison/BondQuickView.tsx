import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatComparisonAmount } from '@/lib/comparisonAggregation';

interface BondQuickViewProps {
    subjects: ComparisonSubject[];
}

export function BondQuickView({ subjects }: BondQuickViewProps) {
    if (subjects.length === 0) return null;
    // This view is only for bonds, but guard just in case.
    const isBondComparison = subjects.every(s => s.bondCount === 1 && s.isin);

    if (!isBondComparison) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Comparison data</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Bond to Bond (Bond Quick View)</p>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="w-[200px] font-semibold sticky left-0 bg-muted/30 z-10">Attribute</TableHead>
                                {subjects.map(s => (
                                    <TableHead key={s.id} className="min-w-[140px]">
                                        <span className="font-semibold text-foreground truncate max-w-[200px] inline-block">{s.isin || s.label}</span>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">ISIN</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.isin || '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Issuer</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.issuer || '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Sector</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.sector || '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Bond size</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>
                                        {s.totalIssuance ? formatComparisonAmount(s.totalIssuance, s.currency) : '—'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Currency</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.currency || '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Bond size (EUR)</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>
                                        {s.bondSizeEur ? formatComparisonAmount(s.bondSizeEur, 'EUR') : '—'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Coupon</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>
                                        {s.coupon !== undefined ? `${s.coupon}%` : '—'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Maturity</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.maturity || '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10">Tenor</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id}>{s.tenor ? `${s.tenor} yr` : '—'}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium text-sm sticky left-0 bg-card z-10 border-b-0">Label</TableCell>
                                {subjects.map(s => (
                                    <TableCell key={s.id} className="border-b-0">{s.bondLabel || '—'}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
