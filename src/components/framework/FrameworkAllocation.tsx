import { Framework } from '@/types/framework';
import { Bond } from '@/types/bond';
import { mockEsgDetails } from '@/data/mockEsgData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Info } from 'lucide-react';

interface FrameworkAllocationProps {
    framework: Framework;
    bonds: Bond[];
}

const SDG_COLORS: Record<number, string> = {
    7: '#FCC30B',
    9: '#F36D25',
    11: '#F99D26',
    12: '#BF8B2E',
    13: '#3F7E44',
    14: '#0A97D9',
    15: '#56C02B',
};

const UOP_COLORS = [
    'hsl(160, 84%, 39%)',
    'hsl(217, 91%, 60%)',
    'hsl(280, 68%, 60%)',
    'hsl(38, 92%, 50%)',
    'hsl(340, 75%, 55%)',
    'hsl(180, 60%, 45%)',
];

function formatAmount(value: number, currency: string): string {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
    return `${value.toLocaleString()} ${currency}`;
}

function SDGIcon({ number }: { number: number }) {
    return (
        <div
            className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: SDG_COLORS[number] || '#999' }}
        >
            {number}
        </div>
    );
}

export function FrameworkAllocation({ framework, bonds }: FrameworkAllocationProps) {
    // Aggregate SDG allocations
    const sdgMap = new Map<number, { sdgName: string, amount: number }>();
    let totalSdgAmount = 0;

    // Aggregate UoP allocations
    const uopMap = new Map<string, number>(); // category -> amount
    let totalUopAmount = 0;

    let totalUnallocatedAmount = 0;

    bonds.forEach(bond => {
        const esg = mockEsgDetails[bond.id];
        if (esg) {
            esg.sdgAllocations?.forEach(a => {
                const current = sdgMap.get(a.sdgNumber) || { sdgName: a.sdgName, amount: 0 };
                current.amount += a.allocationAmount;
                sdgMap.set(a.sdgNumber, current);
                totalSdgAmount += a.allocationAmount;
            });

            esg.useOfProceeds?.forEach(u => {
                const current = uopMap.get(u.category) || 0;
                uopMap.set(u.category, current + u.allocatedAmount);
                totalUopAmount += u.allocatedAmount;
            });

            if (esg.unallocatedAmount) {
                totalUnallocatedAmount += esg.unallocatedAmount;
            }
        }
    });

    const totalProceeds = totalUopAmount + totalUnallocatedAmount;

    const sdgData = Array.from(sdgMap.entries()).map(([sdgNumber, data]) => ({
        name: `SDG ${sdgNumber}`,
        fullName: data.sdgName,
        value: totalSdgAmount > 0 ? Math.round((data.amount / totalSdgAmount) * 100) : 0,
        amount: data.amount,
        sdgNumber,
    })).sort((a, b) => b.amount - a.amount);

    const uopData = Array.from(uopMap.entries()).map(([category, amount]) => ({
        name: category,
        value: totalProceeds > 0 ? Math.round((amount / totalProceeds) * 100) : 0,
        amount,
    })).sort((a, b) => b.amount - a.amount);

    const unallocatedPercentage = totalProceeds > 0 ? Math.round((totalUnallocatedAmount / totalProceeds) * 100) : 0;

    if (totalUnallocatedAmount > 0) {
        uopData.push({
            name: 'Unallocated',
            value: unallocatedPercentage,
            amount: totalUnallocatedAmount,
        });
    }

    const currency = framework.currency || 'USD';

    if (sdgData.length === 0 && uopData.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Use of Proceeds */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Use of Proceeds Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                    {uopData.length > 0 ? (
                        <>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={uopData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                        <RechartsTooltip
                                            formatter={(value: number, name: string, props: any) => [
                                                `${value}% · ${formatAmount(props.payload.amount, currency)}`,
                                                'Allocation'
                                            ]}
                                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
                                            {uopData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={entry.name === 'Unallocated'
                                                        ? 'hsl(var(--muted-foreground))'
                                                        : UOP_COLORS[index % UOP_COLORS.length]
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            {totalUnallocatedAmount > 0 && (
                                <p className="text-[11px] text-muted-foreground mt-2">
                                    {unallocatedPercentage}% of tracked proceeds remain unallocated across all bonds
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground py-8 text-center">No use of proceeds data available for these bonds.</p>
                    )}
                </CardContent>
            </Card>

            {/* SDG Allocation */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">SDG Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                    {sdgData.length > 0 ? (
                        <>
                            <div className="flex items-start gap-6">
                                <div className="w-40 h-40 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sdgData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={36}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {sdgData.map((entry) => (
                                                    <Cell key={entry.sdgNumber} fill={SDG_COLORS[entry.sdgNumber] || '#999'} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(value: number, name: string, props: any) => [`${value}% · ${formatAmount(props.payload.amount, currency)}`, 'Allocation']}
                                                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-40 pr-2">
                                    {sdgData.map((alloc) => (
                                        <div key={alloc.sdgNumber} className="flex items-center gap-2.5">
                                            <SDGIcon number={alloc.sdgNumber} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-foreground truncate">{alloc.fullName}</p>
                                                <p className="text-xs text-muted-foreground tabular-nums">
                                                    {alloc.value}% · {formatAmount(alloc.amount, currency)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                Aggregated based on issuer-reported allocation across all linked bonds
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground py-8 text-center">No SDG allocation data available for these bonds.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
