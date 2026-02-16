import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsageStats } from '@/data/mockIntegrations';
import { Activity, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function UsageLimitsPage() {
  const stats = mockUsageStats;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usage & Limits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            API request activity and rate limit information.
          </p>
        </div>

        {/* Stats tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Requests (24h)</p>
                  <p className="text-xl font-semibold text-foreground tabular-nums">{stats.requests24h.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Requests (7d)</p>
                  <p className="text-xl font-semibold text-foreground tabular-nums">{stats.requests7d.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Request</p>
                  <p className="text-sm font-medium text-foreground tabular-nums">
                    {stats.lastRequestTimestamp ? format(new Date(stats.lastRequestTimestamp), 'dd MMM yyyy HH:mm') : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top endpoints */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Endpoints (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topEndpoints.map((ep) => (
                  <TableRow key={ep.endpoint} className="data-row">
                    <TableCell className="font-mono text-sm">{ep.endpoint}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{ep.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Rate limit */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Rate Limit Policy</h3>
            <p className="text-xs text-muted-foreground">{stats.softRateLimit}</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
