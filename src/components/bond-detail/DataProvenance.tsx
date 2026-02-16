import { DataProvenance as DataProvenanceType } from '@/types/esg';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DataProvenanceProps {
  provenance: DataProvenanceType;
}

export function DataProvenance({ provenance }: DataProvenanceProps) {
  return (
    <Card className="bg-muted/20 border-border/40">
      <CardContent className="py-4 px-6">
        <div className="flex items-start justify-between gap-8">
          {/* Sources */}
          <div className="flex items-start gap-3">
            <Database className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Data Sources</p>
              <p className="text-sm text-foreground">{provenance.sources.join(' · ')}</p>
            </div>
          </div>

          {/* Last update */}
          <div className="flex items-start gap-3 flex-shrink-0">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-sm text-foreground">
                {new Date(provenance.lastUpdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Completeness */}
          <div className="flex-shrink-0 w-36">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coverage</p>
            <div className="flex items-center gap-2">
              <Progress value={provenance.completeness} className="h-1.5 flex-1" />
              <span className="text-sm font-semibold tabular-nums text-foreground">{provenance.completeness}%</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {provenance.notes && provenance.notes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                {provenance.notes.map((note, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground">{note}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
