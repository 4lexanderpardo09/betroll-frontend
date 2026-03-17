import api from './axios'

export interface DashboardSummary {
  bankroll: { currentAmount: number; initialAmount: number } | null;
  stats: {
    totalBets: number;
    wonBets: number;
    lostBets: number;
    voidBets: number;
    pendingBets: number;
    winRate: number;
    totalProfit: number;
    totalStaked: number;
    roi: number;
  };
  streak: { current: number; type: 'WIN' | 'LOSS' | 'NONE' };
  stopLoss: { hit: boolean; openingBalance: number; currentBalance: number; dailyLoss: number };
  recentBets: Array<{
    id: string;
    sport: string;
    selection: string;
    odds: number;
    amount: number;
    status: string;
    profit: number;
    createdAt: string;
  }>;
}

export const getDashboardSummary = () =>
  api.get<DashboardSummary>('/analytics/summary')

export interface PnlData {
  date: string;
  profit: number;
  bets: number;
  winRate: number;
}

export const getPnl = (period: 'daily' | 'weekly' = 'daily') =>
  api.get<PnlData[]>('/analytics/pnl', { params: { period } })

export interface BySportData {
  sport: string;
  totalBets: number;
  won: number;
  lost: number;
  profit: number;
  roi: number;
  avgOdds: number;
}

export const getBySport = () =>
  api.get<BySportData[]>('/analytics/by-sport')

export interface ByTypeData {
  betType: string;
  totalBets: number;
  won: number;
  lost: number;
  profit: number;
  roi: number;
}

export const getByType = () =>
  api.get<ByTypeData[]>('/analytics/by-type')

export interface ByCategoryData {
  category: string;
  totalBets: number;
  won: number;
  profit: number;
  roi: number;
}

export const getByCategory = () =>
  api.get<ByCategoryData[]>('/analytics/by-category')

export interface BankrollHistoryData {
  date: string;
  opening: number;
  closing: number;
  profit: number;
}

export const getBankrollHistory = () =>
  api.get<BankrollHistoryData[]>('/analytics/bankroll-history')
