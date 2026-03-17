import api from './axios';

export interface Bankroll {
  id: string;
  userId: string;
  initialAmount: number;
  currentAmount: number;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankrollMovement {
  id: string;
  bankrollId: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'WIN' | 'LOSS' | 'VOID' | 'CASHOUT';
  amount: number;
  balanceAfter: number;
  description: string | null;
  betId: string | null;
  createdAt: string;
}

export interface PaginatedMovements {
  data: BankrollMovement[];
  total: number;
  page: number;
  limit: number;
}

export const bankrollApi = {
  getBankroll: () => api.get<{ data: Bankroll | null }>('/bankroll'),
  
  createBankroll: (initialAmount: number) => 
    api.post<{ data: Bankroll; message: string }>('/bankroll', { initialAmount }),
  
  updateBankroll: (initialAmount: number) =>
    api.patch<{ data: Bankroll; message: string }>('/bankroll', { initialAmount }),
  
  deposit: (amount: number, description?: string) =>
    api.patch<{ data: Bankroll; message: string }>('/bankroll/deposit', { amount, description }),
  
  withdraw: (amount: number, description?: string) =>
    api.patch<{ data: Bankroll; message: string }>('/bankroll/withdraw', { amount, description }),
  
  getMovements: (page = 1, limit = 20) =>
    api.get<PaginatedMovements>('/bankroll/movements', { params: { page, limit } }),
};
