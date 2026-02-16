import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Upload, X, Users, MapPin, Hash } from 'lucide-react';
import { TenantBranding as TenantBrandingType } from '@/types/settings';

interface TenantBrandingSectionProps {
  branding: TenantBrandingType;
  onUpdate: (branding: TenantBrandingType) => void;
}

export function TenantBrandingSection({ branding, onUpdate }: TenantBrandingSectionProps) {
  const [localName, setLocalName] = useState(branding.organizationName);
  const [logoPreview, setLogoPreview] = useState<string | null>(branding.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDirty = localName !== branding.organizationName || logoPreview !== branding.logoUrl;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    onUpdate({ ...branding, organizationName: localName.trim(), logoUrl: logoPreview });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Organization & Branding</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Identity and light customization for your tenant
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Context row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tenant ID</span>
            <Badge variant="secondary" className="font-mono text-xs">{branding.tenantId}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Region</span>
            <span className="text-foreground font-medium">{branding.region}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Users</span>
            <span className="text-foreground font-medium">{branding.userCount}</span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Organization name */}
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            id="org-name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Logo upload */}
        <div className="space-y-3">
          <Label>Organization Logo</Label>
          <p className="text-sm text-muted-foreground">
            Your logo will appear in the app header and on exported reports.
          </p>

          <div className="flex items-start gap-6">
            {/* Upload zone */}
            <div
              className="w-48 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors flex items-center justify-center cursor-pointer bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="max-h-16 max-w-40 object-contain" />
              ) : (
                <div className="text-center">
                  <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Upload logo</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,image/png"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Preview cards */}
            {logoPreview && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
                <div className="flex gap-3">
                  {/* Header preview */}
                  <div className="rounded-md border border-border bg-card p-3 w-48">
                    <div className="flex items-center gap-2">
                      <img src={logoPreview} alt="Header preview" className="h-6 object-contain" />
                      <span className="text-xs font-medium text-foreground truncate">{localName}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Navigation header</p>
                  </div>
                  {/* Report cover preview */}
                  <div className="rounded-md border border-border bg-card p-3 w-48">
                    <div className="flex flex-col items-center gap-1">
                      <img src={logoPreview} alt="Report preview" className="h-8 object-contain" />
                      <span className="text-[10px] font-medium text-foreground">{localName}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">PDF report cover</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleRemoveLogo}>
                  <X className="h-3 w-3 mr-1" />
                  Remove logo
                </Button>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Recommended: SVG or PNG, transparent background, max 200×80 px.
          </p>
        </div>

        {isDirty && (
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="ghost" onClick={() => { setLocalName(branding.organizationName); setLogoPreview(branding.logoUrl); }}>
              Discard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
