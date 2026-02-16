import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockBonds } from '@/data/mockBonds';
import { Bond } from '@/types/bond';
import { SustainabilityTags } from '@/components/bonds/ESGBadge';
import { AddToCollectionDialog } from '@/components/portfolio/AddToCollectionDialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bookmark, Briefcase, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function NewIssuances() {
  const navigate = useNavigate();
  const [dialogBond, setDialogBond] = useState<Bond | null>(null);
  const [dialogTab, setDialogTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  // Simulate "new this week" — take most recent bonds by issue date
  const recentBonds = [...mockBonds]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 6);

  const openDialog = (bond: Bond, tab: 'watchlist' | 'portfolio') => {
    setDialogBond(bond);
    setDialogTab(tab);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-foreground">New Issuances This Week</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/bonds')}
        >
          View all new issuances
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_180px_120px_100px_80px] gap-4 px-5 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bond</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issuer</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Date</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</span>
        </div>

        {/* Rows */}
        {recentBonds.map((bond) => (
          <div
            key={bond.id}
            className="grid grid-cols-[1fr_180px_120px_100px_80px] gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => navigate(`/bonds/${bond.id}`)}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                {bond.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{bond.isin}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground truncate">{bond.issuer}</p>
            </div>
            <div className="flex items-center">
              <SustainabilityTags
                isGreen={bond.isGreen}
                isSustainability={bond.isSustainability && !bond.isGreen}
                isClimateAligned={bond.isClimateAligned}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground tabular-nums">
                {new Date(bond.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => openDialog(bond, 'watchlist')}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Add to Watchlist</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => openDialog(bond, 'portfolio')}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Add to Portfolio</p></TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {dialogBond && (
        <AddToCollectionDialog
          open={!!dialogBond}
          onOpenChange={(open) => !open && setDialogBond(null)}
          bond={dialogBond}
          defaultTab={dialogTab}
        />
      )}
    </section>
  );
}
