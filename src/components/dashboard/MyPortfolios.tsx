import { useNavigate } from 'react-router-dom';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { mockBonds } from '@/data/mockBonds';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  Live: 'bg-accent/10 text-accent border-accent/20',
  Model: 'bg-info/10 text-info border-info/20',
  Research: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
};

export function MyPortfolios() {
  const navigate = useNavigate();
  const { portfolios } = usePortfolioContext();

  const displayPortfolios = portfolios.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">My Portfolios</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/portfolios')}
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayPortfolios.map((pf) => {
          const bondIds = pf.holdings.map(h => h.bondId);
          const bonds = bondIds.map(id => mockBonds.find(b => b.id === id)).filter(Boolean);
          const greenCount = bonds.filter(b => b!.isGreen || b!.isClimateAligned).length;
          const greenPct = bonds.length > 0 ? Math.round((greenCount / bonds.length) * 100) : 0;

          return (
            <div
              key={pf.id}
              className="bg-card rounded-xl border border-border p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => navigate(`/portfolios/${pf.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                    {pf.name}
                  </h3>
                </div>
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ml-2',
                  typeColors[pf.type] || 'bg-muted text-muted-foreground border-border'
                )}>
                  {pf.type}
                </span>
              </div>

              {pf.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{pf.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Bonds</span>
                  <p className="font-semibold tabular-nums text-foreground">{pf.holdings.length}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-accent" />
                  <div>
                    <span className="text-muted-foreground text-xs">Green / Climate</span>
                    <p className="font-semibold tabular-nums text-foreground">{greenPct}%</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
