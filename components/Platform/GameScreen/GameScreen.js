import React, { useEffect, useRef, useState } from "react";
import styles from "./gameScreen.module.scss";
import useGameStore from "@/components/State/GameState";
import { LuTimer } from "react-icons/lu";
import Button from "@/components/utils/Button/Button";
import Chat from "./Chat/Chat";
import PlayerCard from "./PlayerCard/PlayerCard";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Canvas, { drawLine } from "./Canvas/Canvas";
import Image from "next/image";
import Link from "next/link";

const GameScreen = () => {
  const canvasRef = useRef(null);

  const game = useGameStore((state) => state);
  const updateGame = useGameStore((state) => state.updateGame);

  const updatePlayers = useGameStore((state) => state.updatePlayers);

  const updateMessages = useGameStore((state) => state.updateMessages);

  const [userId, setUserId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [gameStatus, setGameStatus] = useState(-1);
  const [pickWord, setPickWord] = useState(false);
  const [word, setWord] = useState("");

  const [message, setMessage] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [userIdLeft, setUserIdLeft] = useState(null);
  const [updateScore, setUpdateScore] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winnerInitials, setWinnerInitials] = useState("null");

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
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/User/getSinglePlayer?userId=${playerId}`
      );

      setNewUser(result.data);
    });

    newConnection.on("PlayerLeft", (userId) => {
      setUserIdLeft(userId);
    });

    newConnection.on("ReceiveLine", (start, end) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        drawLine(end, start, ctx, "#171941", 5);
      }
    });

    newConnection.on("GameStarted", () => {
      setGameStatus(0);
    });

    newConnection.on("WordChosen", () => {
      setGameStatus(1);
    });

    newConnection.on("ReceiveMessage", (message) => {
      setMessage(message);
    });

    newConnection.on("UpdatedScore", (userId, score) => {
      setUpdateScore({ userId, score });
    });

    newConnection.on("GameFinished", (winner) => {
      setWinner(winner);
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

  useEffect(() => {
    if (message) {
      let updatedMessages = [...game.messages, message];
      updateMessages(updatedMessages);
    }

    return () => {
      setMessage(null);
    };
  }, [message]);

  useEffect(() => {
    if (newUser) {
      let updatedPlayers = [...game.players, newUser];
      updatePlayers(updatedPlayers);
    }

    return () => {
      setNewUser(null);
    };
  }, [newUser]);

  useEffect(() => {
    if (userIdLeft) {
      let updatedPlayers = game.players.filter(
        (player) => player.userId != userIdLeft
      );

      updatePlayers(updatedPlayers);
    }

    return () => {
      setUserIdLeft(null);
    };
  }, [userIdLeft]);

  useEffect(() => {
    if (updateScore) {
      const index = game.players.findIndex(
        (player) => player.userId === updateScore.userId
      );
      game.players[index].score = updateScore.score;

      updatePlayers(game.players);
    }

    return () => {
      setUpdateScore(null);
    };
  }, [updateScore]);

  useEffect(() => {
    if (winner) {
      if (winner.user.fullName !== "") {
        let arr = winner.user.fullName.split(" ");
        if (arr.length !== 2) {
          setWinnerInitials(arr[0][0]);
        } else {
          setWinnerInitials(arr[0][0] + arr[1][0]);
        }
        return;
      }
    }
  }, [winner]);

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

  const finishGame = async () => {
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

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/finishGame?roomId=${game.id}`;

    try {
      let result = await axios.post(url, null, config);

      await connection.invoke("GameFinished", result.data, game.id);
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
      setErrorMsg(err.response.data);
    }
  };

  const startGame = async () => {
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

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/start?roomId=${game.id}`;

    try {
      await axios.post(url, null, config);

      updateGame({ ...game, status: 1 });

      await connection.invoke("GameStarted", game.id);
      setPickWord(true);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response.data);
    }
  };

  const chooseWord = async () => {
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

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/chooseWord?roomId=${game.id}&word=${word}`;

    try {
      await axios.post(url, null, config);

      await connection.invoke("WordChosen", game.id);
      setPickWord(false);
      setGameStatus(1);
    } catch (err) {
      console.log(err);
      // setErrorMsg(err.response.data);
    }
  };

  return (
    <>
      {gameStatus === 0 && game.admin.id != userId && (
        <div className={styles.modalBg}>
          <div className={`${styles.modal} ${styles.modalJoin}`}>
            <p>Artist is choosing word!</p>
          </div>
        </div>
      )}
      {winner && (
        <div className={styles.modalBg}>
          <div className={`${styles.modal}`}>
            <h3>WINNER</h3>
            <div className={styles.winner}>
              <div className={styles.user}>
                {winner.user.profilePhoto !== "" ? (
                  <div className={styles.profilePhoto}>
                    <Image
                      loader={() =>
                        `${process.env.NEXT_PUBLIC_BASE_URL}${winner.user.profilePhoto}`
                      }
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${winner.user.profilePhoto}`}
                      fill
                      alt={winner.user.fullName}
                    />
                  </div>
                ) : (
                  <div className={styles.initials}>
                    <span>{winnerInitials}</span>
                  </div>
                )}
                <h2>{winner.user.fullName}</h2>
              </div>
              <h3 className={styles.score}>
                Score: <span>{winner.score}</span>
              </h3>
            </div>
            <Link href="/app/profile">
              <Button type="blue">Games</Button>
            </Link>
          </div>
        </div>
      )}
      {pickWord && (
        <div className={styles.modalBg}>
          <div className={`${styles.modal} ${styles.modalJoin}`}>
            <>
              <form>
                <div className={styles["input-group"]}>
                  <label htmlFor="word">Word</label>
                  <input
                    id="word"
                    name="word"
                    type="text"
                    placeholder="Choose word to draw"
                    onChange={(e) => setWord(e.target.value)}
                    value={word}
                  />
                </div>
              </form>
              <div className={styles.btnsWrapper}>
                <Button
                  type="blue"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={async (e) => {
                    e.preventDefault();
                    await chooseWord();
                  }}
                >
                  Choose
                </Button>
              </div>
            </>
          </div>
        </div>
      )}
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
          <div className={styles.startGame}>
            {game.admin.id == userId && gameStatus === 1 && (
              <div className={styles.finish}>
                <h1 style={{ fontSize: "1.4rem" }}>Draw {word}</h1>
                <Button
                  type="blue"
                  customStyle={{
                    padding: "1rem 5rem",
                    fontSize: "1.8rem",
                  }}
                  cb={async (e) => {
                    e.preventDefault();
                    await finishGame();
                  }}
                >
                  FINISH
                </Button>
              </div>
            )}
            {game.admin.id != userId && gameStatus === 1 && (
              <h1 style={{ fontSize: "1.4rem" }}>Guess the word</h1>
            )}
            {game.admin.id == userId && gameStatus === -1 && (
              <Button
                type="blue"
                customStyle={{
                  padding: "1rem 5rem",
                  fontSize: "1.8rem",
                }}
                cb={async (e) => {
                  e.preventDefault();
                  await startGame();
                }}
                disabled={game.status !== 0 || game.players.length < 2}
              >
                START
              </Button>
            )}
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
          <Canvas
            width={600}
            height={450}
            roomId={game.id}
            connection={connection}
            canvasRef={canvasRef}
            disabled={game.admin.id != userId && gameStatus === 1}
          />
          <Chat connection={connection} />
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
