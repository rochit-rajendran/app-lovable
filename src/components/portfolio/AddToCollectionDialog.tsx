import { useState } from 'react';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { Bond } from '@/types/bond';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Bookmark, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bond: Bond;
  defaultTab?: 'watchlist' | 'portfolio';
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  bond,
  defaultTab = 'watchlist',
}: AddToCollectionDialogProps) {
  const { toast } = useToast();
  const {
    watchlists,
    portfolios,
    addBondToWatchlist,
    addBondToPortfolio,
    createWatchlist,
    createPortfolio,
  } = usePortfolioContext();

  const [tab, setTab] = useState(defaultTab);
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  const handleSave = () => {
    let count = 0;
    if (tab === 'watchlist') {
      selectedWatchlists.forEach((wlId) => {
        addBondToWatchlist(wlId, bond.id);
        count++;
      });
      if (showNewInput && newName.trim()) {
        const wl = createWatchlist(newName.trim());
        addBondToWatchlist(wl.id, bond.id);
        count++;
      }
      toast({ title: `Added to ${count} watchlist(s)` });
    } else {
      selectedPortfolios.forEach((pfId) => {
        addBondToPortfolio(pfId, bond.id);
        count++;
      });
      if (showNewInput && newName.trim()) {
        const pf = createPortfolio(newName.trim(), 'Research');
        addBondToPortfolio(pf.id, bond.id);
        count++;
      }
      toast({ title: `Added to ${count} portfolio(s)` });
    }

    // Reset
    setSelectedWatchlists([]);
    setSelectedPortfolios([]);
    setNewName('');
    setShowNewInput(false);
    onOpenChange(false);
  };

  const toggleWl = (id: string) =>
    setSelectedWatchlists((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const togglePf = (id: string) =>
    setSelectedPortfolios((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const hasSelection =
    tab === 'watchlist'
      ? selectedWatchlists.length > 0 || (showNewInput && newName.trim().length > 0)
      : selectedPortfolios.length > 0 || (showNewInput && newName.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add "{bond.name}"</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as 'watchlist' | 'portfolio'); setShowNewInput(false); setNewName(''); }}>
          <TabsList className="w-full">
            <TabsTrigger value="watchlist" className="flex-1 gap-2">
              <Bookmark className="h-4 w-4" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1 gap-2">
              <Briefcase className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist" className="space-y-3 mt-4">
            {watchlists.length === 0 && !showNewInput ? (
              <p className="text-sm text-muted-foreground text-center py-4">No watchlists yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-auto">
                {watchlists.map((wl) => {
                  const alreadyIn = wl.bondIds.includes(bond.id);
                  return (
                    <div key={wl.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                      <Checkbox
                        id={`wl-${wl.id}`}
                        checked={alreadyIn || selectedWatchlists.includes(wl.id)}
                        disabled={alreadyIn}
                        onCheckedChange={() => toggleWl(wl.id)}
                      />
                      <Label htmlFor={`wl-${wl.id}`} className="flex-1 cursor-pointer text-sm">
                        {wl.name}
                        {alreadyIn && <span className="text-muted-foreground ml-2 text-xs">(already added)</span>}
                      </Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{wl.bondIds.length}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {showNewInput ? (
              <Input
                placeholder="New watchlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            ) : (
              <Button variant="ghost" size="sm" className="gap-2 w-full" onClick={() => setShowNewInput(true)}>
                <Plus className="h-4 w-4" />
                Create new watchlist
              </Button>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-3 mt-4">
            {portfolios.length === 0 && !showNewInput ? (
              <p className="text-sm text-muted-foreground text-center py-4">No portfolios yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-auto">
                {portfolios.map((pf) => {
                  const alreadyIn = pf.holdings.some((h) => h.bondId === bond.id);
                  return (
                    <div key={pf.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                      <Checkbox
                        id={`pf-${pf.id}`}
                        checked={alreadyIn || selectedPortfolios.includes(pf.id)}
                        disabled={alreadyIn}
                        onCheckedChange={() => togglePf(pf.id)}
                      />
                      <Label htmlFor={`pf-${pf.id}`} className="flex-1 cursor-pointer text-sm">
                        {pf.name}
                        {alreadyIn && <span className="text-muted-foreground ml-2 text-xs">(already added)</span>}
                      </Label>
                      <span className="text-xs text-muted-foreground tabular-nums">{pf.holdings.length}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {showNewInput ? (
              <Input
                placeholder="New portfolio name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            ) : (
              <Button variant="ghost" size="sm" className="gap-2 w-full" onClick={() => setShowNewInput(true)}>
                <Plus className="h-4 w-4" />
                Create new portfolio
              </Button>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!hasSelection}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
