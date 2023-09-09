import React from "react";
import ExplainerCard from "../ExplainerCard/ExplainerCard";
import styles from "./cardList.module.scss";

const CardList = ({ cards, type }) => {
  return (
    <ul className={styles["card-list"]}>
      {cards.map((card) => (
        <li key={card.id}>
          <ExplainerCard {...card} type={type} />
        </li>
      ))}
    </ul>
  );
};

export default CardList;
