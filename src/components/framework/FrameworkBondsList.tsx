import { Framework } from '@/types/framework';
import { Bond } from '@/types/bond';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SustainabilityTags } from '@/components/bonds/ESGBadge';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight } from 'lucide-react';

interface FrameworkBondsListProps {
  framework: Framework;
  bonds: Bond[];
}

function formatLargeNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T ${currency}`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}

export function FrameworkBondsList({ framework, bonds }: FrameworkBondsListProps) {
  if (bonds.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          Bonds Using This Framework ({bonds.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-[200px]">Bond Name</TableHead>
              <TableHead>ISIN</TableHead>
              <TableHead className="text-right">Issue Year</TableHead>
              <TableHead className="text-right">Issue Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonds.map(bond => (
              <TableRow key={bond.id} className="data-row">
                <TableCell>
                  <Link
                    to={`/bonds/${bond.id}`}
                    className="text-sm font-medium text-primary hover:underline underline-offset-2"
                  >
                    {bond.name}
                  </Link>
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">{bond.isin}</TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {new Date(bond.issueDate).getFullYear()}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {formatLargeNumber(bond.outstandingAmount, bond.currency)}
                </TableCell>
                <TableCell className="text-sm">{bond.issuerType}</TableCell>
                <TableCell>
                  <SustainabilityTags
                    isGreen={bond.isGreen}
                    isSustainability={bond.isSustainability}
                    isClimateAligned={bond.isClimateAligned}
                  />
                </TableCell>
                <TableCell>
                  <Link to={`/bonds/${bond.id}`}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
