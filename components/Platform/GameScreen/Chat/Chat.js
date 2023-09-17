import React, { useEffect, useRef, useState } from "react";
import styles from "./chat.module.scss";
import Message from "./Message/Message";
import axios from "axios";
import useGameStore from "../../../State/GameState";
import { BsSendFill } from "react-icons/bs";
import jwtDecode from "jwt-decode";

const Chat = ({ connection }) => {
  const updateMessages = useGameStore((state) => state.updateMessages);
  const game = useGameStore((state) => state);
  const [message, setMessage] = useState("");
  const [guessed, setGuessed] = useState(false);

  const updatePlayers = useGameStore((state) => state.updatePlayers);

  const messagesDivRef = useRef(null);

  const [userId, setUserId] = useState();

  const sendMessage = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/sendMessage?roomId=${game.id}&message=${message}`;
    const scoreUrl = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/getMyScore?roomId=${game.id}`;

    try {
      let result = await axios.post(url, null, config);

      let updatedMessages = [...game.messages, result.data];
      updateMessages(updatedMessages);

      setMessage("");
      if (connection && connection._connectionState === "Connected") {
        await connection.invoke("SendMessage", result.data, game.id);

        if (result.data.guessed) {
          setGuessed(true);
          let score = await axios.get(scoreUrl, config);

          const index = game.players.findIndex(
            (player) => player.userId === result.data.userId
          );
          game.players[index].score = score.data;

          updatePlayers(game.players);

          await connection.invoke(
            "UpdatedScore",
            result.data.userId,
            score.data,
            game.id
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);

    async function fetchMessages() {
      try {
        let result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/getMessages?roomId=${game.id}`
        );
        updateMessages(result.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesDivRef.current) {
        const container = messagesDivRef.current;
        container.scrollTop = container.scrollHeight;
      }
    };

    scrollToBottom();
  }, [game.messages]);

  return (
    <div className={styles.chat}>
      <div className={styles.messages} ref={messagesDivRef}>
        {game.messages.map((message, index) => (
          <Message key={index} data={message} />
        ))}
      </div>
      <form
        className={styles.sendMsg}
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage();
        }}
      >
        {game.adminId == userId && <p>You can't guess, you will draw</p>}
        {!guessed && game.adminId != userId && (
          <>
            <div className={styles["input-group"]}>
              <input
                id="message"
                name="message"
                type="text"
                placeholder="Guess word"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
            </div>
            <div
              className={styles.sendIcon}
              onClick={async () => {
                await sendMessage();
              }}
            >
              <BsSendFill size={25} color="#171941" />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Chat;
