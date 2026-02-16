import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { BondTable } from '@/components/bonds/BondTable';
import { BondDetailPanel } from '@/components/bonds/BondDetailPanel';
import { ComparisonDrawer } from '@/components/portfolio/ComparisonDrawer';
import { mockBonds } from '@/data/mockBonds';
import { Bond } from '@/types/bond';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WatchlistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { watchlists, removeBondFromWatchlist } = usePortfolioContext();
  const [selectedBonds, setSelectedBonds] = useState<string[]>([]);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const watchlist = watchlists.find((wl) => wl.id === id);
  const bonds = useMemo(
    () => (watchlist ? mockBonds.filter((b) => watchlist.bondIds.includes(b.id)) : []),
    [watchlist]
  );

  if (!watchlist) {
    return (
      <AppLayout>
        <div className="p-6 flex flex-col items-center justify-center h-[60vh]">
          <p className="text-muted-foreground mb-4">Watchlist not found</p>
          <Button variant="outline" onClick={() => navigate('/watchlists')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Watchlists
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Summary metrics
  const avgYield = bonds.length ? bonds.reduce((s, b) => s + b.yieldToMaturity, 0) / bonds.length : 0;
  const avgDuration = bonds.length ? bonds.reduce((s, b) => s + b.duration, 0) / bonds.length : 0;
  const ratingCounts: Record<string, number> = {};
  bonds.forEach((b) => {
    const bucket = b.creditRating.replace(/[+-]/g, '');
    ratingCounts[bucket] = (ratingCounts[bucket] || 0) + 1;
  });

  const handleSelectBond = (bondId: string) => {
    setSelectedBonds((prev) =>
      prev.includes(bondId) ? prev.filter((x) => x !== bondId) : [...prev, bondId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBonds.length === bonds.length) {
      setSelectedBonds([]);
    } else {
      setSelectedBonds(bonds.map((b) => b.id));
    }
  };

  const handleRemoveSelected = () => {
    selectedBonds.forEach((bondId) => removeBondFromWatchlist(watchlist.id, bondId));
    toast({ title: `Removed ${selectedBonds.length} bond(s) from watchlist` });
    setSelectedBonds([]);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/watchlists')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-foreground">{watchlist.name}</h1>
                {watchlist.description && (
                  <p className="text-sm text-muted-foreground truncate">{watchlist.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedBonds.length >= 2 && selectedBonds.length <= 5 && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setCompareOpen(true)}>
                    <GitCompare className="h-4 w-4" />
                    Compare ({selectedBonds.length})
                  </Button>
                )}
                {selectedBonds.length > 0 && (
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleRemoveSelected}>
                    <Trash2 className="h-4 w-4" />
                    Remove ({selectedBonds.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Lightweight summary */}
            {bonds.length > 0 && (
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Avg Yield</span>{' '}
                  <span className="font-semibold tabular-nums">{avgYield.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Duration</span>{' '}
                  <span className="font-semibold tabular-nums">{avgDuration.toFixed(1)}y</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ratings</span>{' '}
                  <span className="font-medium">
                    {Object.entries(ratingCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([r, c]) => `${r}(${c})`)
                      .join(' · ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bond table */}
          <div className="flex-1 overflow-auto p-4">
            {bonds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground mb-2">No bonds in this watchlist</p>
                <Button variant="outline" onClick={() => navigate('/bonds')}>
                  Add bonds from Discovery
                </Button>
              </div>
            ) : (
              <BondTable
                bonds={bonds}
                selectedBonds={selectedBonds}
                onSelectBond={handleSelectBond}
                onSelectAll={handleSelectAll}
                onBondClick={(bond) => setSelectedBond(bond)}
              />
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedBond && (
          <BondDetailPanel bond={selectedBond} onClose={() => setSelectedBond(null)} />
        )}

        {/* Comparison drawer */}
        <ComparisonDrawer
          open={compareOpen}
          onOpenChange={setCompareOpen}
          bondIds={selectedBonds}
        />
      </div>
    </AppLayout>
  );
}
