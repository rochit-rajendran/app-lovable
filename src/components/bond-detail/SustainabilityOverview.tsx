import { BondEsgDetail } from '@/types/esg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Info } from 'lucide-react';

interface SustainabilityOverviewProps {
  esgDetail: BondEsgDetail;
  currency: string;
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

export function SustainabilityOverview({ esgDetail, currency }: SustainabilityOverviewProps) {
  const sdgData = esgDetail.sdgAllocations.map(a => ({
    name: `SDG ${a.sdgNumber}`,
    fullName: a.sdgName,
    value: a.allocationPercentage,
    amount: a.allocationAmount,
    sdgNumber: a.sdgNumber,
  }));

  const uopData = esgDetail.useOfProceeds.map(u => ({
    name: u.category,
    value: u.allocatedPercentage,
    amount: u.allocatedAmount,
  }));

  if (esgDetail.unallocatedPercentage && esgDetail.unallocatedPercentage > 0) {
    uopData.push({
      name: 'Unallocated',
      value: esgDetail.unallocatedPercentage,
      amount: esgDetail.unallocatedAmount || 0,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SDG Allocation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">SDG Allocation</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {esgDetail.sdgAllocations.map((alloc) => (
                <div key={alloc.sdgNumber} className="flex items-center gap-2.5">
                  <SDGIcon number={alloc.sdgNumber} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{alloc.sdgName}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {alloc.allocationPercentage}% · {formatAmount(alloc.allocationAmount, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Based on issuer-reported allocation
          </p>
        </CardContent>
      </Card>

      {/* Use of Proceeds */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Use of Proceeds Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uopData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% · ${formatAmount(props.payload.amount, currency)}`,
                    'Allocation'
                  ]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {uopData.map((_, index) => (
                    <Cell 
                      key={index} 
                      fill={index === uopData.length - 1 && esgDetail.unallocatedPercentage 
                        ? 'hsl(var(--muted-foreground))' 
                        : UOP_COLORS[index % UOP_COLORS.length]
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {esgDetail.unallocatedPercentage !== undefined && esgDetail.unallocatedPercentage > 0 && (
            <p className="text-[11px] text-muted-foreground mt-2">
              {esgDetail.unallocatedPercentage}% of proceeds remain unallocated
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
