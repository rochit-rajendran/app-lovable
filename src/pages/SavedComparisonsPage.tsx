import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComparisonContext } from '@/contexts/ComparisonContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitCompare, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import { ComparisonType } from '@/types/comparison';

const TYPE_LABELS: Record<ComparisonType, string> = {
  bond: 'Bond',
  portfolio: 'Portfolio',
  issuer: 'Issuer',
};

const TYPE_COLORS: Record<ComparisonType, string> = {
  bond: 'bg-info/10 text-info',
  portfolio: 'bg-accent/10 text-accent',
  issuer: 'bg-esg-g/10 text-esg-g',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function SavedComparisonsPage() {
  const navigate = useNavigate();
  const { comparisons, deleteComparison } = useComparisonContext();

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-muted-foreground" />
                Saved Comparisons
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                ESG comparisons across bonds, portfolios, and issuers
              </p>
            </div>
          </div>

          {comparisons.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <GitCompare className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No saved comparisons yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Start a comparison from Bond Discovery, a Portfolio, or an Issuer page
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="min-w-[250px]">Name</TableHead>
                      <TableHead className="w-24">Type</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisons.map(comp => (
                      <TableRow key={comp.id} className="data-row">
                        <TableCell>
                          <Link
                            to={`/comparisons/view?saved=${comp.id}`}
                            className="text-sm font-medium text-primary hover:underline underline-offset-2"
                          >
                            {comp.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[11px] ${TYPE_COLORS[comp.type]}`}>
                            {TYPE_LABELS[comp.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {comp.itemIds.length} item{comp.itemIds.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground tabular-nums">
                          {formatDate(comp.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteComparison(comp.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <Link to={`/comparisons/view?saved=${comp.id}`}>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
