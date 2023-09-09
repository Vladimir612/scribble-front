import React from "react";
import styles from "./button.module.scss";

const Button = ({ children, cb, type, disabled, customStyle }) => {
  let disabledClick = disabled !== null ? disabled : false;

  return (
    <button
      onClick={cb}
      className={`${styles.btn} ${styles[type]} ${
        disabledClick && styles["disabled"]
      }`}
      disabled={disabledClick}
      style={{ ...customStyle }}
    >
      {children}
    </button>
  );
};

export default Button;
