import React from "react";
import styles from "./chat.module.scss";

const Chat = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.message}>
        <span className={styles.username}>User1:</span>
        <span className={styles.text}>Hello!</span>
      </div>
      <div className={styles.message}>
        <span className={styles.username}>User2:</span>
        <span className={styles.text}>Hi there!</span>
      </div>
    </div>
  );
};

export default Chat;
