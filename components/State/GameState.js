import { create } from "zustand";

const useGameStore = create((set) => ({
  id: 0,
  admin: {},
  winner: {},
  code: "",
  finishedRounds: 0,
  status: 0,
  players: [],
  round: {},
  messages: [],
  updateGame: (newGameData) => set(newGameData),
  resetGame: () =>
    set({
      admin: {},
      winner: {},
      code: "",
      finishedRounds: 0,
      status: "",
      players: [],
      round: {},
    }),
  updatePlayers: (newPlayersData) => set({ players: newPlayersData }),
  updateMessages: (newMessagesData) => set({ messages: newMessagesData }),
  updateRound: (newRoundData) => set({ round: newRoundData }),
}));

export default useGameStore;
