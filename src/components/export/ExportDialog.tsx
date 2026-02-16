import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FileText, Table2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ExportFormat,
  ExportTarget,
  ExportConfig,
  ExportSectionToggle,
  PORTFOLIO_SECTIONS,
  COMPARISON_SECTIONS,
  ISSUER_SECTIONS,
} from '@/types/export';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ExportTarget;
  defaultTitle: string;
  defaultSubtitle?: string;
  onExport: (config: ExportConfig) => void;
}

const SECTION_DEFAULTS: Record<ExportTarget, ExportSectionToggle[]> = {
  portfolio: PORTFOLIO_SECTIONS,
  comparison: COMPARISON_SECTIONS,
  issuer: ISSUER_SECTIONS,
};

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'NOK', 'CHF', 'SEK'];

export function ExportDialog({
  open,
  onOpenChange,
  target,
  defaultTitle,
  defaultSubtitle,
  onExport,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle || '');
  const [currency, setCurrency] = useState('EUR');
  const [reportingDate, setReportingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [sections, setSections] = useState<ExportSectionToggle[]>(
    () => SECTION_DEFAULTS[target].map(s => ({ ...s }))
  );

  // Reset sections when target changes
  useMemo(() => {
    setSections(SECTION_DEFAULTS[target].map(s => ({ ...s })));
  }, [target]);

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleExport = () => {
    onExport({
      format,
      target,
      title,
      subtitle: subtitle || undefined,
      reportingDate,
      currency,
      sections,
    });
    onOpenChange(false);
  };

  const targetLabel = target === 'portfolio' ? 'Portfolio' : target === 'comparison' ? 'Comparison' : 'Issuer';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4.5 w-4.5 text-accent" />
            Export {targetLabel} Report
          </DialogTitle>
          <DialogDescription>
            Configure your ESG export. PDF for committee-ready reports, CSV for data analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Format
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <FormatCard
                icon={<FileText className="h-5 w-5" />}
                label="PDF Report"
                description="Print-ready, structured"
                selected={format === 'pdf'}
                onClick={() => setFormat('pdf')}
              />
              <FormatCard
                icon={<Table2 className="h-5 w-5" />}
                label="CSV Data"
                description="Excel, Python, R-ready"
                selected={format === 'csv'}
                onClick={() => setFormat('csv')}
              />
            </div>
          </div>

          <Separator />

          {/* Reporting Date & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="export-date" className="text-sm">
                Reporting Date
              </Label>
              <Input
                id="export-date"
                type="date"
                value={reportingDate}
                onChange={e => setReportingDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="export-currency" className="text-sm">
                Currency Basis
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="export-currency" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PDF-only options */}
          {format === 'pdf' && (
            <>
              <Separator />

              {/* Title / Subtitle */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="export-title" className="text-sm">
                    Report Title
                  </Label>
                  <Input
                    id="export-title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="h-9"
                    placeholder="Report title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="export-subtitle" className="text-sm">
                    Subtitle <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="export-subtitle"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    className="h-9"
                    placeholder="e.g. Q4 2025 Investment Committee"
                  />
                </div>
              </div>

              <Separator />

              {/* Section toggles */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sections
                </Label>
                <div className="space-y-2">
                  {sections.map(section => (
                    <label
                      key={section.id}
                      className="flex items-center gap-2.5 py-1 cursor-pointer"
                    >
                      <Checkbox
                        checked={section.enabled}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <span className="text-sm">{section.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-3.5 w-3.5" />
            {format === 'pdf' ? 'Generate PDF' : 'Download CSV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormatCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
        selected
          ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
          : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
      )}
    >
      <div className={cn('shrink-0', selected ? 'text-accent' : 'text-muted-foreground')}>
        {icon}
      </div>
      <div>
        <p className={cn('text-sm font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
