import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, RefreshCw } from 'lucide-react';
import { mockBonds } from '@/data/mockBonds';

export function GlobalOrientation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/bonds?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/bonds');
    }
  };

  // Simulate data freshness — use the most recent issue date from mock data
  const latestDate = mockBonds
    .map(b => new Date(b.issueDate))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  
  const weekStart = new Date(latestDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const formattedWeek = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Welcome & Freshness */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Welcome back, John
          </h1>
          <p className="text-muted-foreground mt-1">
            Your sustainable bond intelligence briefing
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border shrink-0">
          <RefreshCw className="h-3 w-3" />
          <span>Data updated: Week of {formattedWeek}</span>
        </div>
      </div>

      {/* Search & CTA */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonds, issuers, ISINs…"
            className="pl-10 h-11 bg-card border-border"
          />
        </form>
        <Button onClick={() => navigate('/bonds')} className="gap-2 h-11 shrink-0">
          Explore Bonds
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
