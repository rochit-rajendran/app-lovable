import { EligibilityCriterion } from '@/types/framework';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, Info } from 'lucide-react';

interface EligibilityMatrixProps {
  criteria: EligibilityCriterion[];
}

const SDG_NAMES: Record<number, string> = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Affordable Energy', 8: 'Decent Work',
  9: 'Industry & Innovation', 10: 'Reduced Inequalities', 11: 'Sustainable Cities',
  12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water',
  15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships',
};

function AssessmentBadge({ assessment }: { assessment: string }) {
  const styles: Record<string, string> = {
    'Aligned': 'bg-accent/10 text-accent',
    'Aligned with recommendations': 'bg-warning/10 text-warning',
    'Partially aligned': 'bg-warning/10 text-warning',
    'Not assessed': 'bg-muted text-muted-foreground',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${styles[assessment] || 'bg-muted text-muted-foreground'}`}>
      {assessment}
    </span>
  );
}

export function EligibilityMatrix({ criteria }: EligibilityMatrixProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Eligibility Criteria Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-[160px]">Use of Proceeds</TableHead>
              <TableHead className="min-w-[120px]">SDGs</TableHead>
              <TableHead className="min-w-[300px]">Eligibility Criteria</TableHead>
              <TableHead className="min-w-[180px]">SPO Assessment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((row, idx) => (
              <TableRow key={idx} className="align-top">
                <TableCell>
                  <span className="text-sm font-semibold text-foreground">{row.category}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.sdgs.map(sdg => (
                      <Tooltip key={sdg}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/5 text-primary border border-primary/10 cursor-help">
                            SDG {sdg}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {SDG_NAMES[sdg]}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="space-y-1">
                    {row.criteria.map((c, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <AssessmentBadge assessment={row.spoAssessment} />
                    {row.spoComment && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-start gap-1.5 cursor-help">
                            <Info className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                              {row.spoComment}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs text-xs">
                          {row.spoComment}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
