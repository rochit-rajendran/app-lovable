import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SavedComparison, ComparisonType } from '@/types/comparison';

const MOCK_COMPARISONS: SavedComparison[] = [
  {
    id: 'cmp-1',
    name: 'EIB vs EDF Green Strategy',
    type: 'issuer',
    itemIds: ['European Investment Bank', 'Électricité de France'],
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-02-05T14:00:00Z',
  },
  {
    id: 'cmp-2',
    name: 'Top Green Bonds Comparison',
    type: 'bond',
    itemIds: ['1', '4', '9'],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-06T11:30:00Z',
  },
];

interface ComparisonContextValue {
  comparisons: SavedComparison[];
  createComparison: (name: string, type: ComparisonType, itemIds: string[]) => SavedComparison;
  updateComparison: (id: string, updates: Partial<Pick<SavedComparison, 'name' | 'itemIds'>>) => void;
  deleteComparison: (id: string) => void;
  addItemToComparison: (comparisonId: string, itemId: string) => void;
  removeItemFromComparison: (comparisonId: string, itemId: string) => void;
}

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisons, setComparisons] = useState<SavedComparison[]>(MOCK_COMPARISONS);

  const createComparison = useCallback((name: string, type: ComparisonType, itemIds: string[]) => {
    const now = new Date().toISOString();
    const comp: SavedComparison = {
      id: `cmp-${Date.now()}`,
      name,
      type,
      itemIds,
      createdAt: now,
      updatedAt: now,
    };
    setComparisons(prev => [...prev, comp]);
    return comp;
  }, []);

  const updateComparison = useCallback((id: string, updates: Partial<Pick<SavedComparison, 'name' | 'itemIds'>>) => {
    setComparisons(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
    );
  }, []);

  const deleteComparison = useCallback((id: string) => {
    setComparisons(prev => prev.filter(c => c.id !== id));
  }, []);

  const addItemToComparison = useCallback((comparisonId: string, itemId: string) => {
    setComparisons(prev =>
      prev.map(c => {
        if (c.id !== comparisonId || c.itemIds.includes(itemId) || c.itemIds.length >= 5) return c;
        return { ...c, itemIds: [...c.itemIds, itemId], updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const removeItemFromComparison = useCallback((comparisonId: string, itemId: string) => {
    setComparisons(prev =>
      prev.map(c => {
        if (c.id !== comparisonId) return c;
        return { ...c, itemIds: c.itemIds.filter(id => id !== itemId), updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  return (
    <ComparisonContext.Provider
      value={{ comparisons, createComparison, updateComparison, deleteComparison, addItemToComparison, removeItemFromComparison }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparisonContext() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error('useComparisonContext must be used within ComparisonProvider');
  return ctx;
}
