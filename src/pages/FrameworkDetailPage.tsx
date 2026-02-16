import { useParams, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { getFrameworkById } from '@/data/mockFrameworks';
import { mockBonds } from '@/data/mockBonds';
import { FrameworkHeader } from '@/components/framework/FrameworkHeader';
import { FrameworkOverview } from '@/components/framework/FrameworkOverview';
import { SPOSummary } from '@/components/framework/SPOSummary';
import { FrameworkUoPSection } from '@/components/framework/FrameworkUoPSection';
import { EligibilityMatrix } from '@/components/framework/EligibilityMatrix';
import { FrameworkBondsList } from '@/components/framework/FrameworkBondsList';
import { FrameworkDocuments } from '@/components/framework/FrameworkDocuments';

export default function FrameworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const framework = id ? getFrameworkById(id) : undefined;

  if (!framework) return <Navigate to="/bonds" replace />;

  // Find linked bonds
  const linkedBonds = mockBonds.filter(b => framework.linkedBondIds.includes(b.id));

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        {/* Sticky header */}
        <FrameworkHeader framework={framework} />

        {/* Content sections */}
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          {/* 1. Framework Overview */}
          <FrameworkOverview framework={framework} />

          {/* 2. SPO Summary */}
          <SPOSummary framework={framework} />

          {/* 3. Use of Proceeds & Allocation */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Use of Proceeds & Allocation</h2>
            <FrameworkUoPSection framework={framework} />
          </section>

          {/* 4. Eligibility Criteria Matrix */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Eligibility Criteria</h2>
            <EligibilityMatrix criteria={framework.eligibilityCriteria} />
          </section>

          {/* 5. Bonds Using This Framework */}
          <FrameworkBondsList framework={framework} bonds={linkedBonds} />

          {/* 6. Documents & Sources */}
          <FrameworkDocuments documents={framework.documents} />
        </div>
      </div>
    </AppLayout>
  );
}
