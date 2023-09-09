import { create } from "zustand";

const useUserStore = create((set) => ({
  role: "",
  fullName: "",
  email: "",
  userName: "",
  profilePhoto: "",
  github: "",
  linkedIn: "",
  city: "",
  currentJob: "",
  education: "",
  gender: "male",
  age: 0,
  positions: [],
  interviews: [],
  updateUser: (newUserData) => set(newUserData),
  resetUser: () =>
    set({
      role: "",
      fullName: "",
      email: "",
      userName: "",
      profilePhoto: "",
      github: "",
      linkedIn: "",
      city: "",
      currentJob: "",
      education: "",
      gender: "",
      positionInCompany: "",
      age: 0,
    }),
  updatePositions: (newPositionsData) => set({ positions: newPositionsData }),
  updateInterviews: (newInterviewData) => set({ interviews: newInterviewData }),
}));

export default useUserStore;
