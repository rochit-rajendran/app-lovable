import { useState } from 'react';
import { Bond } from '@/types/bond';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BondFactsProps {
  bond: Bond;
  defaultOpen?: boolean;
}

function FactRow({ label, value, isLink, to }: { label: string; value: string; isLink?: boolean; to?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {isLink && to ? (
        <Link to={to} className="text-sm font-medium text-primary hover:underline underline-offset-2">{value}</Link>
      ) : (
        <span className="text-sm font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function formatLargeNumber(value: number, currency: string): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T ${currency}`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B ${currency}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M ${currency}`;
  return `${value.toLocaleString()} ${currency}`;
}

export function BondFacts({ bond, defaultOpen = false }: BondFactsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Bond Facts
            </CardTitle>
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bond & Issuance Details */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bond & Issuance</h4>
                <div>
                  <FactRow label="ISIN" value={bond.isin} />
                  <FactRow label="Bond Type" value={bond.label || 'Conventional'} />
                  <FactRow label="Issue Date" value={formatDate(bond.issueDate)} />
                  <FactRow label="Maturity Date" value={formatDate(bond.maturityDate)} />
                  <FactRow label="Coupon" value={`${bond.couponRate.toFixed(3)}%`} />
                  <FactRow label="Bond Size" value={formatLargeNumber(bond.outstandingAmount, bond.currency)} />
                  <FactRow label="Currency" value={bond.currency} />
                </div>
              </div>

              {/* Issuer Snapshot */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Issuer Snapshot</h4>
                <div>
                  <FactRow
                    label="Issuer"
                    value={bond.issuer}
                    isLink
                    to={`/issuers/${encodeURIComponent(bond.issuer)}`}
                  />
                  <FactRow label="Country" value={bond.country} />
                  <FactRow label="Sector" value={bond.sector} />
                  <FactRow label="Issuer Type" value={bond.issuerType} />
                  {bond.moodysRating && <FactRow label="Credit Rating Moodys" value={bond.moodysRating} />}
                  {bond.spRating && <FactRow label="Credit Rating S&P" value={bond.spRating} />}
                  {bond.fitchRating && <FactRow label="Credit Rating Fitch" value={bond.fitchRating} />}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
