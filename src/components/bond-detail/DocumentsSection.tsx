import { BondDocument } from '@/types/esg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsSectionProps {
  documents: BondDocument[];
}

function DocTypeIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Framework: 'bg-primary/10 text-primary',
    'Allocation Report': 'bg-accent/10 text-accent',
    'Impact Report': 'bg-info/10 text-info',
    SPO: 'bg-warning/10 text-warning',
    Assurance: 'bg-esg-g/10 text-esg-g',
  };

  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[type] || 'bg-muted text-muted-foreground'}`}>
      <FileText className="h-4 w-4" />
    </div>
  );
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Documents & Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
              <div className="flex items-center gap-3 min-w-0">
                <DocTypeIcon type={doc.type} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {doc.provider && <span>{doc.provider}</span>}
                    {doc.provider && <span className="text-muted-foreground/30">·</span>}
                    <span>{new Date(doc.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium bg-muted text-muted-foreground">{doc.type}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
