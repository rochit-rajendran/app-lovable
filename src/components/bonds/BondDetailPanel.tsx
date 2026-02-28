import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bond } from '@/types/bond';
import { X, ExternalLink, TrendingUp, Calendar, Building2, Globe, Banknote, Shield, Briefcase, Bookmark, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AddToCollectionDialog } from '@/components/portfolio/AddToCollectionDialog';
import { cn } from '@/lib/utils';

// New imports for Impact Data visualization
import { mockEsgDetails } from '@/data/mockEsgData';
import { UoPAllocationTable } from '@/components/bond-detail/UoPAllocationTable';

interface BondDetailPanelProps {
  bond: Bond;
  onClose: () => void;
}

function StatItem({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function getLabelColor(label: string) {
  switch (label) {
    case 'Green': return 'border-emerald-500 text-emerald-700 bg-emerald-50';
    case 'Social': return 'border-blue-500 text-blue-700 bg-blue-50';
    case 'Sustainability': return 'border-orange-500 text-orange-700 bg-orange-50';
    case 'Sustainability-Linked': return 'border-purple-500 text-purple-700 bg-purple-50';
    default: return 'border-gray-500 text-gray-700 bg-gray-50';
  }
}

export function BondDetailPanel({ bond, onClose }: BondDetailPanelProps) {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogTab, setAddDialogTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  // Fetch ESG Data corresponding to this bond
  const esgData = mockEsgDetails[bond.id];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLargeNumber = (value: number, currency: string) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T ${currency}`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B ${currency}`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M ${currency}`;
    return `${value.toLocaleString()} ${currency}`;
  };

  const openAddDialog = (tab: 'watchlist' | 'portfolio') => {
    setAddDialogTab(tab);
    setAddDialogOpen(true);
  };

  return (
    <>
      <div className="w-96 border-l border-border bg-card flex flex-col h-full animate-slide-in-right">
        {/* Header (Labels up top) */}
        <div className="p-4 border-b border-border">
          <div className="mb-3">
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border',
              getLabelColor(bond.label || '')
            )}>
              {bond.label || 'Conventional'}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">{bond.name}</h2>
              <p className="text-sm text-muted-foreground truncate">{bond.issuer}</p>
              <p className="text-xs font-mono text-muted-foreground/70 mt-1">{bond.isin}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">

          {/* Key Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Coupon" value={`${bond.couponRate.toFixed(3)}%`} />
              <StatItem label="Currency" value={bond.currency} />
              <StatItem label="Maturity date" value={formatDate(bond.maturityDate)} />
              <StatItem label="Tenor" value={`${bond.tenor.toFixed(1)} yrs`} />
            </div>
          </div>

          <Separator />

          {/* Use of Proceeds */}
          {esgData?.useOfProceeds && esgData.useOfProceeds.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Use of Proceeds</h3>
                <div className="flex flex-wrap gap-2">
                  {esgData.useOfProceeds.map((use) => (
                    <span
                      key={use.category}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border"
                    >
                      {use.category}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* SDGs */}
          {esgData?.sdgAllocations && esgData.sdgAllocations.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">SDGs</h3>
                <div className="flex flex-wrap gap-2">
                  {esgData.sdgAllocations.map((sdg) => (
                    <span
                      key={sdg.sdgNumber}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      SDG {sdg.sdgNumber} - {sdg.sdgName}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Risks Metrics Allocation */}
          {esgData?.useOfProceeds && esgData.useOfProceeds.length > 0 && (
            <>
              <div className="pt-2">
                <UoPAllocationTable categories={esgData.useOfProceeds} currency={bond.currency} />
              </div>
              <Separator />
            </>
          )}

          {/* Bond Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Bond Details</h3>
            <div className="space-y-1">
              <InfoRow icon={Building2} label="Issuer Type" value={bond.issuerType} />
              <InfoRow icon={Globe} label="Country" value={bond.country} />
              <InfoRow icon={Banknote} label="Currency" value={bond.currency} />
              <InfoRow icon={TrendingUp} label="Sector" value={bond.sector} />
              <InfoRow icon={TrendingUp} label="Subsector" value={bond.subsector} />
              <InfoRow icon={Calendar} label="Issue Date" value={formatDate(bond.issueDate)} />
              <InfoRow icon={Calendar} label="Maturity Date" value={formatDate(bond.maturityDate)} />
              <InfoRow icon={Shield} label="Moody's" value={bond.moodysRating || 'N/A'} />
              <InfoRow icon={Shield} label="S&P" value={bond.spRating || 'N/A'} />
              <InfoRow icon={Shield} label="Fitch" value={bond.fitchRating || 'N/A'} />
              <InfoRow icon={Banknote} label="Bond size" value={formatLargeNumber(bond.outstandingAmount, bond.currency)} />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button className="w-full" onClick={() => openAddDialog('portfolio')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Add to Portfolio
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => openAddDialog('watchlist')}>
              <Bookmark className="h-3 w-3 mr-1" />
              Add to Watchlist
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/bonds/${bond.id}`)}>
              <ExternalLink className="h-3 w-3" />
              Full Detail
            </Button>
          </div>
        </div>
      </div>

      <AddToCollectionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        bond={bond}
        defaultTab={addDialogTab}
      />
    </>
  );
}
