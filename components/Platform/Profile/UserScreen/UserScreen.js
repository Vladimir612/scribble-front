import React, { useEffect, useState } from "react";
import styles from "./userScreen.module.scss";
import useUserStore from "../../../State/UserState";
import axios from "axios";
import useAllGamesStore from "@/components/State/AllGamesState";
import GameCard from "../GameCard/GameCard";

const UserScreen = () => {
  const [showLoader, setShowLoader] = useState(false);

  const games = useAllGamesStore((state) => state.games);
  const updateGames = useAllGamesStore((state) => state.updateGames);

  useEffect(() => {
    async function fetchGames() {
      setShowLoader(true);
      try {
        let result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/getAll`
        );
        updateGames(result.data);
      } catch (err) {
        console.log(err);
      }
      setShowLoader(false);
    }
    if (games.length === 0) {
      fetchGames();
    }
  }, []);
  return (
    <div className={`${styles.userScreen} padding-global`}>
      <div className={styles.cards}>
        {games.map(
          (game, index) =>
            game && <GameCard key={index} data={game} id={index} />
        )}
      </div>
    </div>
  );
};

export default UserScreen;
