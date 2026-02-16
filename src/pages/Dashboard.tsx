import { AppLayout } from '@/components/layout/AppLayout';
import { GlobalOrientation } from '@/components/dashboard/GlobalOrientation';
import { NewIssuances } from '@/components/dashboard/NewIssuances';
import { MyPortfolios } from '@/components/dashboard/MyPortfolios';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MarketContext } from '@/components/dashboard/MarketContext';

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
        {/* 1. Global Orientation */}
        <GlobalOrientation />

        {/* 2. New Issuances — first-class section */}
        <NewIssuances />

        {/* Two-column layout: Portfolios + Recent + Market */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Portfolios */}
          <div className="lg:col-span-3 space-y-10">
            <MyPortfolios />
          </div>

          {/* Right: Recent Activity + Market Context */}
          <div className="lg:col-span-2 space-y-8">
            <RecentActivity />
            <MarketContext />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
