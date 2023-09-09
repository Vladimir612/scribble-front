import React from "react";
import styles from "./loader.module.scss";

const Loader = ({ backColor, paddingTop }) => {
  return (
    <div className={styles.loaderContainer} style={{ paddingTop: paddingTop }}>
      <div
        className={styles.loader}
        style={{
          border: `2px solid ${backColor}`,
          borderTop: "2px solid #ff5292",
        }}
      ></div>
    </div>
  );
};

export default Loader;
