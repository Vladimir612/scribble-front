import React from "react";
import styles from "./banner.module.scss";
import Link from "next/link";
import { BsHouseDoorFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import CustomImage from "../../Landing/CustomImage/CustomImage";

const Banner = ({ type, title, img, location }) => {
  return (
    <div className={styles.banner}>
      {img && (
        <CustomImage
          className={styles["banner-img"]}
          path={img}
          alt="Woman on laptop"
        />
      )}
      <div className={styles["text-wrapper"] + " padding-global"}>
        <span className={styles.type}>{type}</span>
        <h1>{title}</h1>
      </div>
      {location && (
        <div className={styles.locationNav + " padding-global"}>
          <Link href="/careerPaths">
            <BsHouseDoorFill size={24} color="#fcf8ff" /> Career paths
          </Link>
          {location.map((link, index) => (
            <div key={index} className={styles.link}>
              <span>
                <IoIosArrowForward size={16} color="#fcf8ff" />
              </span>
              <Link
                href={link.url}
                key={index}
                className={index === location.length - 1 ? styles.active : ""}
              >
                {link.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
