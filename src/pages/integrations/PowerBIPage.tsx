import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function CopyBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleCopy}>
          {copied ? <><Check className="h-3 w-3 mr-1" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy</>}
        </Button>
      </div>
      <pre className="bg-muted/50 border rounded-md p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

const prerequisites = [
  'Power BI Desktop installed (latest version)',
  'BondDB API key with required scopes (read:bonds, read:portfolios, etc.)',
  'Network access to api.bonddb.com',
];

const bondsQuery = `let
    ApiKey = "YOUR_API_KEY",
    BaseUrl = "https://api.bonddb.com/v1/bonds",
    Source = Json.Document(
        Web.Contents(BaseUrl, [
            Headers = [
                #"Authorization" = "Bearer " & ApiKey,
                #"Content-Type" = "application/json"
            ],
            Query = [
                page = "1",
                limit = "500"
            ]
        ])
    ),
    Data = Source[data],
    ToTable = Table.FromList(Data, Splitter.SplitByNothing()),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1",
        {"isin", "name", "issuer", "currency", "amount_issued",
         "maturity_date", "green_bond", "framework_id", "updated_at"})
in
    Expanded`;

const holdingsQuery = `let
    ApiKey = "YOUR_API_KEY",
    PortfolioId = "PF-001",
    Url = "https://api.bonddb.com/v1/portfolios/" & PortfolioId & "/holdings",
    Source = Json.Document(
        Web.Contents(Url, [
            Headers = [
                #"Authorization" = "Bearer " & ApiKey
            ]
        ])
    ),
    Holdings = Source[holdings],
    ToTable = Table.FromList(Holdings, Splitter.SplitByNothing()),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1",
        {"isin", "name", "weight_pct", "market_value_eur", "esg_rating"})
in
    Expanded`;

const incrementalQuery = `let
    ApiKey = "YOUR_API_KEY",
    LastRefresh = DateTime.ToText(
        DateTime.LocalNow() - #duration(7, 0, 0, 0),
        "yyyy-MM-dd"
    ),
    Url = "https://api.bonddb.com/v1/bonds",
    Source = Json.Document(
        Web.Contents(Url, [
            Headers = [
                #"Authorization" = "Bearer " & ApiKey
            ],
            Query = [
                updated_since = LastRefresh,
                limit = "1000"
            ]
        ])
    ),
    Data = Source[data],
    ToTable = Table.FromList(Data, Splitter.SplitByNothing()),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1",
        {"isin", "name", "issuer", "currency", "amount_issued",
         "maturity_date", "green_bond", "updated_at"})
in
    Expanded`;

export default function PowerBIPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Power BI Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect Power BI to BondDB for automated ESG reporting dashboards.
          </p>
        </div>

        {/* Prerequisites */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prerequisites.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Step by step */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Setup Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">1</Badge>
                <p className="text-sm font-medium text-foreground">Open Power BI Desktop → Get Data → Web</p>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Select "Advanced" to configure headers.</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">2</Badge>
                <p className="text-sm font-medium text-foreground">Enter the API URL</p>
              </div>
              <pre className="bg-muted/50 border rounded-md p-2 text-xs font-mono ml-8">https://api.bonddb.com/v1/bonds</pre>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">3</Badge>
                <p className="text-sm font-medium text-foreground">Add Authorization header</p>
              </div>
              <pre className="bg-muted/50 border rounded-md p-2 text-xs font-mono ml-8">Authorization: Bearer YOUR_API_KEY</pre>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">4</Badge>
                <p className="text-sm font-medium text-foreground">Open Advanced Editor and paste a Power Query snippet</p>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Use the ready-to-copy snippets below.</p>
            </div>
          </CardContent>
        </Card>

        {/* Snippets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Power Query (M) Snippets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CopyBlock label="Bonds Universe" code={bondsQuery} />
            <Separator />
            <CopyBlock label="Portfolio Holdings" code={holdingsQuery} />
            <Separator />
            <CopyBlock label="Incremental Refresh (updated_since)" code={incrementalQuery} />
          </CardContent>
        </Card>

        {/* Guidance */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Tips & Best Practices</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong>Incremental refresh:</strong> Use the <code className="bg-muted px-1 rounded">updated_since</code> parameter to fetch only changed records since last refresh.</li>
              <li>• <strong>Recommended table shapes:</strong> Create separate queries for Bonds, Holdings, Allocations, and KPIs, then join via ISIN or entity_id.</li>
              <li>• <strong>Rate limits:</strong> 1,000 requests/hour per key. A full bond universe pull is typically 2–3 requests.</li>
              <li>• <strong>Scheduling:</strong> BondDB data refreshes weekly (Saturdays 06:00 UTC). Schedule Power BI refresh for Sunday/Monday for latest data.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
