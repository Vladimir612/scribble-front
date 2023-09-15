import React, { useEffect, useState } from "react";
import styles from "./playerCard.module.scss";
import Image from "next/image";

const PlayerCard = ({ data }) => {
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

  return (
    <div className={styles.playerCard}>
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
        <h2>{data.user.fullName}</h2>
      </div>
      <h3 className={styles.score}>
        Score: <span>{data.score}</span>
      </h3>
    </div>
  );
};

export default PlayerCard;
