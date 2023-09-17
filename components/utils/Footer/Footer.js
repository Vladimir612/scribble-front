import React from "react";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={`${styles["main-footer"]} padding-global`}>
      <div className={styles.bottom}>
        <p>&copy; 2023 InkedEnigma. All rights reserved.</p>
        <div>
          <span>Logo made by Dunja Nešić</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
