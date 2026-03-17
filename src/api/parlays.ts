import api from './axios'

export interface Parlay {
  id: string;
  userId: string;
  betIds: string[];
  combinedOdds: number;
  amount: number;
  potentialWin: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'VOID';
  profit: number;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ParlayWithBets {
  parlay: Parlay;
  bets: Array<{
    id: string;
    sport: string;
    selection: string;
    odds: number;
    status: string;
    amount: number;
  }>;
}

export interface PendingBet {
  id: string;
  sport: string;
  selection: string;
  odds: number;
  amount: number;
  tournament: string;
  status: string;
}

export const getParlays = () =>
  api.get<Parlay[]>('/parlays')

export const getParlay = (id: string) =>
  api.get<ParlayWithBets>(`/parlays/${id}`)

export const getPendingBets = () =>
  api.get<PendingBet[]>('/parlays/pending')

export const createParlay = (betIds: string[], amount: number) =>
  api.post<Parlay>('/parlays', { betIds, amount })

export const resolveParlay = (id: string, status: string) =>
  api.patch<Parlay>(`/parlays/${id}/resolve`, { status })

export const deleteParlay = (id: string) =>
  api.delete(`/parlays/${id}`)
