import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      balance: 0,
      addBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
          user: state.user
            ? { ...state.user, balance: (state.user.balance || 0) + amount }
            : null,
        })),
      deductBalance: (amount) =>
        set((state) => ({
          balance: Math.max(0, state.balance - amount),
          user: state.user
            ? {
                ...state.user,
                balance: Math.max(0, (state.user.balance || 0) - amount),
              }
            : null,
        })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, balance: state.balance }),
    }
  )
);
