import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WatchlistsPage() {
  const navigate = useNavigate();
  const { watchlists, createWatchlist, renameWatchlist, deleteWatchlist } = usePortfolioContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createWatchlist(newName.trim());
    setNewName('');
    setCreateOpen(false);
  };

  const handleRename = () => {
    if (!targetId || !newName.trim()) return;
    renameWatchlist(targetId, newName.trim());
    setNewName('');
    setTargetId(null);
    setRenameOpen(false);
  };

  const handleDelete = () => {
    if (!targetId) return;
    deleteWatchlist(targetId);
    setTargetId(null);
    setDeleteOpen(false);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Watchlists</h1>
            <p className="text-muted-foreground text-sm">Shortlist and monitor bonds for research</p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setNewName('');
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Watchlist
          </Button>
        </div>

        {/* Watchlists table */}
        {watchlists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No watchlists yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create a watchlist to start saving bonds from Discovery for research and monitoring.
              </p>
              <Button className="mt-4 gap-2" onClick={() => { setNewName(''); setCreateOpen(true); }}>
                <Plus className="h-4 w-4" />
                Create your first watchlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="min-w-[240px]">Name</TableHead>
                  <TableHead className="text-right w-28">Bonds</TableHead>
                  <TableHead className="w-36">Last Updated</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlists.map((wl) => (
                  <TableRow
                    key={wl.id}
                    className="data-row cursor-pointer"
                    onClick={() => navigate(`/watchlists/${wl.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{wl.name}</p>
                        {wl.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{wl.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {wl.bondIds.length}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeDate(wl.updatedAt)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/watchlists/${wl.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setTargetId(wl.id);
                            setNewName(wl.name);
                            setRenameOpen(true);
                          }}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setTargetId(wl.id);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Create dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Watchlist</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Watchlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename dialog */}
        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Watchlist</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Watchlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
              <Button onClick={handleRename} disabled={!newName.trim()}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Watchlist</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this watchlist? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
