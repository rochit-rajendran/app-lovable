import { AggregatedSDG, formatLargeNumber } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from 'recharts';

// SDG color palette - official UN SDG colors
const SDG_COLORS: Record<number, string> = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D',
  5: '#FF3A21', 6: '#26BDE2', 7: '#FCC30B', 8: '#A21942',
  9: '#FD6925', 10: '#DD1367', 11: '#FD9D24', 12: '#BF8B2E',
  13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D',
  17: '#19486A',
};

interface Props {
  data: AggregatedSDG[];
}

export function SDGAllocationChart({ data }: Props) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    ...d,
    label: `SDG ${d.sdgNumber}`,
    fill: SDG_COLORS[d.sdgNumber] || 'hsl(var(--chart-1))',
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">SDG Allocation</CardTitle>
        <p className="text-xs text-muted-foreground">
          Portfolio exposure by UN Sustainable Development Goal
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload as (typeof chartData)[0];
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-elevated text-sm">
                      <p className="font-medium">SDG {d.sdgNumber}: {d.sdgName}</p>
                      <p className="text-muted-foreground mt-1">
                        {d.percentage.toFixed(1)}% · {formatLargeNumber(d.totalAmount)}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SDG Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {data.map((sdg) => (
            <Tooltip key={sdg.sdgNumber}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: SDG_COLORS[sdg.sdgNumber] }}
                  />
                  <span className="text-muted-foreground">
                    {sdg.sdgNumber}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">SDG {sdg.sdgNumber}: {sdg.sdgName}</p>
                <p className="text-muted-foreground">{sdg.percentage.toFixed(1)}% · {formatLargeNumber(sdg.totalAmount)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-3 italic">
          SDG mapping based on issuer-reported use of proceeds and allocation data
        </p>
      </CardContent>
    </Card>
  );
}
