import { AggregatedUoP, formatLargeNumber } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const COLORS = [
  'hsl(160, 84%, 39%)',  // accent
  'hsl(217, 91%, 60%)',  // info
  'hsl(280, 68%, 60%)',  // esg-g
  'hsl(38, 92%, 50%)',   // warning
  'hsl(222, 47%, 20%)',  // primary
  'hsl(160, 84%, 55%)',
  'hsl(217, 91%, 45%)',
  'hsl(280, 68%, 45%)',
];

interface Props {
  data: AggregatedUoP[];
}

export function UoPAllocationChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Use of Proceeds Allocation</CardTitle>
        <p className="text-xs text-muted-foreground">
          Capital allocation by ICMA Use of Proceeds category
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6">
          {/* Donut chart */}
          <div className="h-56 w-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="totalAmount"
                  nameKey="category"
                  strokeWidth={2}
                  stroke="hsl(var(--card))"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as AggregatedUoP;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-elevated text-sm">
                        <p className="font-medium">{d.category}</p>
                        <p className="text-muted-foreground mt-1">
                          {d.percentage.toFixed(1)}% · {formatLargeNumber(d.totalAmount)}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend table */}
          <div className="flex-1 space-y-2 pt-2">
            {data.map((uop, i) => (
              <div key={uop.category} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-sm text-foreground truncate">{uop.category}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  <span className="text-muted-foreground tabular-nums">{formatLargeNumber(uop.totalAmount)}</span>
                  <span className="font-medium tabular-nums w-12 text-right">
                    {uop.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-4 italic">
          Aggregated from post-issuance allocation reports where available
        </p>
      </CardContent>
    </Card>
  );
}
