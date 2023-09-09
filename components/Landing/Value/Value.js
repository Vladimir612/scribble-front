import React from "react";
import * as styles from "./value.module.scss";
import CustomImage from "./../CustomImage/CustomImage";

const Value = ({ number, title, img, imgDimensions, subValues }) => {
  return (
    <div className={styles.value}>
      <div className={styles.info}>
        <h3>
          <span className={styles.title}>{title}</span>
          <span className={styles.num}>{number}</span>
        </h3>
        <ul>
          {subValues.map((value, index) => (
            <li key={index}>
              <CustomImage
                path="/checkMark.svg"
                customStyle={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
                alt="checkmark"
              />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <CustomImage
        path={img}
        customStyle={imgDimensions}
        className={styles["img-wrapper"]}
        alt={`HireClass | ${title}`}
      />
    </div>
  );
};

export default Value;
