import React from "react";
import styles from "./messageBox.module.scss";
import Button from "../Button/Button";

const MessageBox = ({ message, close, children }) => {
  return (
    <div className={styles.messageBox}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.btnsWrapper}>
          <Button
            type="pink"
            customStyle={{
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
            }}
            cb={(e) => {
              e.preventDefault();
              close();
            }}
          >
            Close
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
