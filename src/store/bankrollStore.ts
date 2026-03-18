import { create } from 'zustand';
import { bankrollApi, Bankroll, BankrollMovement } from '../api/bankroll';
import { registerLogoutAction } from './authStore';

interface BankrollState {
  bankroll: Bankroll | null;
  movements: BankrollMovement[];
  totalMovements: number;
  loading: boolean;
  error: string | null;
  
  fetchBankroll: () => Promise<void>;
  createBankroll: (amount: number) => Promise<boolean>;
  updateBankroll: (amount: number) => Promise<boolean>;
  deposit: (amount: number, description?: string) => Promise<boolean>;
  withdraw: (amount: number, description?: string) => Promise<boolean>;
  fetchMovements: (page?: number) => Promise<void>;
  clearBankroll: () => void;
}

registerLogoutAction(() => useBankrollStore.getState().clearBankroll());

export const useBankrollStore = create<BankrollState>((set, get) => ({
  bankroll: null,
  movements: [],
  totalMovements: 0,
  loading: false,
  error: null,

  fetchBankroll: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await bankrollApi.getBankroll();
      set({ bankroll: data.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener bankroll',
        loading: false 
      });
    }
  },

  createBankroll: async (amount: number) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bankrollApi.createBankroll(amount);
      set({ bankroll: data.data, loading: false });
      await get().fetchMovements();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al crear bankroll',
        loading: false 
      });
      return false;
    }
  },

  updateBankroll: async (amount: number) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bankrollApi.updateBankroll(amount);
      set({ bankroll: data.data, loading: false });
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al actualizar bankroll',
        loading: false 
      });
      return false;
    }
  },

  deposit: async (amount: number, description?: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bankrollApi.deposit(amount, description);
      set({ bankroll: data.data, loading: false });
      await get().fetchMovements();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al realizar depósito',
        loading: false 
      });
      return false;
    }
  },

  withdraw: async (amount: number, description?: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bankrollApi.withdraw(amount, description);
      set({ bankroll: data.data, loading: false });
      await get().fetchMovements();
      return true;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al realizar retiro',
        loading: false 
      });
      return false;
    }
  },

  fetchMovements: async (page = 1) => {
    try {
      const { data } = await bankrollApi.getMovements(page);
      set({ 
        movements: data.data, 
        totalMovements: data.total 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener movimientos',
      });
    }
  },

  clearBankroll: () => {
    set({ 
      bankroll: null, 
      movements: [], 
      totalMovements: 0, 
      loading: false, 
      error: null 
    });
  },
}));
