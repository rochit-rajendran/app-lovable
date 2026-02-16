import { mockBonds } from '@/data/mockBonds';
import { Leaf, TrendingUp, Layers } from 'lucide-react';

export function MarketContext() {
  const greenBonds = mockBonds.filter(b => b.isGreen);
  const sustainableBonds = mockBonds.filter(b => b.isSustainability);

  // Compute top UoP category
  const uopCounts: Record<string, number> = {};
  mockBonds.forEach(b => {
    b.useOfProceeds?.forEach(uop => {
      uopCounts[uop] = (uopCounts[uop] || 0) + 1;
    });
  });
  const topUoP = Object.entries(uopCounts).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      icon: Leaf,
      text: `${greenBonds.length} green bonds tracked across ${new Set(greenBonds.map(b => b.country)).size} countries`,
    },
    {
      icon: Layers,
      text: topUoP ? `Top use-of-proceeds category: ${topUoP[0]}` : 'Use-of-proceeds data available',
    },
    {
      icon: TrendingUp,
      text: `${Math.round((sustainableBonds.length / mockBonds.length) * 100)}% of tracked bonds carry sustainability labels`,
    },
  ];

  return (
    <section>
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Market Snapshot
      </h2>
      <div className="flex flex-col gap-2">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50"
          >
            <stat.icon className="h-3.5 w-3.5 text-accent shrink-0" />
            <p className="text-sm text-muted-foreground">{stat.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
