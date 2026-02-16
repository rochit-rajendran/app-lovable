import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { sectors, countries, currencies, creditRatings, issuerTypes } from '@/data/mockBonds';
import { BondFilter } from '@/types/bond';

interface BondFiltersProps {
  filters: BondFilter;
  onFiltersChange: (filters: BondFilter) => void;
}

function FilterSection({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-foreground/80 hover:bg-sidebar-accent/50 rounded-md transition-colors px-1 -mx-1">
          {title}
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/70 transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function BondFilters({ filters, onFiltersChange }: BondFiltersProps) {
  const [yieldRange, setYieldRange] = useState([0, 10]);

  const toggleFilter = (key: keyof BondFilter, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v =>
    Array.isArray(v) ? v.length > 0 : v !== undefined
  );

  return (
    <div className="w-72 border-r border-sidebar-border bg-sidebar p-4 overflow-auto text-sidebar-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-sidebar-foreground/70" />
          <span className="font-semibold text-sm text-sidebar-foreground">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-1 divide-y divide-sidebar-border">
        {/* Sustainability Filters */}
        <div className="pb-4">
          <p className="text-xs font-medium text-sidebar-muted uppercase tracking-wider mb-3">
            Sustainability
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="green" className="text-sm font-normal cursor-pointer text-sidebar-foreground">
                Green Bonds Only
              </Label>
              <Switch
                id="green"
                checked={filters.greenOnly}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, greenOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sustainable" className="text-sm font-normal cursor-pointer text-sidebar-foreground">
                Sustainable Bonds
              </Label>
              <Switch
                id="sustainable"
                checked={filters.sustainableOnly}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, sustainableOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="climate" className="text-sm font-normal cursor-pointer text-sidebar-foreground">
                Climate Aligned
              </Label>
              <Switch
                id="climate"
                checked={filters.climateAligned}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, climateAligned: checked })}
              />
            </div>
          </div>
        </div>

        {/* Issuer Type */}
        <FilterSection title="Issuer Type">
          <div className="space-y-2">
            {issuerTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`issuer-${type}`}
                  checked={filters.issuerTypes?.includes(type)}
                  onCheckedChange={() => toggleFilter('issuerTypes', type)}
                  className="border-sidebar-foreground/20 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary"
                />
                <Label
                  htmlFor={`issuer-${type}`}
                  className="text-sm font-normal cursor-pointer text-sidebar-foreground"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Credit Rating */}
        <FilterSection title="Credit Rating">
          <div className="grid grid-cols-2 gap-2">
            {creditRatings.map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.creditRatings?.includes(rating)}
                  onCheckedChange={() => toggleFilter('creditRatings', rating)}
                  className="border-sidebar-foreground/20 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary"
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer text-sidebar-foreground"
                >
                  {rating}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Yield Range */}
        <FilterSection title="Yield Range">
          <div className="px-1">
            <Slider
              value={yieldRange}
              onValueChange={setYieldRange}
              min={0}
              max={10}
              step={0.25}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-xs text-sidebar-muted tabular-nums">
              <span>{yieldRange[0].toFixed(2)}%</span>
              <span>{yieldRange[1].toFixed(2)}%</span>
            </div>
          </div>
        </FilterSection>

        {/* Sector */}
        <FilterSection title="Sector" defaultOpen={false}>
          <div className="space-y-2 max-h-40 overflow-auto">
            {sectors.map((sector) => (
              <div key={sector} className="flex items-center gap-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={filters.sectors?.includes(sector)}
                  onCheckedChange={() => toggleFilter('sectors', sector)}
                  className="border-sidebar-foreground/20 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary"
                />
                <Label
                  htmlFor={`sector-${sector}`}
                  className="text-sm font-normal cursor-pointer text-sidebar-foreground"
                >
                  {sector}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Currency */}
        <FilterSection title="Currency" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            {currencies.map((currency) => (
              <div key={currency} className="flex items-center gap-2">
                <Checkbox
                  id={`currency-${currency}`}
                  checked={filters.currencies?.includes(currency)}
                  onCheckedChange={() => toggleFilter('currencies', currency)}
                  className="border-sidebar-foreground/20 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary"
                />
                <Label
                  htmlFor={`currency-${currency}`}
                  className="text-sm font-normal cursor-pointer text-sidebar-foreground"
                >
                  {currency}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Country */}
        <FilterSection title="Country" defaultOpen={false}>
          <div className="space-y-2 max-h-40 overflow-auto">
            {countries.map((country) => (
              <div key={country} className="flex items-center gap-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.countries?.includes(country)}
                  onCheckedChange={() => toggleFilter('countries', country)}
                  className="border-sidebar-foreground/20 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary"
                />
                <Label
                  htmlFor={`country-${country}`}
                  className="text-sm font-normal cursor-pointer text-sidebar-foreground"
                >
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}