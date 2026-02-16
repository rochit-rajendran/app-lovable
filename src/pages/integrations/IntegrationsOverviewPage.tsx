import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { mockIntegrationsOverview } from '@/data/mockIntegrations';
import { format } from 'date-fns';
import {
  Key,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export default function IntegrationsOverviewPage() {
  const overview = mockIntegrationsOverview;

  const quickLinks = [
    { label: 'Create API Key', to: '/integrations/api-keys', icon: Key },
    { label: 'Power BI Setup', to: '/integrations/power-bi', icon: BarChart3 },
    { label: 'Excel Setup', to: '/integrations/excel', icon: FileSpreadsheet },
    { label: 'View API Catalog', to: '/integrations/catalog', icon: BookOpen },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">API & Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect BondDB ESG data to your analytics tools via read-only APIs.
          </p>
        </div>

        {/* Status tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {overview.apiAccessEnabled ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">API Access</p>
                  <p className="text-sm font-medium text-foreground">
                    {overview.apiAccessEnabled ? 'Enabled' : 'Not Enabled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Data Refresh</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(overview.lastDataRefresh), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Default Currency</p>
                  <p className="text-sm font-medium text-foreground">{overview.defaultCurrency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Active API Keys</p>
                  <p className="text-sm font-medium text-foreground">{overview.activeKeyCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">Get Started</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <link.icon className="h-5 w-5 text-foreground/70" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        {/* Disclaimers */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Data & Methodology</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• All API access is read-only. No data can be modified via the API.</li>
              <li>• Data is refreshed weekly (Saturdays 06:00 UTC). Intra-week values remain stable.</li>
              <li>• Allocation and impact data is based on issuer-reported frameworks.</li>
              <li>• Converted values are indicative and based on ECB reference rates.</li>
              <li>• API keys are scoped per tenant. Cross-tenant data access is not possible.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
