import { Framework } from '@/types/framework';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers, BarChart3 } from 'lucide-react';

interface FrameworkUoPSectionProps {
  framework: Framework;
}

const SDG_NAMES: Record<number, string> = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Affordable Energy', 8: 'Decent Work',
  9: 'Industry & Innovation', 10: 'Reduced Inequalities', 11: 'Sustainable Cities',
  12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water',
  15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships',
};

const UOP_COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(217, 91%, 60%)',
  'hsl(280, 68%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(340, 75%, 55%)',
  'hsl(180, 60%, 45%)',
];

function formatLargeNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T ${currency}`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}

export function FrameworkUoPSection({ framework }: FrameworkUoPSectionProps) {
  const allocatedCategories = framework.allocationSummary.filter(a => a.allocatedAmount > 0);
  const hasAllocation = allocatedCategories.length > 0;

  return (
    <div className="space-y-6">
      {/* UoP Categories Included */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Use of Proceeds Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {framework.useOfProceedsCategories.map((cat, idx) => (
              <div key={idx} className="py-3 border-b border-border/30 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{cat.category}</p>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                    {cat.sdgs.map(sdg => (
                      <span
                        key={sdg}
                        className="inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium bg-primary/5 text-primary border border-primary/10"
                        title={SDG_NAMES[sdg]}
                      >
                        SDG {sdg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allocation Across All Bonds */}
      {hasAllocation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Allocation Across All Bonds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-8">
              <div className="w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocatedCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="allocatedAmount"
                      nameKey="category"
                    >
                      {allocatedCategories.map((_, index) => (
                        <Cell key={index} fill={UOP_COLORS[index % UOP_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatLargeNumber(value, framework.allocationCurrency), 'Allocation']}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {allocatedCategories.map((item, idx) => (
                  <div key={item.category} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: UOP_COLORS[idx % UOP_COLORS.length] }} />
                      <span className="text-sm font-medium text-foreground truncate">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {formatLargeNumber(item.allocatedAmount, framework.allocationCurrency)}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                        {item.allocatedPercentage}%
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
      )}
    </div>
  );
}
