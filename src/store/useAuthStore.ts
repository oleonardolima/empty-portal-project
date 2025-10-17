import { create } from 'zustand';
import { AuthState } from '../types';

interface AuthStore extends AuthState {
  setAuthenticated: (pubkey: string, profile?: AuthState['profile']) => void;
  setTableNumber: (tableNumber: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  pubkey: undefined,
  profile: undefined,
  tableNumber: undefined,

  setAuthenticated: (pubkey, profile) => set({
    isAuthenticated: true,
    pubkey,
    profile,
  }),

  setTableNumber: (tableNumber) => set({ tableNumber }),

  logout: () => set({
    isAuthenticated: false,
    pubkey: undefined,
    profile: undefined,
    tableNumber: undefined,
  }),
}));