import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockApiCatalog } from '@/data/mockIntegrations';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function ApiCatalogPage() {
  const [openGroup, setOpenGroup] = useState<string | null>(mockApiCatalog[0]?.name ?? null);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">API Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Read-only REST endpoints for accessing BondDB ESG data. All responses are JSON.
          </p>
        </div>

        <Card className="bg-muted/30 border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div><span className="font-medium text-foreground">Base URL:</span> https://api.bonddb.com</div>
              <div><span className="font-medium text-foreground">Auth:</span> Bearer token (API key)</div>
              <div><span className="font-medium text-foreground">Format:</span> JSON</div>
              <div><span className="font-medium text-foreground">Pagination:</span> ?page=1&limit=50</div>
              <div><span className="font-medium text-foreground">Incremental:</span> ?updated_since=YYYY-MM-DD</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mockApiCatalog.map((group) => (
            <Card key={group.name}>
              <Collapsible open={openGroup === group.name} onOpenChange={(open) => setOpenGroup(open ? group.name : null)}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between py-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                    <div className="text-left">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{group.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{group.endpoints.length} endpoint{group.endpoints.length > 1 ? 's' : ''}</Badge>
                      {openGroup === group.name ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    {group.endpoints.map((ep) => (
                      <div key={ep.path} className="space-y-3">
                        <Separator />
                        <div className="flex items-center gap-2">
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] font-mono">{ep.method}</Badge>
                          <code className="text-sm font-mono text-foreground">{ep.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{ep.description}</p>

                        {/* Scope */}
                        <div className="text-xs text-muted-foreground">
                          Required scope: <Badge variant="outline" className="text-[10px] ml-1">{ep.scope}</Badge>
                        </div>

                        {/* Example request */}
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">Example Request</p>
                          <pre className="bg-muted/50 border rounded-md p-3 text-xs font-mono text-foreground overflow-x-auto">{ep.exampleRequest}</pre>
                        </div>

                        {/* Example response */}
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">Example Response</p>
                          <pre className="bg-muted/50 border rounded-md p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">{ep.exampleResponse}</pre>
                        </div>

                        {/* Fields */}
                        {ep.fields.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Key Fields</p>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Field</TableHead>
                                  <TableHead className="text-xs">Type</TableHead>
                                  <TableHead className="text-xs">Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {ep.fields.map((f) => (
                                  <TableRow key={f.name}>
                                    <TableCell className="font-mono text-xs py-1.5">{f.name}</TableCell>
                                    <TableCell className="text-xs py-1.5 text-muted-foreground">{f.type}</TableCell>
                                    <TableCell className="text-xs py-1.5">{f.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* Notes */}
                        {ep.notes.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {ep.notes.map((note, i) => (
                              <p key={i} className="text-[11px] text-muted-foreground">💡 {note}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
