import { create } from "zustand";

const useCareersStore = create((set) => ({
  careers: [],
  updateCareers: (newCareersData) => set({ careers: newCareersData }),
}));

export default useCareersStore;
