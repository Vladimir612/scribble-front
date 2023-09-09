import React, { useEffect } from "react";
import styles from "./profile.module.scss";

//components
import InfoBanner from "./InfoBanner/InfoBanner";
import MainNav from "../../utils/MainNav/MainNav";
import UserScreen from "./UserScreen/UserScreen";

//special libs
import { useRouter } from "next/navigation";
import useUserStore from "../../State/UserState";

const Profile = () => {
  const { push } = useRouter();

  const user = useUserStore((state) => state);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      push("/login");
    }
  }, []);

  return (
    <div className={styles.profile}>
      <MainNav />
      <InfoBanner />
      <UserScreen />
    </div>
  );
};

export default Profile;
