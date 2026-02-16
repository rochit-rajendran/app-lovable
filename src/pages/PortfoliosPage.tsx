import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePortfolioContext } from '@/contexts/PortfolioContext';
import { mockBonds } from '@/data/mockBonds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, MoreHorizontal, Eye, Trash2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PortfolioType } from '@/types/portfolio';
import { cn } from '@/lib/utils';

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

const typeStyles: Record<PortfolioType, string> = {
  Live: 'bg-positive/10 text-positive',
  Model: 'bg-info/10 text-info',
  Research: 'bg-warning/10 text-warning',
};

export default function PortfoliosPage() {
  const navigate = useNavigate();
  const { portfolios, createPortfolio, deletePortfolio } = usePortfolioContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<PortfolioType>('Research');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPortfolio(newName.trim(), newType, newDesc.trim() || undefined);
    setNewName('');
    setNewDesc('');
    setNewType('Research');
    setCreateOpen(false);
  };

  const handleDelete = () => {
    if (!targetId) return;
    deletePortfolio(targetId);
    setTargetId(null);
    setDeleteOpen(false);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolios</h1>
            <p className="text-muted-foreground text-sm">Structured bond collections for strategies and mandates</p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setNewName('');
              setNewDesc('');
              setNewType('Research');
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Portfolio
          </Button>
        </div>

        {/* Portfolios table */}
        {portfolios.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No portfolios yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create a portfolio to organize bonds into strategies, mandates, or research collections.
              </p>
              <Button className="mt-4 gap-2" onClick={() => { setNewName(''); setCreateOpen(true); }}>
                <Plus className="h-4 w-4" />
                Create your first portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="min-w-[240px]">Portfolio</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead className="text-right w-28">Holdings</TableHead>
                  <TableHead className="w-36">Last Updated</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((pf) => (
                  <TableRow
                    key={pf.id}
                    className="data-row cursor-pointer"
                    onClick={() => navigate(`/portfolios/${pf.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{pf.name}</p>
                        {pf.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-sm">{pf.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', typeStyles[pf.type])}>
                        {pf.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {pf.holdings.length}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeDate(pf.updatedAt)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/portfolios/${pf.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setTargetId(pf.id);
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
              <DialogTitle>Create Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pf-name">Name</Label>
                <Input
                  id="pf-name"
                  placeholder="Portfolio name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-type">Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as PortfolioType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Model">Model</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-desc">Description (optional)</Label>
                <Input
                  id="pf-desc"
                  placeholder="Strategy note or description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Portfolio</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this portfolio? This action cannot be undone.
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
