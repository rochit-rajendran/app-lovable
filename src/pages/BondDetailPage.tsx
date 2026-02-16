import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { BondDetailHeader } from '@/components/bond-detail/BondDetailHeader';
import { SustainabilityOverview } from '@/components/bond-detail/SustainabilityOverview';
import { UseOfProceedsSection } from '@/components/bond-detail/UseOfProceedsSection';
import { FrameworkAlignmentSection } from '@/components/bond-detail/FrameworkAlignment';
import { TaxonomyAlignment } from '@/components/bond-detail/TaxonomyAlignment';
import { BondFacts } from '@/components/bond-detail/BondFacts';
import { DocumentsSection } from '@/components/bond-detail/DocumentsSection';
import { DataProvenance } from '@/components/bond-detail/DataProvenance';
import { AddToCollectionDialog } from '@/components/portfolio/AddToCollectionDialog';
import { mockBonds } from '@/data/mockBonds';
import { mockEsgDetails } from '@/data/mockEsgData';
import { mockFrameworks } from '@/data/mockFrameworks';
import { Leaf, AlertCircle } from 'lucide-react';

function findLinkedFramework(issuerName: string) {
  return Object.values(mockFrameworks).find(f => f.issuer === issuerName);
}

export default function BondDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogTab, setAddDialogTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  const bond = mockBonds.find(b => b.id === id);
  if (!bond) return <Navigate to="/bonds" replace />;

  const esgDetail = id ? mockEsgDetails[id] : undefined;
  const hasEsgData = !!esgDetail;
  const linkedFramework = findLinkedFramework(bond.issuer);

  const openAddDialog = (tab: 'watchlist' | 'portfolio') => {
    setAddDialogTab(tab);
    setAddDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Sticky Header */}
        <BondDetailHeader
          bond={bond}
          esgDetail={esgDetail}
          linkedFramework={linkedFramework}
          onAddToPortfolio={() => openAddDialog('portfolio')}
          onAddToWatchlist={() => openAddDialog('watchlist')}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {hasEsgData ? (
              <>
                {/* 1. Bond Facts (top, collapsed) */}
                <section>
                  <BondFacts bond={bond} />
                </section>

                {/* 2. Sustainability Overview (Hero) */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-accent" />
                    Sustainability Overview
                  </h2>
                  <SustainabilityOverview esgDetail={esgDetail} currency={bond.currency} />
                </section>

                {/* 3. Use of Proceeds → Projects → Impact */}
                <section>
                  <UseOfProceedsSection categories={esgDetail.useOfProceeds} currency={bond.currency} />
                </section>

                {/* 4. Framework Alignment & Verification */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Framework Alignment & Verification</h2>
                  <FrameworkAlignmentSection 
                    frameworks={esgDetail.frameworks} 
                    externalReviews={esgDetail.externalReviews}
                    issuerName={bond.issuer}
                  />
                </section>

                {/* 5. EU Taxonomy (if available) */}
                {esgDetail.taxonomy && (
                  <section>
                    <TaxonomyAlignment taxonomy={esgDetail.taxonomy} />
                  </section>
                )}

                {/* 6. Documents & Sources */}
                <section>
                  <DocumentsSection documents={esgDetail.documents} />
                </section>

                {/* 7. Data Coverage & Provenance */}
                <section>
                  <DataProvenance provenance={esgDetail.dataProvenance} />
                </section>
              </>
            ) : (
              <>
                {/* Non-ESG bond: show facts prominently */}
                <div className="rounded-lg border border-border bg-muted/20 p-6 flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">No sustainability data available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This bond does not have ESG, use of proceeds, or framework alignment data. 
                      Financial details are shown below.
                    </p>
                  </div>
                </div>

                <section>
                  <BondFacts bond={bond} defaultOpen />
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add to collection dialog */}
      <AddToCollectionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        bond={bond}
        defaultTab={addDialogTab}
      />
    </AppLayout>
  );
}
