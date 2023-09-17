import React, { useEffect, useState } from "react";
import styles from "./message.module.scss";
import Image from "next/image";
import jwtDecode from "jwt-decode";

const Message = ({ data }) => {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (data.user.fullName !== "") {
      let arr = data.user.fullName.split(" ");
      if (arr.length !== 2) {
        setInitials(arr[0][0]);
      } else {
        setInitials(arr[0][0] + arr[1][0]);
      }
      return;
    }
  }, []);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  }, []);

  return (
    <div className={`${styles.message} ${styles["guessed-" + data.guessed]}`}>
      <div className={styles.user}>
        {data.user.profilePhoto !== "" ? (
          <div className={styles.profilePhoto}>
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_BASE_URL}${data.user.profilePhoto}`
              }
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${data.user.profilePhoto}`}
              fill
              alt={data.user.fullName}
            />
          </div>
        ) : (
          <div className={styles.initials}>
            <span>{initials}</span>
          </div>
        )}
      </div>
      <span className={styles.text}>
        {data.guessed && userId != data.user.id
          ? "Guessed word"
          : data.guessed
          ? data.messageText + " | Guessed"
          : data.messageText}
      </span>
    </div>
  );
};

export default Message;
