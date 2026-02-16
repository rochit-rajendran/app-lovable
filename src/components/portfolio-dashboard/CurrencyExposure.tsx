import { CurrencyExposure as CurrencyExposureType, formatLargeNumber } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const COLORS = [
  'hsl(222, 47%, 20%)',
  'hsl(160, 84%, 39%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 68%, 60%)',
  'hsl(0, 72%, 51%)',
];

interface Props {
  data: CurrencyExposureType[];
}

export function CurrencyExposureChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Currency Exposure</CardTitle>
        <p className="text-xs text-muted-foreground">
          Portfolio distribution by bond currency
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={68}
                  dataKey="percentage"
                  nameKey="currency"
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
                    const d = payload[0].payload as CurrencyExposureType;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-elevated text-sm">
                        <p className="font-medium">{d.currency}</p>
                        <p className="text-muted-foreground">
                          {d.percentage.toFixed(1)}% · {d.bondCount} bond{d.bondCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {data.map((ccy, i) => (
              <div key={ccy.currency} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{ccy.currency}</span>
                  <span className="text-xs text-muted-foreground">
                    ({ccy.bondCount})
                  </span>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {ccy.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {data.length > 1 && (
          <p className="text-[11px] text-muted-foreground mt-3 italic">
            FX exposure present — portfolio holds bonds in {data.length} currencies
          </p>
        )}
      </CardContent>
    </Card>
  );
}
