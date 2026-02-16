import { useNavigate } from 'react-router-dom';
import { mockBonds } from '@/data/mockBonds';
import { mockIssuers } from '@/data/mockIssuers';
import { mockFrameworks } from '@/data/mockFrameworks';
import { FileText, Building2, Layers, Clock } from 'lucide-react';

interface RecentItem {
  type: 'bond' | 'issuer' | 'framework';
  label: string;
  sublabel: string;
  url: string;
  timestamp: string;
}

// Simulate recent activity from mock data
const recentItems: RecentItem[] = [
  {
    type: 'bond',
    label: mockBonds[0].name,
    sublabel: mockBonds[0].issuer,
    url: `/bonds/${mockBonds[0].id}`,
    timestamp: '2 hours ago',
  },
  {
    type: 'framework',
    label: mockFrameworks[0]?.name || 'Green Bond Framework',
    sublabel: mockFrameworks[0]?.issuer || 'European Investment Bank',
    url: `/frameworks/${mockFrameworks[0]?.id || 'eib-gbf'}`,
    timestamp: '4 hours ago',
  },
  {
    type: 'issuer',
    label: mockIssuers[0]?.name || 'European Investment Bank',
    sublabel: mockIssuers[0]?.country || 'Luxembourg',
    url: `/issuers/${encodeURIComponent(mockIssuers[0]?.name || 'European Investment Bank')}`,
    timestamp: 'Yesterday',
  },
  {
    type: 'bond',
    label: mockBonds[3].name,
    sublabel: mockBonds[3].issuer,
    url: `/bonds/${mockBonds[3].id}`,
    timestamp: 'Yesterday',
  },
  {
    type: 'bond',
    label: mockBonds[8]?.name || mockBonds[2].name,
    sublabel: mockBonds[8]?.issuer || mockBonds[2].issuer,
    url: `/bonds/${mockBonds[8]?.id || mockBonds[2].id}`,
    timestamp: '2 days ago',
  },
];

const typeIcons = {
  bond: FileText,
  issuer: Building2,
  framework: Layers,
};

const typeLabels = {
  bond: 'Bond',
  issuer: 'Issuer',
  framework: 'Framework',
};

export function RecentActivity() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-foreground">Continue Where You Left Off</h2>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border/50">
        {recentItems.map((item, i) => {
          const Icon = typeIcons[item.type];
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group"
              onClick={() => navigate(item.url)}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground/70 px-2 py-0.5 rounded bg-muted/50">
                  {typeLabels[item.type]}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{item.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
