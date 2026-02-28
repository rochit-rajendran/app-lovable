import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEsgDetails } from '@/data/mockEsgData';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface FrameworkCriteriaComparisonProps {
    subjects: ComparisonSubject[];
}

export function FrameworkCriteriaComparison({ subjects }: FrameworkCriteriaComparisonProps) {
    if (subjects.length === 0) return null;
    // This view makes the most sense for bonds.
    const isBondComparison = subjects.every(s => s.bondCount === 1 && s.isin);

    if (!isBondComparison) return null;

    return (
        <Card>
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-semibold">Framework Criteria</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-border/50">
                    {subjects.map(subject => {
                        const esg = mockEsgDetails[subject.id];

                        // Get framework name, defaulting if none exists
                        const primaryFramework = esg?.documents?.find(d => d.type === 'Framework')?.name ||
                            esg?.frameworks?.[0]?.framework ||
                            'No Framework Available';

                        return (
                            <div key={subject.id} className="p-6">
                                {/* Header matching Bond Discovery style */}
                                <div className="flex flex-wrap gap-x-6 gap-y-2 items-center mb-6">
                                    <div>
                                        <span className="text-xs text-muted-foreground mr-2">ISIN</span>
                                        <span className="font-semibold text-sm">{subject.isin || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground mr-2">Issuer</span>
                                        <span className="font-semibold text-sm">{subject.issuer || '—'}</span>
                                    </div>
                                    {primaryFramework && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Framework</span>
                                            <Badge variant="outline" className="font-normal text-xs bg-muted/20">
                                                {primaryFramework}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Criteria List */}
                                {esg?.useOfProceeds && esg.useOfProceeds.length > 0 ? (
                                    <div className="space-y-4">
                                        {esg.useOfProceeds.map((uop, idx) => (
                                            <div key={idx} className="bg-muted/20 rounded-lg p-4 border border-border/30">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                                                    <h4 className="text-sm font-semibold text-foreground">
                                                        {uop.category}
                                                    </h4>
                                                </div>
                                                <div className="pl-6">
                                                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                                                        ICMA Use of Proceeds Category
                                                    </span>
                                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                                        {uop.description || 'No description provided.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic py-4">
                                        No framework criteria available for this bond.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
