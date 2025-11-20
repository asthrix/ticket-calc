import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TicketStore {
  recentPnrs: string[];
  addRecentPnr: (pnr: string) => void;
  clearRecentPnrs: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      recentPnrs: [],
      addRecentPnr: (pnr) =>
        set((state) => {
          const newPnrs = [pnr, ...state.recentPnrs.filter((p) => p !== pnr)].slice(0, 5);
          return { recentPnrs: newPnrs };
        }),
      clearRecentPnrs: () => set({ recentPnrs: [] }),
    }),
    {
      name: 'irctc-ticket-storage',
    }
  )
);
