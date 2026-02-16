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

const bondsQuery = `let
    ApiKey = "YOUR_API_KEY",
    Url = "https://api.bonddb.com/v1/bonds",
    Source = Json.Document(
        Web.Contents(Url, [
            Headers = [
                #"Authorization" = "Bearer " & ApiKey
            ],
            Query = [page = "1", limit = "500"]
        ])
    ),
    Data = Source[data],
    ToTable = Table.FromList(Data, Splitter.SplitByNothing()),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1",
        {"isin", "name", "issuer", "currency", "amount_issued",
         "maturity_date", "green_bond", "updated_at"})
in
    Expanded`;

const kpisQuery = `let
    ApiKey = "YOUR_API_KEY",
    EntityType = "portfolio",
    EntityId = "PF-001",
    Url = "https://api.bonddb.com/v1/kpis",
    Source = Json.Document(
        Web.Contents(Url, [
            Headers = [
                #"Authorization" = "Bearer " & ApiKey
            ],
            Query = [
                entity_type = EntityType,
                entity_id = EntityId
            ]
        ])
    ),
    KPIs = Source[kpis],
    ToTable = Table.FromList(KPIs, Splitter.SplitByNothing()),
    Expanded = Table.ExpandRecordColumn(ToTable, "Column1",
        {"name", "value", "unit", "normalized_value",
         "normalized_unit", "reporting_year", "data_type"})
in
    Expanded`;

export default function ExcelPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Excel Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pull BondDB ESG data directly into Excel using Power Query.
          </p>
        </div>

        {/* Prerequisites */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {['Microsoft Excel 2016+ or Microsoft 365', 'BondDB API key with required scopes', 'Network access to api.bonddb.com'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Step-by-Step Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { step: 1, title: 'Open Excel → Data tab → Get Data → From Other Sources → From Web', desc: 'Select "Advanced" to set custom headers.' },
              { step: 2, title: 'Enter the API URL', desc: 'https://api.bonddb.com/v1/bonds' },
              { step: 3, title: 'Add HTTP request header', desc: 'Header name: Authorization — Value: Bearer YOUR_API_KEY' },
              { step: 4, title: 'Click OK and expand the JSON response', desc: 'Power Query Editor will open. Expand the "data" record to get table rows.' },
              { step: 5, title: 'Transform and load', desc: 'Set column types (text, number, date), rename columns as needed, then click "Close & Load".' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                {step > 1 && <Separator className="mb-4" />}
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">{step}</Badge>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-8">{desc}</p>
              </div>
            ))}
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
            <CopyBlock label="Impact KPIs (Portfolio)" code={kpisQuery} />
          </CardContent>
        </Card>

        {/* Refresh guidance */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Weekly Refresh Workflow</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• BondDB data updates weekly (Saturdays 06:00 UTC).</li>
              <li>• To refresh in Excel: <strong>Data tab → Refresh All</strong>, or right-click the query → Refresh.</li>
              <li>• For automated refresh, consider Microsoft Power Automate or a scheduled task.</li>
              <li>• Use the <code className="bg-muted px-1 rounded">updated_since</code> query parameter for incremental updates (append-only tables).</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
