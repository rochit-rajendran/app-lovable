import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TenantBrandingSection } from '@/components/settings/TenantBrandingSection';
import { CurrencyPreferencesSection } from '@/components/settings/CurrencyPreferencesSection';
import { EnabledCapabilitiesSection } from '@/components/settings/EnabledCapabilitiesSection';
import { DataDefaultsSection } from '@/components/settings/DataDefaultsSection';
import { UserPreferencesSection } from '@/components/settings/UserPreferencesSection';
import { mockSettings } from '@/data/mockSettings';
import { TenantSettings } from '@/types/settings';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<TenantSettings>(mockSettings);
  const { toast } = useToast();

  const handleBrandingUpdate = (branding: TenantSettings['branding']) => {
    setSettings((prev) => ({ ...prev, branding }));
    toast({ title: 'Branding updated', description: 'Organization branding has been saved.' });
  };

  const handleCurrencyUpdate = (currency: TenantSettings['currency']) => {
    setSettings((prev) => ({ ...prev, currency }));
    toast({ title: 'Currency preference updated', description: `Default currency set to ${currency.defaultCurrency}.` });
  };

  const handleDataDefaultsUpdate = (dataDefaults: TenantSettings['dataDefaults']) => {
    setSettings((prev) => ({ ...prev, dataDefaults }));
    toast({ title: 'Data defaults updated', description: 'Interpretation defaults have been saved.' });
  };

  // User preferences are now managed globally via UserPreferencesContext

  return (
    <AppLayout>
      <div className="p-6 space-y-8 max-w-4xl">
        {/* Page header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-9">
            Organization-wide preferences and branding for {settings.branding.organizationName}
          </p>
        </div>

        {/* Section: Organization & Branding */}
        <TenantBrandingSection
          branding={settings.branding}
          onUpdate={handleBrandingUpdate}
        />

        {/* Section: Currency */}
        <CurrencyPreferencesSection
          currency={settings.currency}
          onUpdate={handleCurrencyUpdate}
        />

        {/* Section: Capabilities */}
        <EnabledCapabilitiesSection capabilities={settings.capabilities} />

        {/* Section: Data Defaults */}
        <DataDefaultsSection
          defaults={settings.dataDefaults}
          onUpdate={handleDataDefaultsUpdate}
        />

        {/* Separator between org and personal */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground tracking-wider">
              Personal Settings
            </span>
          </div>
        </div>

        {/* Section: User Preferences */}
        <UserPreferencesSection />
      </div>
    </AppLayout>
  );
}
