import React from "react";
import CustomImage from "../../Landing/CustomImage/CustomImage";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={`${styles["main-footer"]} padding-global`}>
      <div className={styles.bottom}>
        <p>&copy; 2023 HireClass. All rights reserved.</p>
        <div>
          <span>Made with </span>
          <CustomImage
            path="/heart.svg"
            customStyle={{
              width: "1rem",
              height: "1rem",
              display: "inline-block",
              transform: "translateY(2px)",
            }}
            alt="HireClass heart"
          />
          <span> by HireClass team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
