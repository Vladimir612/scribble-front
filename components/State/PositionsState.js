import { create } from "zustand";

const usePositionsStore = create((set) => ({
  positions: [],
  updatePositions: (newPositionsData) => set({ positions: newPositionsData }),
}));

export default usePositionsStore;
