import React from "react";
import Value from "../Value/Value";
import * as styles from "./valuesContainer.module.scss";

const ValuesContainer = () => {
  return (
    <section className={`${styles["values-container"]} padding-global`}>
      <h2>
        Values created <span className="col-pink">for you</span>
      </h2>
      <Value
        number="01"
        title="No unnecessery stuff to learn"
        img="/valueFirst.svg"
        imgDimensions={{ width: "35rem", height: "25rem" }}
        subValues={[
          "Our courses are designed specifically with companies for whose job you will apply.",
          "Therefore, we are providing you only necessary knowledge needed for work.",
          "Focus on the essentials.",
        ]}
      />
      <Value
        number="02"
        title="Powered by companies"
        img="/valueSecond.svg"
        imgDimensions={{ width: "35rem", height: "25rem" }}
        subValues={[
          "Seeing the great potential you have, the whole preparation for job is free of charge.",
          "The only thing you need is time and motivation.",
        ]}
      />
      <Value
        number="03"
        title="You are not alone"
        img="/valueThird.svg"
        imgDimensions={{ width: "35rem", height: "25rem" }}
        subValues={[
          "Throught the whole process you will have a mentor beside you who will made this journey personalized and easier for you.",
          "We are not only educational platform, except mentoring, we offer co-working, practical tasks, evaluation tests and more.",
          "Let us connect small steps for your path.",
        ]}
      />
      <Value
        number="04"
        title="We recommend you to companies"
        img="/valueFourth.svg"
        imgDimensions={{ width: "27rem", height: "25rem" }}
        subValues={[
          "We team up with companies for everyone who successfully finishes our courses aiming to bring you together.",
          "We structure your path and let you know once you are ready.",
          "Have in mind - You know what company wants from you.",
        ]}
      />
    </section>
  );
};

export default ValuesContainer;
