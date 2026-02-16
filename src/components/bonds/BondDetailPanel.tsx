import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bond } from '@/types/bond';
import { X, ExternalLink, TrendingUp, Calendar, Building2, Globe, Banknote, Shield, Leaf, Bookmark, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ESGBadge, SustainabilityTags } from './ESGBadge';
import { Separator } from '@/components/ui/separator';
import { AddToCollectionDialog } from '@/components/portfolio/AddToCollectionDialog';

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

export function BondDetailPanel({ bond, onClose }: BondDetailPanelProps) {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogTab, setAddDialogTab] = useState<'watchlist' | 'portfolio'>('watchlist');

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
        {/* Header */}
        <div className="p-4 border-b border-border">
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
          <div className="mt-3">
            <SustainabilityTags 
              isGreen={bond.isGreen}
              isSustainability={bond.isSustainability}
              isClimateAligned={bond.isClimateAligned}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Key Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Coupon Rate" value={`${bond.couponRate.toFixed(3)}%`} />
              <StatItem label="Yield to Maturity" value={`${bond.yieldToMaturity.toFixed(2)}%`} />
              <StatItem label="Current Price" value={bond.currentPrice.toFixed(2)} subValue={`of ${bond.faceValue} par`} />
              <StatItem label="Current Yield" value={`${bond.yield.toFixed(2)}%`} />
            </div>
          </div>

          <Separator />

          {/* Risk Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Risk Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Duration" value={`${bond.duration.toFixed(2)} yrs`} />
              <StatItem label="Modified Duration" value={`${bond.modifiedDuration.toFixed(2)}`} />
              <StatItem label="Spread to Benchmark" value={`${bond.spreadToBenchmark} bps`} />
              <StatItem label="Z-Spread" value={`${bond.zSpread} bps`} />
            </div>
          </div>

          <Separator />

          {/* Bond Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Bond Details</h3>
            <div className="space-y-1">
              <InfoRow icon={Building2} label="Issuer Type" value={bond.issuerType} />
              <InfoRow icon={Globe} label="Country" value={bond.country} />
              <InfoRow icon={Banknote} label="Currency" value={bond.currency} />
              <InfoRow icon={TrendingUp} label="Sector" value={bond.sector} />
              <InfoRow icon={Calendar} label="Issue Date" value={formatDate(bond.issueDate)} />
              <InfoRow icon={Calendar} label="Maturity Date" value={formatDate(bond.maturityDate)} />
              <InfoRow icon={Shield} label="Credit Rating" value={`${bond.creditRating} (${bond.ratingAgency})`} />
              <InfoRow icon={Banknote} label="Outstanding" value={formatLargeNumber(bond.outstandingAmount, bond.currency)} />
            </div>
          </div>

          {/* ESG Scores */}
          {bond.esgScore && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">ESG Scores</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-accent" />
                      <span className="font-medium">Overall ESG</span>
                    </div>
                    <span className="text-2xl font-bold text-accent tabular-nums">{bond.esgScore}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {bond.environmentalScore && (
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <ESGBadge type="environmental" />
                        <p className="text-xl font-bold mt-2 tabular-nums">{bond.environmentalScore}</p>
                      </div>
                    )}
                    {bond.socialScore && (
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <ESGBadge type="social" />
                        <p className="text-xl font-bold mt-2 tabular-nums">{bond.socialScore}</p>
                      </div>
                    )}
                    {bond.governanceScore && (
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <ESGBadge type="governance" />
                        <p className="text-xl font-bold mt-2 tabular-nums">{bond.governanceScore}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Use of Proceeds */}
          {bond.useOfProceeds && bond.useOfProceeds.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Use of Proceeds</h3>
                <div className="flex flex-wrap gap-2">
                  {bond.useOfProceeds.map((use) => (
                    <span 
                      key={use}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {use}
                    </span>
                  ))}
                </div>
                {bond.greenBondFramework && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Framework: {bond.greenBondFramework}
                  </p>
                )}
              </div>
            </>
          )}
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
