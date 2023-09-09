import React from "react";
import Button from "../../utils/Button/Button";
import CustomImage from "./../CustomImage/CustomImage";
import styles from "./hero.module.scss";
import Link from "next/link";

const Hero = () => {
  return (
    <main className={styles["hero"] + " padding-global"}>
      <div className={styles["text"]}>
        <h1>
          Learn what you <span className={"col-pink"}>need</span>
        </h1>
        <p>
          We help you to become part of IT industry by providing free IT courses
          made for your dream job.
        </p>
        <Link href="/careerPaths">
          <Button type="pink">Start your career</Button>
        </Link>
      </div>
      <CustomImage
        className={styles["img-wrapper-1"]}
        path="/heroImg.svg"
        alt="HireClass landing"
      />
      <CustomImage
        path="/heroImg2.svg"
        className={styles["img-wrapper-h-1"]}
        alt="HireClass bg-logo small"
      />
      <CustomImage
        path="/heroImg3.svg"
        className={styles["img-wrapper-h-2"]}
        alt="HireClass bg-logo large"
      />
    </main>
  );
};

export default Hero;
