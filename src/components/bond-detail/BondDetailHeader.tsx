import { Bond } from '@/types/bond';
import { BondEsgDetail } from '@/types/esg';
import { Framework } from '@/types/framework';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Briefcase, Download, ArrowLeft, Layers, GitCompare } from 'lucide-react';

interface BondDetailHeaderProps {
  bond: Bond;
  esgDetail?: BondEsgDetail;
  linkedFramework?: Framework;
  onAddToPortfolio: () => void;
  onAddToWatchlist: () => void;
}

function BondLabelBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    Green: 'bg-accent/10 text-accent border-accent/20',
    Social: 'bg-info/10 text-info border-info/20',
    Sustainability: 'bg-esg-g/10 text-esg-g border-esg-g/20',
    SLB: 'bg-warning/10 text-warning border-warning/20',
    'Climate Aligned': 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[label] || 'bg-muted text-muted-foreground border-border'}`}>
      {label}
    </span>
  );
}

export function BondDetailHeader({ bond, esgDetail, linkedFramework, onAddToPortfolio, onAddToWatchlist }: BondDetailHeaderProps) {
  const issuerSlug = encodeURIComponent(bond.issuer);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Back navigation */}
        <Link to="/bonds" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          Bond Discovery
        </Link>

        <div className="flex items-start justify-between gap-6">
          {/* Left: Bond identity */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-foreground">{bond.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-mono text-muted-foreground">{bond.isin}</span>
              <span className="text-muted-foreground/40">·</span>
              <Link
                to={`/issuers/${issuerSlug}`}
                className="text-sm text-primary hover:underline underline-offset-2"
              >
                {bond.issuer}
              </Link>
              {linkedFramework && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <Link
                    to={`/frameworks/${linkedFramework.id}`}
                    className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    <Layers className="h-3 w-3" />
                    {linkedFramework.name}
                  </Link>
                </>
              )}
            </div>

            {/* Labels */}
            <div className="flex items-center gap-2 mt-3">
              {esgDetail && esgDetail.bondLabel !== 'Conventional' && (
                <BondLabelBadge label={esgDetail.bondLabel} />
              )}
              {(esgDetail?.isClimateAligned || bond.isClimateAligned) && (
                <BondLabelBadge label="Climate Aligned" />
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/comparisons/view?type=bond&ids=${bond.id}`)}
            >
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </Button>
            <Button variant="outline" size="sm" onClick={onAddToWatchlist} className="gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              Watchlist
            </Button>
            <Button variant="outline" size="sm" onClick={onAddToPortfolio} className="gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Portfolio
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>

        {/* Secondary metadata */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>Issued {new Date(bond.issueDate).getFullYear()}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{bond.currency}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>Maturity {new Date(bond.maturityDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{formatLargeNumber(bond.outstandingAmount, bond.currency)} outstanding</span>

          {/* Added Last Updated */}
          {esgDetail?.dataProvenance?.lastUpdate && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span>Last Updated {new Date(esgDetail.dataProvenance.lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatLargeNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T ${currency}`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}
