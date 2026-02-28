import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComparisonContext } from '@/contexts/ComparisonContext';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { ComparisonHeader } from '@/components/comparison/ComparisonHeader';
import { BondQuickView } from '@/components/comparison/BondQuickView';
import { UoPComparisonMatrix } from '@/components/comparison/UoPComparisonMatrix';
import { FrameworkCriteriaComparison } from '@/components/comparison/FrameworkCriteriaComparison';
import { SDGComparisonTable } from '@/components/comparison/SDGComparisonTable';
import { ImpactKPIComparison } from '@/components/comparison/ImpactKPIComparison';
import { CoverageComparison } from '@/components/comparison/CoverageComparison';
import { ComparisonSummary } from '@/components/comparison/ComparisonSummary';
import { resolveComparisonSubjects } from '@/lib/comparisonAggregation';
import { ComparisonType } from '@/types/comparison';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { comparisons, createComparison, updateComparison } = useComparisonContext();
  const { portfolios } = usePortfolioContext();

  // Parse params: ?type=bond&ids=1,4,9 or ?saved=cmp-1
  const savedId = searchParams.get('saved');
  const typeParam = searchParams.get('type') as ComparisonType | null;
  const idsParam = searchParams.get('ids');

  const [comparisonName, setComparisonName] = useState('Untitled Comparison');
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(savedId);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('bond');

  // Initialize from params
  useEffect(() => {
    if (savedId) {
      const saved = comparisons.find(c => c.id === savedId);
      if (saved) {
        setComparisonName(saved.name);
        setItemIds(saved.itemIds);
        setComparisonType(saved.type);
        setCurrentSavedId(saved.id);
        return;
      }
    }
    if (typeParam && idsParam) {
      setComparisonType(typeParam);
      setItemIds(idsParam.split(','));
      setComparisonName(
        typeParam === 'bond' ? 'Bond Comparison' :
          typeParam === 'portfolio' ? 'Portfolio Comparison' :
            'Issuer Comparison'
      );
    }
  }, [savedId, typeParam, idsParam, comparisons]);

  const subjects = useMemo(
    () => resolveComparisonSubjects(comparisonType, itemIds, portfolios),
    [comparisonType, itemIds, portfolios]
  );

  const handleSave = () => {
    if (currentSavedId) {
      updateComparison(currentSavedId, { name: comparisonName, itemIds });
      toast({ title: 'Comparison updated' });
    } else {
      const comp = createComparison(comparisonName, comparisonType, itemIds);
      setCurrentSavedId(comp.id);
      toast({ title: 'Comparison saved' });
    }
  };

  const handleRemoveItem = (id: string) => {
    if (itemIds.length <= 2) {
      toast({ title: 'Minimum 2 items required', variant: 'destructive' });
      return;
    }
    setItemIds(prev => prev.filter(i => i !== id));
  };

  if (subjects.length < 2) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <GitCompare className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Select at least 2 items to compare.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Sticky comparison header */}
        <ComparisonHeader
          name={comparisonName}
          type={comparisonType}
          subjects={subjects}
          isSaved={!!currentSavedId}
          onNameChange={setComparisonName}
          onSave={handleSave}
          onRemoveItem={handleRemoveItem}
        />

        {/* Scrollable comparison content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1400px] mx-auto p-6 space-y-6">
            {/* 1. Comparison data */}
            <section>
              <div className="mt-3">
                <BondQuickView subjects={subjects} />
              </div>
            </section>

            {/* 2. Use of Proceeds */}
            <section>
              <SectionLabel>Use of Proceeds Allocation</SectionLabel>
              <div className="mt-3">
                <UoPComparisonMatrix subjects={subjects} />
              </div>
            </section>

            {/* 3. Framework Criteria */}
            <section>
              <div className="mt-3">
                <FrameworkCriteriaComparison subjects={subjects} />
              </div>
            </section>

            {/* 4. SDG Allocation */}
            <section>
              <SectionLabel>SDG Allocation</SectionLabel>
              <div className="mt-3">
                <SDGComparisonTable subjects={subjects} />
              </div>
            </section>

            {/* 5. Impact KPIs */}
            <section>
              <SectionLabel>Impact Benchmarking</SectionLabel>
              <div className="mt-3">
                <ImpactKPIComparison subjects={subjects} />
              </div>
            </section>

            {/* 6. Coverage & Data Quality */}
            <section>
              <SectionLabel>Data Quality & Coverage</SectionLabel>
              <div className="mt-3">
                <CoverageComparison subjects={subjects} />
              </div>
            </section>

            {/* 7. Summary */}
            <section>
              <SectionLabel>Summary</SectionLabel>
              <div className="mt-3">
                <ComparisonSummary subjects={subjects} />
              </div>
            </section>
          </div>
        </div>
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
