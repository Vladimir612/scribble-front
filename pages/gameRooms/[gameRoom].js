import React, { useEffect, useState } from "react";
import useGameStore from "@/components/State/GameState";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "@/components/utils/Loader/Loader";
import GameScreen from "@/components/Platform/GameScreen/GameScreen";

const GameRoomPage = () => {
  const router = useRouter();
  const { gameRoom } = router.query;
  let id = null;

  if (gameRoom) {
    id = gameRoom.split("=")[1];
  }

  const [showLoader, setShowLoader] = useState(false);

  const updateGame = useGameStore((state) => state.updateGame);

  useEffect(() => {
    async function fetchGame() {
      setShowLoader(true);
      try {
        let result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/get?id=${id}`
        );
        updateGame(result.data);
      } catch (err) {
        console.log(err);
      }
      setShowLoader(false);
    }
    if (id !== null) {
      fetchGame();
    }
  }, [id]);

  return showLoader ? <Loader /> : <GameScreen />;
};

export default GameRoomPage;
