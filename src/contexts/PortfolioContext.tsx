import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Watchlist, Portfolio, PortfolioHolding } from '@/types/portfolio';
import { mockWatchlists, mockPortfolios } from '@/data/mockPortfolios';

interface PortfolioContextValue {
  watchlists: Watchlist[];
  portfolios: Portfolio[];
  // Watchlist operations
  createWatchlist: (name: string, description?: string) => Watchlist;
  renameWatchlist: (id: string, name: string) => void;
  deleteWatchlist: (id: string) => void;
  addBondToWatchlist: (watchlistId: string, bondId: string) => void;
  removeBondFromWatchlist: (watchlistId: string, bondId: string) => void;
  // Portfolio operations
  createPortfolio: (name: string, type: Portfolio['type'], description?: string) => Portfolio;
  deletePortfolio: (id: string) => void;
  addBondToPortfolio: (portfolioId: string, bondId: string, weight?: number) => void;
  removeBondFromPortfolio: (portfolioId: string, bondId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(mockWatchlists);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios);

  const createWatchlist = useCallback((name: string, description?: string) => {
    const now = new Date().toISOString();
    const newWl: Watchlist = {
      id: `wl-${Date.now()}`,
      name,
      description,
      bondIds: [],
      createdAt: now,
      updatedAt: now,
    };
    setWatchlists(prev => [...prev, newWl]);
    return newWl;
  }, []);

  const renameWatchlist = useCallback((id: string, name: string) => {
    setWatchlists(prev =>
      prev.map(wl => wl.id === id ? { ...wl, name, updatedAt: new Date().toISOString() } : wl)
    );
  }, []);

  const deleteWatchlist = useCallback((id: string) => {
    setWatchlists(prev => prev.filter(wl => wl.id !== id));
  }, []);

  const addBondToWatchlist = useCallback((watchlistId: string, bondId: string) => {
    setWatchlists(prev =>
      prev.map(wl =>
        wl.id === watchlistId && !wl.bondIds.includes(bondId)
          ? { ...wl, bondIds: [...wl.bondIds, bondId], updatedAt: new Date().toISOString() }
          : wl
      )
    );
  }, []);

  const removeBondFromWatchlist = useCallback((watchlistId: string, bondId: string) => {
    setWatchlists(prev =>
      prev.map(wl =>
        wl.id === watchlistId
          ? { ...wl, bondIds: wl.bondIds.filter(id => id !== bondId), updatedAt: new Date().toISOString() }
          : wl
      )
    );
  }, []);

  const createPortfolio = useCallback((name: string, type: Portfolio['type'], description?: string) => {
    const now = new Date().toISOString();
    const newPf: Portfolio = {
      id: `pf-${Date.now()}`,
      name,
      description,
      type,
      holdings: [],
      createdAt: now,
      updatedAt: now,
    };
    setPortfolios(prev => [...prev, newPf]);
    return newPf;
  }, []);

  const deletePortfolio = useCallback((id: string) => {
    setPortfolios(prev => prev.filter(pf => pf.id !== id));
  }, []);

  const addBondToPortfolio = useCallback((portfolioId: string, bondId: string, weight?: number) => {
    setPortfolios(prev =>
      prev.map(pf => {
        if (pf.id !== portfolioId) return pf;
        if (pf.holdings.some(h => h.bondId === bondId)) return pf;
        const holding: PortfolioHolding = { bondId, weight, addedAt: new Date().toISOString() };
        return { ...pf, holdings: [...pf.holdings, holding], updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const removeBondFromPortfolio = useCallback((portfolioId: string, bondId: string) => {
    setPortfolios(prev =>
      prev.map(pf =>
        pf.id === portfolioId
          ? { ...pf, holdings: pf.holdings.filter(h => h.bondId !== bondId), updatedAt: new Date().toISOString() }
          : pf
      )
    );
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        watchlists,
        portfolios,
        createWatchlist,
        renameWatchlist,
        deleteWatchlist,
        addBondToWatchlist,
        removeBondFromWatchlist,
        createPortfolio,
        deletePortfolio,
        addBondToPortfolio,
        removeBondFromPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioContext must be used within PortfolioProvider');
  return ctx;
}
