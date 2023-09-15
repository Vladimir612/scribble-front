import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiUserCircle } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

import CustomImage from "./../../Landing/CustomImage/CustomImage";
import styles from "./mainNav.module.scss";
import { motion } from "framer-motion";
import useUserStore from "../../State/UserState";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import Image from "next/image";

const MainNav = () => {
  const [active, setActive] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const [initials, setInitials] = useState("");

  const [logoutShow, setLogoutShow] = useState(false);

  const user = useUserStore((state) => state);
  const updateUser = useUserStore((state) => state.updateUser);
  const resetUser = useUserStore((state) => state.resetUser);

  const { push } = useRouter();

  useEffect(() => {
    if (user.fullName !== "") {
      let arr = user.fullName.split(" ");
      if (arr.length !== 2) {
        setInitials(arr[0][0]);
      } else {
        setInitials(arr[0][0] + arr[1][0]);
      }
      return;
    }
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (token === "undefined") {
        sessionStorage.removeItem("jwtToken");
        return;
      }
      const decodedToken = jwtDecode(token);

      const userData = {
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        email: decodedToken.email,
        profilePhoto:
          decodedToken.profilePhoto !== ""
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${decodedToken.profilePhoto}`
            : "",
      };
      let arr = userData.fullName.split(" ");
      if (arr.length !== 2) {
        setInitials(arr[0][0]);
      } else {
        setInitials(arr[0][0] + arr[1][0]);
      }

      updateUser(userData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("jwtToken");

    push("/login");
    resetUser();
  };

  return (
    <nav className={styles["main-nav"] + " padding-global"}>
      <CustomImage
        path="/logo.svg"
        customStyle={{ width: "14rem", height: "5rem" }}
        alt="HireClass logo"
      />
      <div className={`${styles.links} ${active && styles.active}`}>
        <ul className={styles.pages}>
          <li
            onClick={() => {
              setActive(false);
              setLogoutShow(false);
            }}
          >
            <Link href="/">Home</Link>
          </li>
        </ul>
        {user.email ? (
          <div className={styles.profile}>
            <button
              className={styles.iconGroup}
              onClick={() => setLogoutShow(!logoutShow)}
            >
              {user.profilePhoto !== "" ? (
                <div className={styles.profileImg}>
                  <Image
                    loader={() => user.profilePhoto}
                    src={user.profilePhoto}
                    fill
                    alt={user.fullName}
                  />
                </div>
              ) : (
                <div className={styles.initials}>
                  <span>{initials}</span>
                </div>
              )}
              {
                <div
                  className={styles.arrow}
                  style={
                    logoutShow
                      ? { transform: "rotate(180deg)" }
                      : { transform: "rotate(0)" }
                  }
                >
                  <IoIosArrowDown size={22} color="#fcf8ff" />
                </div>
              }
            </button>
            {logoutShow && (
              <div className={styles.logout}>
                <Link href="/app/profile">
                  <button style={{ border: "none" }}>My profile</button>
                </Link>
                <button onClick={logout}>Log out</button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles["login-registration"]}>
            <Link href="/login">
              <button style={{ border: "none" }}>Login</button>
            </Link>
            <Link href="/register">
              <button>Register</button>
            </Link>
          </div>
        )}
      </div>
      <div
        className={styles["hamburger-menu"]}
        onClick={() => {
          setActive(!active);
          setLogoutShow(false);
          setShouldAnimate(true);
        }}
      >
        <motion.div
          className={`${styles.line} ${styles["line-1"]}`}
          animate={
            shouldAnimate && {
              y: active
                ? ["0rem", "0.4rem", "0.4rem"]
                : ["0.4rem", "0.4rem", "0rem"],
              rotate: active ? [0, 0, 45] : [45, 0, 0],
            }
          }
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.div
          className={`${styles.line} ${styles["line-2"]}`}
          animate={
            shouldAnimate && {
              opacity: active ? [1, 0, 0] : [0, 0, 1],
            }
          }
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.div
          className={`${styles.line} ${styles["line-3"]}`}
          animate={
            shouldAnimate && {
              y: active
                ? ["0rem", "-0.4rem", "-0.4rem"]
                : ["-0.4rem", "-0.4rem", "0rem"],
              rotate: active ? [0, 0, -45] : [-45, 0, 0],
            }
          }
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    </nav>
  );
};

export default MainNav;
