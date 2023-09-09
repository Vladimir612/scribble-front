import React from "react";
import styles from "./userScreen.module.scss";
import useUserStore from "../../../State/UserState";

const UserScreen = () => {
  const user = useUserStore((state) => state);

  return (
    <div className={`${styles.candidateScreen} padding-global`}>
      User screen
    </div>
  );
};

export default UserScreen;
