import React from "react";
import Link from "next/link";
import styles from "./notFound.module.scss";
import Button from "./../Button/Button";

const NotFound = () => {
  return (
    <div className={styles.notFoundScreen}>
      <div className={styles.numbers404}>
        <p className={styles.four}>4</p>
        <div className={styles.eyelid}>
          <div className={styles.zero}>
            <div className={styles.pupil}></div>
          </div>
        </div>
        <p className={styles.four}>4</p>
      </div>
      <p className={styles.text}>
        Unfortunately, we do not have a page at this address
      </p>
      <Link href="/">
        <Button type="pink">Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
