import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';
import { LandingPage, TableDensity, ThemePreference } from '@/types/settings';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const landingPages: { value: LandingPage; label: string }[] = [
  { value: '/', label: 'Dashboard' },
  { value: '/bonds', label: 'Bond Discovery' },
  { value: '/portfolios', label: 'Portfolios' },
  { value: '/watchlists', label: 'Watchlists' },
  { value: '/comparisons', label: 'Comparisons' },
];

const densityOptions: { value: TableDensity; label: string; desc: string }[] = [
  { value: 'comfortable', label: 'Comfortable', desc: 'More whitespace, easier scanning' },
  { value: 'compact', label: 'Compact', desc: 'More rows visible at once' },
];

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function UserPreferencesSection() {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Personal Preferences</CardTitle>
              <Badge variant="outline" className="text-[10px]">Per-user</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              These settings apply only to your account, not the organization
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          <div className="space-y-2">
            <Label>Default Landing Page</Label>
            <Select
              value={preferences.defaultLandingPage}
              onValueChange={(v) => updatePreferences({ defaultLandingPage: v as LandingPage })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {landingPages.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Table Density</Label>
            <Select
              value={preferences.tableDensity}
              onValueChange={(v) => updatePreferences({ tableDensity: v as TableDensity })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {densityOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    <span>{d.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {densityOptions.find((d) => d.value === preferences.tableDensity)?.desc}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(v) => updatePreferences({ theme: v as ThemePreference })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Changes are applied immediately and persisted to your browser.
        </p>
      </CardContent>
    </Card>
  );
}
