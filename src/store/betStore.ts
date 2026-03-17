import { create } from 'zustand';
import {
  getBets,
  getBet,
  createBet,
  resolveBet,
  deleteBet,
  getPendingBets,
  getBetStats,
  Bet,
  BetFilters,
  CreateBetDto,
  ResolveBetDto,
  BetStats,
} from '../api/bets';

interface BetState {
  bets: Bet[];
  currentBet: Bet | null;
  pendingBets: Bet[];
  stats: BetStats | null;
  filters: BetFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  loading: boolean;
  error: string | null;

  fetchBets: (page?: number, filters?: BetFilters) => Promise<void>;
  fetchBet: (id: string) => Promise<void>;
  createBet: (dto: CreateBetDto) => Promise<boolean>;
  resolveBet: (id: string, dto: ResolveBetDto) => Promise<boolean>;
  removeBet: (id: string) => Promise<boolean>;
  fetchPendingBets: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: BetFilters) => void;
  clearError: () => void;
}

export const useBetStore = create<BetState>((set, get) => ({
  bets: [],
  currentBet: null,
  pendingBets: [],
  stats: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  loading: false,
  error: null,

  fetchBets: async (page = 1, filters?: BetFilters) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const response = await getBets(page, 20, currentFilters);
      set({
        bets: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al obtener apuestas',
        loading: false,
      });
    }
  },

  fetchBet: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const bet = await getBet(id);
      set({ currentBet: bet, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al obtener apuesta',
        loading: false,
      });
    }
  },

  createBet: async (dto: CreateBetDto) => {
    set({ loading: true, error: null });
    try {
      await createBet(dto);
      await get().fetchBets(1);
      await get().fetchStats();
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear apuesta',
        loading: false,
      });
      return false;
    }
  },

  resolveBet: async (id: string, dto: ResolveBetDto) => {
    set({ loading: true, error: null });
    try {
      await resolveBet(id, dto);
      await get().fetchBets(get().pagination.page);
      await get().fetchStats();
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al resolver apuesta',
        loading: false,
      });
      return false;
    }
  },

  removeBet: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteBet(id);
      await get().fetchBets(get().pagination.page);
      await get().fetchStats();
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar apuesta',
        loading: false,
      });
      return false;
    }
  },

  fetchPendingBets: async () => {
    try {
      const pendingBets = await getPendingBets();
      set({ pendingBets });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al obtener apuestas pendientes',
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await getBetStats();
      set({ stats });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al obtener estadísticas',
      });
    }
  },

  setFilters: (filters: BetFilters) => {
    set({ filters });
    get().fetchBets(1, filters);
  },

  clearError: () => set({ error: null }),
}));
