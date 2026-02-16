import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio } from '@/types/portfolio';
import { Bond } from '@/types/bond';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Plus, Settings, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortfolioType } from '@/types/portfolio';
import { formatLargeNumber } from '@/lib/portfolioAggregation';
import { ExportDialog } from '@/components/export/ExportDialog';
import { ExportConfig } from '@/types/export';
import { exportPortfolioCSV } from '@/lib/csvExport';
import { mockBonds } from '@/data/mockBonds';

const typeStyles: Record<PortfolioType, string> = {
  Live: 'bg-positive/10 text-positive',
  Model: 'bg-info/10 text-info',
  Research: 'bg-warning/10 text-warning',
};

interface Props {
  portfolio: Portfolio;
  bonds: Bond[];
  onBack: () => void;
  onAddBonds: () => void;
}

export function PortfolioDashboardHeader({ portfolio, bonds, onBack, onAddBonds }: Props) {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const totalSize = bonds.reduce((s, b) => s + b.outstandingAmount, 0);
  const greenCount = bonds.filter((b) => b.isGreen).length;
  const socialCount = bonds.filter((b) => b.isSustainability && !b.isGreen).length;
  const sustainableCount = bonds.filter((b) => b.isSustainability).length;

  const greenPct = bonds.length ? ((greenCount / bonds.length) * 100).toFixed(0) : '0';
  const socialPct = bonds.length ? ((socialCount / bonds.length) * 100).toFixed(0) : '0';
  const sustainablePct = bonds.length ? ((sustainableCount / bonds.length) * 100).toFixed(0) : '0';

  const handleExport = (config: ExportConfig) => {
    if (config.format === 'csv') {
      const allBonds = portfolio.holdings
        .map(h => mockBonds.find(b => b.id === h.bondId))
        .filter(Boolean) as Bond[];
      exportPortfolioCSV(portfolio, allBonds, config.reportingDate);
    } else {
      const enabledSections = config.sections.filter(s => s.enabled).map(s => s.id);
      const params = new URLSearchParams({
        id: portfolio.id,
        title: config.title,
        date: config.reportingDate,
        sections: enabledSections.join(','),
      });
      if (config.subtitle) params.set('subtitle', config.subtitle);
      window.open(`/reports/portfolio?${params.toString()}`, '_blank');
    }
  };

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          {/* Top row: back + name + actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mt-0.5 shrink-0"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-semibold text-foreground">{portfolio.name}</h1>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                      typeStyles[portfolio.type]
                    )}
                  >
                    {portfolio.type}
                  </span>
                </div>
                {portfolio.description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    {portfolio.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/comparisons/view?type=portfolio&ids=${portfolio.id}`)}
              >
                <GitCompare className="h-3.5 w-3.5" />
                Compare
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setExportOpen(true)}
              >
                <Download className="h-3.5 w-3.5" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button size="sm" className="gap-2" onClick={onAddBonds}>
                <Plus className="h-3.5 w-3.5" />
                Add Bonds
              </Button>
            </div>
          </div>

          {/* Snapshot pills */}
          {bonds.length > 0 && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <SnapshotPill label="Bonds" value={bonds.length.toString()} />
              <SnapshotPill label="Portfolio Size" value={formatLargeNumber(totalSize)} />
              <div className="w-px h-5 bg-border" />
              {Number(greenPct) > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  {greenPct}% Green
                </span>
              )}
              {Number(socialPct) > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-esg-s/10 text-esg-s">
                  {socialPct}% Social
                </span>
              )}
              {Number(sustainablePct) > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-esg-g/10 text-esg-g">
                  {sustainablePct}% Sustainable
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        target="portfolio"
        defaultTitle={`${portfolio.name} — ESG Report`}
        defaultSubtitle={`${portfolio.type} Portfolio · ${bonds.length} holdings`}
        onExport={handleExport}
      />
    </>
  );
}

function SnapshotPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}
