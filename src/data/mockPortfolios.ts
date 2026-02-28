import { Watchlist, Portfolio } from '@/types/portfolio';

export const mockWatchlists: Watchlist[] = [//feature
  {
    id: 'wl-1',
    name: 'Green Bond Candidates',
    description: 'Shortlisted green bonds for Q2 allocation review',
    bondIds: ['1', '4', '6', '7', '9'],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-02-03T14:22:00Z',
  },
  {
    id: 'wl-2',
    name: 'High Yield Opportunities',
    description: 'Bonds with above-average YTM for income strategy',
    bondIds: ['4', '5', '7'],
    createdAt: '2026-01-18T11:30:00Z',
    updatedAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'wl-3',
    name: 'Short Duration Watch',
    bondIds: ['2', '5', '8'],
    createdAt: '2026-02-01T16:00:00Z',
    updatedAt: '2026-02-04T10:45:00Z',
  },
];

export const mockPortfolios: Portfolio[] = [
  {
    id: 'pf-1',
    name: 'ESG Growth Fund',
    description: 'Core ESG-focused fixed income strategy targeting climate-aligned issuers with investment-grade ratings.',
    type: 'Live',
    holdings: [
      { bondId: '1', weight: 20, addedAt: '2026-01-05T09:00:00Z' },
      { bondId: '3', weight: 15, addedAt: '2026-01-05T09:00:00Z' },
      { bondId: '4', weight: 18, addedAt: '2026-01-10T11:00:00Z' },
      { bondId: '6', weight: 12, addedAt: '2026-01-12T14:00:00Z' },
      { bondId: '7', weight: 10, addedAt: '2026-01-15T10:00:00Z' },
      { bondId: '9', weight: 15, addedAt: '2026-01-20T09:00:00Z' },
      { bondId: '10', weight: 10, addedAt: '2026-01-22T16:00:00Z' },
    ],
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-02-03T14:00:00Z',
  },
  {
    id: 'pf-2',
    name: 'Short Duration Model',
    description: 'Model portfolio for low-duration mandate, max 5yr maturity.',
    type: 'Model',
    holdings: [
      { bondId: '2', weight: 35, addedAt: '2026-01-08T09:00:00Z' },
      { bondId: '5', weight: 35, addedAt: '2026-01-08T09:00:00Z' },
      { bondId: '8', weight: 30, addedAt: '2026-01-10T09:00:00Z' },
    ],
    createdAt: '2026-01-08T09:00:00Z',
    updatedAt: '2026-02-02T11:30:00Z',
  },
  {
    id: 'pf-3',
    name: 'Climate Transition Research',
    description: 'Exploratory set of climate-transition bonds under review for the sustainability mandate.',
    type: 'Research',
    holdings: [
      { bondId: '1', addedAt: '2026-01-25T09:00:00Z' },
      { bondId: '4', addedAt: '2026-01-25T09:00:00Z' },
      { bondId: '9', addedAt: '2026-01-28T10:00:00Z' },
    ],
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-02-04T08:00:00Z',
  },
];
