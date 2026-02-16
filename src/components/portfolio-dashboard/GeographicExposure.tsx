import { GeoExposure, formatLargeNumber } from '@/lib/portfolioAggregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin } from 'lucide-react';

interface Props {
  data: GeoExposure[];
}

export function GeographicExposure({ data }: Props) {
  if (data.length === 0) return null;

  const maxPct = Math.max(...data.map((d) => d.percentage));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Geographic Exposure</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Portfolio allocation by issuer country
            </p>
          </div>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((geo) => (
            <div key={geo.country} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{geo.country}</span>
                  <span className="text-xs text-muted-foreground">
                    {geo.bondCount} bond{geo.bondCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground tabular-nums text-xs">
                    {formatLargeNumber(geo.totalAmount)}
                  </span>
                  <span className="font-medium tabular-nums w-12 text-right">
                    {geo.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent/70 rounded-full transition-all duration-300"
                  style={{ width: `${(geo.percentage / maxPct) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
