import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, XCircle, Layers, Info } from 'lucide-react';
import { PlatformCapability } from '@/types/settings';

interface EnabledCapabilitiesSectionProps {
  capabilities: PlatformCapability[];
}

export function EnabledCapabilitiesSection({ capabilities }: EnabledCapabilitiesSectionProps) {
  const enabledCount = capabilities.filter((c) => c.enabled).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-info" />
          </div>
          <div>
            <CardTitle className="text-lg">Platform Capabilities</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Features available under your current subscription · {enabledCount} of {capabilities.length} enabled
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                cap.enabled
                  ? 'border-border bg-card'
                  : 'border-border/50 bg-muted/30'
              }`}
            >
              {cap.enabled ? (
                <CheckCircle2 className="h-4 w-4 text-positive mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${cap.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {cap.name}
                  </p>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground/50" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {cap.description}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge
                  variant={cap.enabled ? 'secondary' : 'outline'}
                  className="text-[10px] mt-1"
                >
                  {cap.enabled ? 'Enabled' : 'Not enabled'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          Capabilities are managed by your subscription plan. Contact your account manager for changes.
        </p>
      </CardContent>
    </Card>
  );
}
