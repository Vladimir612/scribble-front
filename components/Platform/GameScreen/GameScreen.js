import React, { useEffect, useState } from "react";
import styles from "./gameScreen.module.scss";
import useGameStore from "@/components/State/GameState";
import { LuTimer } from "react-icons/lu";
import Button from "@/components/utils/Button/Button";
import Canvas from "./Canvas/Canvas";
import Chat from "./Chat/Chat";
import PlayerCard from "./PlayerCard/PlayerCard";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { HubConnectionBuilder } from "@microsoft/signalr";

const GameScreen = () => {
  const game = useGameStore((state) => state);

  const updateGame = useGameStore((state) => state.updateGame);
  const updatePlayers = useGameStore((state) => state.updatePlayers);

  const [userId, setUserId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //realtime
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);

    // Kreiranje SignalR konekcije
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7044/gameRoomHub")
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        setConnected(true);
      })
      .catch((error) => {
        console.error("Error connecting to SignalR hub", error);
      });

    newConnection.on("PlayerJoined", async (playerId) => {
      console.log("player " + playerId);
      console.log("me " + decodedToken.userId);

      if (playerId != decodedToken.userId) {
        let result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/User/getSinglePlayer?userId=${playerId}`
        );
        let updatedPlayers = [...game.players, result.data];
        updatePlayers(updatedPlayers);
      }
    });

    newConnection.on("PlayerLeft", (userId) => {
      console.log(`Player with userId ${userId} left the game`);
    });

    setConnection(newConnection);

    return () => {
      newConnection
        .stop()
        .then(() => {
          console.log("Disconnected from SignalR hub");
        })
        .catch((error) => {
          console.error("Error disconnecting from SignalR hub", error);
        });
    };
  }, []);

  useEffect(() => {
    if (connection && connected) {
      connection.invoke("PlayerJoinedGameScreen", game.id);
    }
  }, [connected, game.id]);

  const joinGame = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/joinById?roomId=${game.id}`;

    try {
      let result = await axios.post(url, null, config);

      let updatedPlayers = [...game.players, result.data];
      updatePlayers(updatedPlayers);

      await connection.invoke("PlayerJoined", result.data.userId, game.id);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response.data);
    }
  };

  const leaveGame = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/leave?roomId=${game.id}`;

    try {
      await axios.post(url, null, config);

      let updatedPlayers = game.players.filter(
        (player) => player.userId != userId
      );

      updatePlayers(updatedPlayers);

      await connection.invoke("PlayerLeft", parseInt(userId), game.id);
    } catch (err) {
      console.log(err);
      //   setErrorMsg(err.response.data);
    }
  };

  return (
    <>
      {errorMsg && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>
            <p>{errorMsg}</p>
            <Button
              type="pink"
              customStyle={{
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
              }}
              cb={(e) => {
                e.preventDefault();
                setErrorMsg("");
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      <div className={`${styles.gameScreen} padding-global`}>
        <div className={styles.topBar}>
          <h2 className={styles.code}>Code: {game.code}</h2>
          <div className={styles.timer}>
            <LuTimer size={30} color="#fff" />
            <span>
              60<span style={{ fontWeight: 400 }}>s</span>
            </span>
          </div>
          <div className={styles.btnsWrapper}>
            <Button
              type={
                game.players.some((player) => player.userId == userId)
                  ? "pink"
                  : "blue"
              }
              customStyle={{
                padding: "0.5rem 1rem",
                width: "8rem",
              }}
              cb={async (e) => {
                e.preventDefault();
                if (game.players.some((player) => player.userId == userId)) {
                  await leaveGame();
                } else {
                  await joinGame();
                }
              }}
            >
              {game.players.some((player) => player.userId == userId)
                ? "Leave"
                : "Join"}
            </Button>
          </div>
        </div>
        <div className={styles.middleScreen}>
          <Canvas width={600} height={450} />
          <Chat />
        </div>
        <div className={styles.bottomBar}>
          {game.players.map((player) => (
            <PlayerCard key={player.userId} data={player} />
          ))}
        </div>
      </div>
    </>
  );
};

export default GameScreen;
