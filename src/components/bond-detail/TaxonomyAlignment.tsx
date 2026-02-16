import { TaxonomyData } from '@/types/esg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Landmark, Info } from 'lucide-react';

interface TaxonomyAlignmentProps {
  taxonomy: TaxonomyData;
}

export function TaxonomyAlignment({ taxonomy }: TaxonomyAlignmentProps) {
  return (
    <Card className="border-accent/20 bg-accent/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Landmark className="h-4 w-4 text-accent" />
            EU Taxonomy Alignment
          </CardTitle>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            taxonomy.reportedVsEstimated === 'Reported' 
              ? 'bg-accent/10 text-accent' 
              : taxonomy.reportedVsEstimated === 'Estimated'
                ? 'bg-warning/10 text-warning'
                : 'bg-muted text-muted-foreground'
          }`}>
            {taxonomy.reportedVsEstimated}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top-level metrics */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Eligible Share</p>
            <div className="flex items-center gap-3">
              <Progress value={taxonomy.eligibleShare} className="h-2 flex-1" />
              <span className="text-lg font-bold tabular-nums text-foreground">{taxonomy.eligibleShare}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Aligned Share</p>
            <div className="flex items-center gap-3">
              <Progress value={taxonomy.alignedShare} className="h-2 flex-1" />
              <span className="text-lg font-bold tabular-nums text-accent">{taxonomy.alignedShare}%</span>
            </div>
          </div>
        </div>

        {/* Activity-level breakdown */}
        {taxonomy.activities.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity-Level Alignment</h4>
            <div className="space-y-2.5">
              {taxonomy.activities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-1.5">
                  <span className="text-sm text-foreground flex-1 min-w-0 truncate">{activity.name}</span>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Eligible</span>
                      <p className="text-sm font-medium tabular-nums">{activity.eligibleShare}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Aligned</span>
                      <p className="text-sm font-semibold tabular-nums text-accent">{activity.alignedShare}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
