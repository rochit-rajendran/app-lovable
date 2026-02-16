import { Framework } from '@/types/framework';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, FileText, ExternalLink } from 'lucide-react';

interface FrameworkHeaderProps {
  framework: Framework;
}

function FrameworkTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    Green: 'bg-accent/10 text-accent border-accent/20',
    Social: 'bg-info/10 text-info border-info/20',
    Sustainability: 'bg-esg-g/10 text-esg-g border-esg-g/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[type] || 'bg-muted text-muted-foreground border-border'}`}>
      {type}
    </span>
  );
}

export function FrameworkHeader({ framework }: FrameworkHeaderProps) {
  const issuerSlug = encodeURIComponent(framework.issuer);

  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Back navigation */}
        <Link
          to={`/issuers/${issuerSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {framework.issuer}
        </Link>

        <div className="flex items-start justify-between gap-6">
          {/* Left: Framework identity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-foreground">{framework.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Link
                    to={`/issuers/${issuerSlug}`}
                    className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    <Building2 className="h-3 w-3" />
                    {framework.issuer}
                  </Link>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-sm text-muted-foreground">{framework.year}</span>
                </div>
              </div>
            </div>

            {/* Labels row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <FrameworkTypeBadge type={framework.type} />
              {framework.alignments.map((a, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    a.status === 'Aligned'
                      ? 'bg-accent/5 text-accent border-accent/20'
                      : a.status === 'Partially Aligned'
                      ? 'bg-warning/5 text-warning border-warning/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {a.standard}{a.version ? ` (${a.version})` : ''}
                </span>
              ))}
              {framework.spoProvider && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                  SPO: {framework.spoProvider}
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                framework.status === 'Active'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {framework.status}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Source Documents
            </Button>
            <Link to={`/issuers/${issuerSlug}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                All Bonds
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
