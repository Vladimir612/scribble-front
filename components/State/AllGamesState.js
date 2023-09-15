import { create } from "zustand";

const useAllGamesStore = create((set) => ({
  games: [],
  updateGames: (newGamesData) => set({ games: newGamesData }),
  resetGames: () => set({ games: [] }),
}));

export default useAllGamesStore;
