import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Banknote, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CurrencyPreferences as CurrencyPrefsType, Currency } from '@/types/settings';

interface CurrencyPreferencesSectionProps {
  currency: CurrencyPrefsType;
  onUpdate: (currency: CurrencyPrefsType) => void;
}

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { value: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
  { value: 'DKK', label: 'Danish Krone', symbol: 'kr' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
];

const fxPreview: Record<Currency, string> = {
  EUR: '€1,000,000',
  USD: '$1,120,000',
  SEK: 'SEK 11,200,000',
  GBP: '£860,000',
  CHF: 'CHF 960,000',
  NOK: 'NOK 11,800,000',
  DKK: 'DKK 7,450,000',
  JPY: '¥168,000,000',
};

export function CurrencyPreferencesSection({ currency, onUpdate }: CurrencyPreferencesSectionProps) {
  const [selected, setSelected] = useState<Currency>(currency.defaultCurrency);
  const isDirty = selected !== currency.defaultCurrency;

  const handleSave = () => {
    onUpdate({ ...currency, defaultCurrency: selected });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Banknote className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Currency Preferences</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Default display currency for allocations, impact metrics, and exports
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency selector */}
        <div className="space-y-2 max-w-sm">
          <Label htmlFor="currency-select">Default Display Currency</Label>
          <Select value={selected} onValueChange={(v) => setSelected(v as Currency)}>
            <SelectTrigger id="currency-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs w-8">{c.value}</span>
                    <span>{c.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Applied across allocation amounts, impact normalization, portfolio aggregates, comparison views, and all exports.
          </p>
        </div>

        {/* FX Preview */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 max-w-md">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Conversion Preview</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="tabular-nums font-medium text-foreground">€1,000,000</span>
            <span className="text-muted-foreground">→</span>
            <span className="tabular-nums font-medium text-foreground">{fxPreview[selected]}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Indicative rate for illustration only
          </p>
        </div>

        <div className="border-t border-border" />

        {/* FX Handling (read-only) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">FX Handling</p>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Exchange rates are sourced daily and applied automatically. These settings are managed centrally and cannot be changed per tenant.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Source</p>
              <p className="text-sm font-medium text-foreground">{currency.fxSource}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Reference Date</p>
              <p className="text-sm font-medium text-foreground">{currency.fxReferenceDate}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            Converted values are indicative and based on standard FX rates
          </Badge>
        </div>

        {isDirty && (
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="ghost" onClick={() => setSelected(currency.defaultCurrency)}>
              Discard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
