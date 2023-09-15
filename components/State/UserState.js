import { create } from "zustand";

const useUserStore = create((set) => ({
  fullName: "",
  email: "",
  userName: "",
  profilePhoto: "",
  updateUser: (newUserData) => set(newUserData),
  resetUser: () =>
    set({
      fullName: "",
      email: "",
      userName: "",
      profilePhoto: "",
    }),
}));

export default useUserStore;
