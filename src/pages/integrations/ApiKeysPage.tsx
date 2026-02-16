import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { mockApiKeys, mockApiScopes } from '@/data/mockIntegrations';
import { format } from 'date-fns';
import { Plus, Copy, AlertTriangle, ShieldAlert, Key, Check } from 'lucide-react';
import type { ApiKey } from '@/types/integrations';

function StatusBadge({ status }: { status: ApiKey['status'] }) {
  const styles: Record<string, string> = {
    active: 'bg-accent/10 text-accent border-accent/20',
    revoked: 'bg-destructive/10 text-destructive border-destructive/20',
    expired: 'bg-muted text-muted-foreground border-border',
  };
  return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [createdKeyValue, setCreatedKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Create form
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newScopes, setNewScopes] = useState<string[]>([]);
  const [newExpiration, setNewExpiration] = useState('never');

  const { toast } = useToast();

  const handleCreate = () => {
    if (!newName.trim()) return;
    const fakeKey = `bdb_${Math.random().toString(36).slice(2, 10)}_${Math.random().toString(36).slice(2, 18)}`;
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim() || null,
      createdBy: 'John Doe',
      createdDate: new Date().toISOString(),
      lastUsed: null,
      scopes: newScopes,
      status: 'active',
      expiresAt: newExpiration === 'never' ? null : new Date(Date.now() + parseInt(newExpiration) * 86400000).toISOString(),
    };
    setKeys([newKey, ...keys]);
    setCreatedKeyValue(fakeKey);
    setCreateOpen(false);
    setNewName('');
    setNewDescription('');
    setNewScopes([]);
    setNewExpiration('never');
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setKeys(keys.map(k => k.id === revokeTarget.id ? { ...k, status: 'revoked' as const } : k));
    setRevokeTarget(null);
    toast({ title: 'API key revoked', description: `"${revokeTarget.name}" has been revoked.` });
  };

  const handleCopy = () => {
    if (createdKeyValue) {
      navigator.clipboard.writeText(createdKeyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">API Keys</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage read-only API keys for external integrations.</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Create Key
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id} className="data-row">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground text-sm">{key.name}</p>
                      {key.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{key.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{key.createdBy}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {format(new Date(key.createdDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {key.lastUsed ? format(new Date(key.lastUsed), 'dd MMM yyyy HH:mm') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.slice(0, 3).map(s => (
                        <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>
                      ))}
                      {key.scopes.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{key.scopes.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={key.status} /></TableCell>
                  <TableCell className="text-right">
                    {key.status === 'active' && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setRevokeTarget(key)}>
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Create Key Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Generate a read-only API key for external tools.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="key-name">Key Name *</Label>
                <Input id="key-name" placeholder='e.g. "Power BI – ESG Dashboard"' value={newName} onChange={e => setNewName(e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="key-desc">Description</Label>
                <Input id="key-desc" placeholder="Purpose of this key (optional)" value={newDescription} onChange={e => setNewDescription(e.target.value)} maxLength={200} />
              </div>
              <div className="space-y-1.5">
                <Label>Expiration</Label>
                <Select value={newExpiration} onValueChange={setNewExpiration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Scopes (read-only)</Label>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Least privilege recommended
                  </p>
                </div>
                <div className="space-y-2">
                  {mockApiScopes.map((scope) => (
                    <div key={scope.id} className={`flex items-start gap-3 p-2 rounded-md ${!scope.entitled ? 'opacity-40' : ''}`}>
                      <Checkbox
                        id={scope.id}
                        disabled={!scope.entitled}
                        checked={newScopes.includes(scope.id)}
                        onCheckedChange={(checked) => {
                          setNewScopes(checked ? [...newScopes, scope.id] : newScopes.filter(s => s !== scope.id));
                        }}
                      />
                      <div>
                        <label htmlFor={scope.id} className="text-sm font-medium text-foreground cursor-pointer">{scope.id}</label>
                        <p className="text-xs text-muted-foreground">{scope.description}</p>
                        {!scope.entitled && <p className="text-[10px] text-warning mt-0.5">Not included in your plan</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim() || newScopes.length === 0}>Create Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Show-once key value dialog */}
        <Dialog open={!!createdKeyValue} onOpenChange={() => { setCreatedKeyValue(null); setCopied(false); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-accent" /> API Key Created
              </DialogTitle>
              <DialogDescription>
                Copy your API key now. You won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md border">
              <code className="flex-1 text-sm font-mono text-foreground break-all">{createdKeyValue}</code>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-start gap-2 p-3 bg-warning/5 border border-warning/20 rounded-md">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Store this key securely. It provides read-only access to your tenant's ESG data and cannot be retrieved after closing this dialog.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => { setCreatedKeyValue(null); setCopied(false); }}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoke confirmation */}
        <Dialog open={!!revokeTarget} onOpenChange={() => setRevokeTarget(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Revoke API Key</DialogTitle>
              <DialogDescription>
                This will immediately invalidate "{revokeTarget?.name}". Any integrations using this key will stop working.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRevoke}>Revoke Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
