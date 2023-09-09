import React from "react";
import styles from "./image.module.scss";
import Image from "next/image";

const CustomImage = ({ path, customStyle, imgPos, className, alt }) => {
  return (
    <div
      className={`${styles.imgWrapper} ${styles[imgPos]} ${className}`}
      style={customStyle}
    >
      <Image alt={alt} src={path} fill />
    </div>
  );
};

export default CustomImage;
