import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BondFilters } from '@/components/bonds/BondFilters';
import { BondTable } from '@/components/bonds/BondTable';
import { BondDetailPanel } from '@/components/bonds/BondDetailPanel';
import { ComparisonDrawer } from '@/components/portfolio/ComparisonDrawer';
import { AddToCollectionDialog } from '@/components/portfolio/AddToCollectionDialog';
import { mockBonds } from '@/data/mockBonds';
import { Bond, BondFilter } from '@/types/bond';
import { Button } from '@/components/ui/button';
import { Download, Columns3, LayoutGrid, GitCompare, Bookmark, Briefcase, Filter } from 'lucide-react';

export default function BondDiscovery() {
  const [filters, setFilters] = useState<BondFilter>({});
  const [selectedBonds, setSelectedBonds] = useState<string[]>([]);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [addDialogBond, setAddDialogBond] = useState<Bond | null>(null);
  const [addDialogTab, setAddDialogTab] = useState<'watchlist' | 'portfolio'>('watchlist');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Filter bonds based on current filters
  const filteredBonds = useMemo(() => {
    return mockBonds.filter(bond => {
      if (filters.labels?.length && !filters.labels.includes(bond.label)) return false;
      if (filters.subsectors?.length && !filters.subsectors.includes(bond.subsector)) return false;
      if (filters.couponRange) {
        if (bond.couponRate < filters.couponRange[0] || bond.couponRate > filters.couponRange[1]) return false;
      }
      if (filters.issuerTypes?.length && !filters.issuerTypes.includes(bond.issuerType)) return false;
      if (filters.creditRatings?.length && !filters.creditRatings.includes(bond.creditRating)) return false;
      if (filters.sectors?.length && !filters.sectors.includes(bond.sector)) return false;
      if (filters.currencies?.length && !filters.currencies.includes(bond.currency)) return false;
      if (filters.countries?.length && !filters.countries.includes(bond.country)) return false;
      return true;
    });
  }, [filters]);

  const handleSelectBond = (id: string) => {
    setSelectedBonds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBonds.length === filteredBonds.length) {
      setSelectedBonds([]);
    } else {
      setSelectedBonds(filteredBonds.map(b => b.id));
    }
  };

  const handleBondClick = (bond: Bond) => {
    setSelectedBond(bond);
  };

  // For bulk add, use the first selected bond as representative
  const firstSelectedBond = selectedBonds.length === 1
    ? mockBonds.find(b => b.id === selectedBonds[0]) || null
    : null;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Filters Sidebar */}
        {isFiltersOpen && (
          <BondFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setIsFiltersOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isFiltersOpen && (
                <Button variant="outline" size="sm" onClick={() => setIsFiltersOpen(true)} className="gap-2">
                  <Filter className="h-4 w-4" />
                  Show Filters
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-foreground">Bond Discovery</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredBonds.length} bonds found
                  {selectedBonds.length > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      • {selectedBonds.length} selected
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedBonds.length >= 2 && selectedBonds.length <= 5 && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setCompareOpen(true)}>
                  <GitCompare className="h-4 w-4" />
                  Compare ({selectedBonds.length})
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none border-r border-border">
                  <Columns3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none opacity-50">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-4">
            <BondTable
              bonds={filteredBonds}
              selectedBonds={selectedBonds}
              onSelectBond={handleSelectBond}
              onSelectAll={handleSelectAll}
              onBondClick={handleBondClick}
            />
          </div>
        </div>

        {/* Detail Panel */}
        {selectedBond && (
          <BondDetailPanel
            bond={selectedBond}
            onClose={() => setSelectedBond(null)}
          />
        )}

        {/* Comparison drawer */}
        <ComparisonDrawer
          open={compareOpen}
          onOpenChange={setCompareOpen}
          bondIds={selectedBonds}
        />

        {/* Add to collection dialog */}
        {addDialogBond && (
          <AddToCollectionDialog
            open={!!addDialogBond}
            onOpenChange={(open) => { if (!open) setAddDialogBond(null); }}
            bond={addDialogBond}
            defaultTab={addDialogTab}
          />
        )}
      </div>
    </AppLayout>
  );
}
