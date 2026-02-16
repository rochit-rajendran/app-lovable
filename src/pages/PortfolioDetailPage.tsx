import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { BondTable } from '@/components/bonds/BondTable';
import { BondDetailPanel } from '@/components/bonds/BondDetailPanel';
import { ComparisonDrawer } from '@/components/portfolio/ComparisonDrawer';
import { PortfolioDashboardHeader } from '@/components/portfolio-dashboard/PortfolioDashboardHeader';
import { SDGAllocationChart } from '@/components/portfolio-dashboard/SDGAllocationChart';
import { UoPAllocationChart } from '@/components/portfolio-dashboard/UoPAllocationChart';
import { GeographicExposure } from '@/components/portfolio-dashboard/GeographicExposure';
import { CurrencyExposureChart } from '@/components/portfolio-dashboard/CurrencyExposure';
import { ImpactKPICards } from '@/components/portfolio-dashboard/ImpactKPICards';
import { CoverageSnapshotSection } from '@/components/portfolio-dashboard/CoverageSnapshot';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { Bond } from '@/types/bond';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  aggregateSDGs,
  aggregateUseOfProceeds,
  aggregateGeography,
  aggregateCurrency,
  aggregateImpactKPIs,
  aggregateCoverage,
} from '@/lib/portfolioAggregation';

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { portfolios, removeBondFromPortfolio } = usePortfolioContext();
  const [selectedBonds, setSelectedBonds] = useState<string[]>([]);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const portfolio = portfolios.find((pf) => pf.id === id);
  const bonds = useMemo(
    () =>
      portfolio
        ? portfolio.holdings
            .map((h) => mockBonds.find((b) => b.id === h.bondId))
            .filter(Boolean) as Bond[]
        : [],
    [portfolio]
  );

  // ESG aggregations
  const sdgData = useMemo(
    () => (portfolio ? aggregateSDGs(portfolio.holdings, bonds, mockEsgDetails) : []),
    [portfolio, bonds]
  );
  const uopData = useMemo(
    () => (portfolio ? aggregateUseOfProceeds(portfolio.holdings, bonds, mockEsgDetails) : []),
    [portfolio, bonds]
  );
  const geoData = useMemo(
    () => (portfolio ? aggregateGeography(portfolio.holdings, bonds) : []),
    [portfolio, bonds]
  );
  const ccyData = useMemo(
    () => (portfolio ? aggregateCurrency(portfolio.holdings, bonds) : []),
    [portfolio, bonds]
  );
  const impactData = useMemo(
    () => (portfolio ? aggregateImpactKPIs(portfolio.holdings, mockEsgDetails) : []),
    [portfolio]
  );
  const coverageData = useMemo(
    () => (portfolio ? aggregateCoverage(portfolio.holdings, mockEsgDetails) : null),
    [portfolio]
  );

  if (!portfolio) {
    return (
      <AppLayout>
        <div className="p-6 flex flex-col items-center justify-center h-[60vh]">
          <p className="text-muted-foreground mb-4">Portfolio not found</p>
          <Button variant="outline" onClick={() => navigate('/portfolios')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolios
          </Button>
        </div>
      </AppLayout>
    );
  }

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
    selectedBonds.forEach((bondId) => removeBondFromPortfolio(portfolio.id, bondId));
    toast({ title: `Removed ${selectedBonds.length} holding(s) from portfolio` });
    setSelectedBonds([]);
  };

  const hasEsgData = sdgData.length > 0 || uopData.length > 0 || impactData.length > 0;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Portfolio Header & Snapshot */}
          <PortfolioDashboardHeader
            portfolio={portfolio}
            bonds={bonds}
            onBack={() => navigate('/portfolios')}
            onAddBonds={() => navigate('/bonds')}
          />

          {/* Scrollable dashboard content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1400px] mx-auto p-6 space-y-6">
              {bonds.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                  <p className="text-muted-foreground mb-2">No holdings in this portfolio</p>
                  <Button variant="outline" onClick={() => navigate('/bonds')}>
                    Add bonds from Discovery
                  </Button>
                </div>
              ) : (
                <>
                  {/* Section 2: Impact & Allocation Overview (Hero) */}
                  {hasEsgData && (
                    <section>
                      <SectionLabel>Impact & Allocation Overview</SectionLabel>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
                        <SDGAllocationChart data={sdgData} />
                        <UoPAllocationChart data={uopData} />
                      </div>
                    </section>
                  )}

                  {/* Section 3 & 4: Geography + Currency */}
                  {(geoData.length > 0 || ccyData.length > 0) && (
                    <section>
                      <SectionLabel>Portfolio Exposure</SectionLabel>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
                        <GeographicExposure data={geoData} />
                        <CurrencyExposureChart data={ccyData} />
                      </div>
                    </section>
                  )}

                  {/* Section 5: Impact KPIs */}
                  {impactData.length > 0 && (
                    <section>
                      <SectionLabel>Impact Indicators</SectionLabel>
                      <div className="mt-3">
                        <ImpactKPICards data={impactData} />
                      </div>
                    </section>
                  )}

                  {/* Section 6: Coverage Snapshot */}
                  {coverageData && (
                    <section>
                      <SectionLabel>Governance & Coverage</SectionLabel>
                      <div className="mt-3">
                        <CoverageSnapshotSection data={coverageData} totalBonds={bonds.length} />
                      </div>
                    </section>
                  )}

                  {/* Section 7: Holdings Table (Anchor) */}
                  <section>
                    <div className="flex items-center justify-between">
                      <SectionLabel>Holdings</SectionLabel>
                      <div className="flex items-center gap-2">
                        {selectedBonds.length >= 2 && selectedBonds.length <= 5 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setCompareOpen(true)}
                          >
                            <GitCompare className="h-4 w-4" />
                            Compare ({selectedBonds.length})
                          </Button>
                        )}
                        {selectedBonds.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            onClick={handleRemoveSelected}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove ({selectedBonds.length})
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <BondTable
                        bonds={bonds}
                        selectedBonds={selectedBonds}
                        onSelectBond={handleSelectBond}
                        onSelectAll={handleSelectAll}
                        onBondClick={(bond) => setSelectedBond(bond)}
                      />
                    </div>
                  </section>
                </>
              )}
            </div>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {children}
    </h2>
  );
}
