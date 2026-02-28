import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { sectors, countries, currencies, creditRatings, issuerTypes, labels, regions, subsectors } from '@/data/mockBonds';
import { BondFilter } from '@/types/bond';

interface BondFiltersProps {
  filters: BondFilter;
  onFiltersChange: (filters: BondFilter) => void;
  onClose?: () => void;
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
        <button className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors px-1 -mx-1">
          {title}
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function BondFilters({ filters, onFiltersChange, onClose }: BondFiltersProps) {
  const [couponRange, setCouponRange] = useState([0, 10]);

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
    <div className="w-72 border-r border-border bg-card p-4 overflow-auto text-card-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm text-foreground">Filters</span>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 divide-y divide-border">
        {/* Label Filters */}
        <FilterSection title="Label">
          <div className="space-y-2">
            {labels.map((label) => {
              let labelText = label;
              if (label === 'Green') labelText = 'Green bonds';
              else if (label === 'Social') labelText = 'Social bonds';
              else if (label === 'Sustainability') labelText = 'Sustainable bonds';
              else if (label === 'Sustainability-Linked') labelText = 'Linked-Bonds';

              return (
                <div key={label} className="flex items-center gap-2">
                  <Checkbox
                    id={`label-${label}`}
                    checked={filters.labels?.includes(label)}
                    onCheckedChange={() => toggleFilter('labels', label)}
                    className="h-4 w-4 rounded border-input text-primary shadow focus:ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor={`label-${label}`}
                    className="text-sm font-normal cursor-pointer text-foreground"
                  >
                    {labelText}
                  </Label>
                </div>
              );
            })}
          </div>
        </FilterSection>

        {/* Region */}
        <FilterSection title="Region" defaultOpen={false}>
          <div className="space-y-2 max-h-40 overflow-auto">
            {regions.map((region) => (
              <div key={region} className="flex items-center gap-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={filters.regions?.includes(region)}
                  onCheckedChange={() => toggleFilter('regions', region)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`region-${region}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Issuer Type */}
        <FilterSection title="Issuer Type">
          <div className="space-y-2">
            {issuerTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`issuer-${type}`}
                  checked={filters.issuerTypes?.includes(type)}
                  onCheckedChange={() => toggleFilter('issuerTypes', type)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`issuer-${type}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
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
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  {rating}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Coupon Range */}
        <FilterSection title="Coupon Range">
          <div className="px-1">
            <Slider
              value={couponRange}
              onValueChange={setCouponRange}
              min={0}
              max={10}
              step={0.25}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground tabular-nums">
              <span>{couponRange[0].toFixed(2)}%</span>
              <span>{couponRange[1].toFixed(2)}%</span>
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
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`sector-${sector}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  {sector}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Subsector */}
        <FilterSection title="Subsector" defaultOpen={false}>
          <div className="space-y-2 max-h-40 overflow-auto">
            {subsectors.map((sub) => (
              <div key={sub} className="flex items-center gap-2">
                <Checkbox
                  id={`subsector-${sub}`}
                  checked={filters.subsectors?.includes(sub)}
                  onCheckedChange={() => toggleFilter('subsectors', sub)}
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`subsector-${sub}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  {sub}
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
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`currency-${currency}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
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
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`country-${country}`}
                  className="text-sm font-normal cursor-pointer text-foreground"
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