import { create } from "zustand";

const useCompanyStore = create((set) => ({
  companies: [],
  updateCompanies: (newCompanies) => set({ companies: newCompanies }),
}));

export default useCompanyStore;
