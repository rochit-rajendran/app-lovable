export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  bondIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type PortfolioType = 'Model' | 'Live' | 'Research';

export interface PortfolioHolding {
  bondId: string;
  weight?: number; // percentage, optional
  addedAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  type: PortfolioType;
  holdings: PortfolioHolding[];
  createdAt: string;
  updatedAt: string;
}
