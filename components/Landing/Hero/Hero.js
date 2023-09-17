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
          Inked<span className={"col-pink"}>Enigma</span>
        </h1>
        <p>
          Guess & draw with your friends. Challenge your buddies to join the
          creative frenzy, and let the hilarity ensue. With each stroke of the
          virtual brush and every guess made, you'll find it impossible to
          resist the urge to keep playing. So, jump into the action and discover
          the joy of this social drawing game that promises non-stop
          entertainment with every match.
        </p>
      </div>
      <CustomImage
        className={styles["img-wrapper-1"]}
        path="/heroImg.svg"
        alt="InkedEnigma landing"
      />
      <CustomImage
        path="/heroImg2.svg"
        className={styles["img-wrapper-h-1"]}
        alt="InkedEnigma bg-logo small"
      />
      <CustomImage
        path="/heroImg3.svg"
        className={styles["img-wrapper-h-2"]}
        alt="InkedEnigma bg-logo large"
      />
    </main>
  );
};

export default Hero;
