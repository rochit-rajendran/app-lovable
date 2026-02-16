import { useState } from 'react';
import { ComparisonSubject, ComparisonType } from '@/types/comparison';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Download, X, Pencil, Check, Plus } from 'lucide-react';
import { formatComparisonAmount } from '@/lib/comparisonAggregation';
import { ExportDialog } from '@/components/export/ExportDialog';
import { ExportConfig } from '@/types/export';
import { exportComparisonCSV } from '@/lib/csvExport';

interface ComparisonHeaderProps {
  name: string;
  type: ComparisonType;
  subjects: ComparisonSubject[];
  isSaved: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onRemoveItem: (id: string) => void;
  onAddItem?: () => void;
}

const TYPE_LABELS: Record<ComparisonType, string> = {
  bond: 'Bond Comparison',
  portfolio: 'Portfolio Comparison',
  issuer: 'Issuer Comparison',
};

export function ComparisonHeader({
  name,
  type,
  subjects,
  isSaved,
  onNameChange,
  onSave,
  onRemoveItem,
  onAddItem,
}: ComparisonHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const [exportOpen, setExportOpen] = useState(false);

  const handleSaveName = () => {
    onNameChange(editValue);
    setEditing(false);
  };

  const handleExport = (config: ExportConfig) => {
    if (config.format === 'csv') {
      exportComparisonCSV(name, type, subjects, config.reportingDate);
    } else {
      const ids = subjects.map(s => s.id).join(',');
      const enabledSections = config.sections.filter(s => s.enabled).map(s => s.id);
      const params = new URLSearchParams({
        type,
        ids,
        title: config.title,
        date: config.reportingDate,
        sections: enabledSections.join(','),
      });
      if (config.subtitle) params.set('subtitle', config.subtitle);
      window.open(`/reports/comparison?${params.toString()}`, '_blank');
    }
  };

  return (
    <>
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {/* Top row: name + actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Badge variant="outline" className="text-xs font-medium flex-shrink-0">
                {TYPE_LABELS[type]}
              </Badge>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="h-8 text-base font-semibold max-w-xs"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveName}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-lg font-semibold text-foreground truncate">{name}</h1>
                  <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => { setEditValue(name); setEditing(true); }}>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={onSave}>
                <Save className="h-3.5 w-3.5" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setExportOpen(true)}>
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>

          {/* Subject chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{subject.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {subject.bondCount} bond{subject.bondCount !== 1 ? 's' : ''} · {formatComparisonAmount(subject.totalIssuance)}
                  </p>
                </div>
                {subjects.length > 2 && (
                  <button
                    onClick={() => onRemoveItem(subject.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            {subjects.length < 5 && onAddItem && (
              <Button variant="outline" size="sm" className="gap-1.5 h-auto py-2" onClick={onAddItem}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        target="comparison"
        defaultTitle={name}
        defaultSubtitle={`${TYPE_LABELS[type]} · ${subjects.length} items`}
        onExport={handleExport}
      />
    </>
  );
}
