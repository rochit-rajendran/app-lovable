import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { DataDefaults as DataDefaultsType } from '@/types/settings';

interface DataDefaultsSectionProps {
  defaults: DataDefaultsType;
  onUpdate: (defaults: DataDefaultsType) => void;
}

const normalizationOptions = [
  { value: 'per €1m financed', label: 'Per €1m financed' },
  { value: 'per $1m financed', label: 'Per $1m financed' },
  { value: 'per SEK 10m financed', label: 'Per SEK 10m financed' },
];

const reportingYearOptions = [
  { value: 'latest', label: 'Latest available' },
  { value: 'previous', label: 'Previous year' },
  { value: 'two_years', label: 'Two years prior' },
];

export function DataDefaultsSection({ defaults, onUpdate }: DataDefaultsSectionProps) {
  const [normBasis, setNormBasis] = useState(defaults.normalizationBasis);
  const [reportYear, setReportYear] = useState<string>(defaults.preferredReportingYear);
  const isDirty = normBasis !== defaults.normalizationBasis || reportYear !== defaults.preferredReportingYear;

  const handleSave = () => {
    onUpdate({ normalizationBasis: normBasis, preferredReportingYear: reportYear as DataDefaultsType['preferredReportingYear'] });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Data Interpretation Defaults</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Organization-wide defaults for how ESG data is normalized and displayed
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <div className="space-y-2">
            <Label>Impact Normalization Basis</Label>
            <Select value={normBasis} onValueChange={setNormBasis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {normalizationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default unit for impact efficiency metrics across dashboards and exports.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Preferred Reporting Year</Label>
            <Select value={reportYear} onValueChange={setReportYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportingYearOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When multiple reporting years are available, display this year by default.
            </p>
          </div>
        </div>

        {isDirty && (
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="ghost" onClick={() => { setNormBasis(defaults.normalizationBasis); setReportYear(defaults.preferredReportingYear); }}>
              Discard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
