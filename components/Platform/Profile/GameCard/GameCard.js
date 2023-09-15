import React, { useEffect, useState } from "react";
import styles from "./gameCard.module.scss";
import Image from "next/image";
import Button from "../../../utils/Button/Button";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import axios from "axios";
import useAllGamesStore from "@/components/State/AllGamesState";

const GameCard = ({ data, id }) => {
  const [initials, setInitials] = useState("");
  const [userId, setUserId] = useState("");

  const games = useAllGamesStore((state) => state.games);
  const updateGames = useAllGamesStore((state) => state.updateGames);

  const deleteGame = async () => {
    const token = sessionStorage.getItem("jwtToken");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/delete`;

    try {
      await axios.delete(`${url}?roomId=${data.id}`, config);

      const updatedGames = games.filter((game) => game.id !== data.id);

      updateGames(updatedGames);
    } catch (err) {
      console.err(err);
    }
  };

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (token === "undefined") {
        sessionStorage.removeItem("jwtToken");
        return;
      }

      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } catch (err) {
      console.log(err);
    }
    if (data.admin.fullName !== "") {
      let arr = data.admin.fullName.split(" ");
      if (arr.length !== 2) {
        setInitials(arr[0][0]);
      } else {
        setInitials(arr[0][0] + arr[1][0]);
      }
      return;
    }
  }, []);

  return (
    <div className={`${styles.gameCard} ${styles.light}`}>
      <h2>Game #{id + 1}</h2>
      <span>Created by</span>
      <div className={styles.admin}>
        {data.admin.profilePhoto !== "" ? (
          <div className={styles.profilePhoto}>
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_BASE_URL}${data.admin.profilePhoto}`
              }
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${data.admin.profilePhoto}`}
              fill
              alt={data.admin.fullName}
            />
          </div>
        ) : (
          <div className={styles.initials}>
            <span>{initials}</span>
          </div>
        )}
        <h2>{data.admin.fullName}</h2>
      </div>
      <p>
        Code:
        <b> {data.code}</b>
      </p>
      <div className={styles.bottom}>
        <Link href={`/gameRooms/gameId=${data.id}`}>
          <Button
            type="blue"
            customStyle={{
              padding: "0.5rem 2rem",
              fontWeight: 600,
              width: "100%",
            }}
          >
            Game room
          </Button>
        </Link>
        {data.admin.id == userId && (
          <Button
            type="pink"
            customStyle={{
              padding: "0.5rem 2rem",
              fontWeight: 600,
              width: "100%",
            }}
            cb={deleteGame}
          >
            Delete room
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameCard;
