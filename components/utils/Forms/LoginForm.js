import React, { useState, useEffect } from "react";
import MainNav from "../MainNav/MainNav";
import Button from "../Button/Button";
import styles from "./form.module.scss";
import axios from "axios";
import CustomImage from "../../Landing/CustomImage/CustomImage";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Loader from "../Loader/Loader";

const LoginForm = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    if (token) {
      push("/app/profile");
    }
  }, [success]);

  const handleSubmit = async () => {
    if (userNameOrEmail === "" || password === "") {
      setErrorMsg("Please fill out all required fields");
      return;
    }

    setSubmitted(true);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/User/login`;

    const requestBody = {
      userNameOrEmail: userNameOrEmail,
      password: password,
    };
    try {
      setShowLoader(true);
      let result = await axios.post(url, requestBody);

      sessionStorage.setItem("jwtToken", result.data);
      setShowLoader(false);
      setSuccess(true);
      setErrorMsg("");
    } catch (err) {
      setShowLoader(false);
      setSubmitted(false);
      if (!err.response) {
        setErrorMsg("Server is down!");
        return;
      }
      setErrorMsg(err.response.data);
    }
  };

  return (
    <section className={`${styles["register-page"]} padding-global`}>
      <MainNav />
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
      <form className={styles["register-form"]}>
        <h2>Login</h2>
        <p>If you already have account you can login here</p>
        <div className={styles["input-group"]}>
          <label htmlFor="email">Username or Email</label>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="email"
            placeholder="Enter your username or email"
            onChange={(e) => setUserNameOrEmail(e.target.value)}
            value={userNameOrEmail}
          />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {showLoader ? (
          <Loader />
        ) : (
          <div className={styles["error-msg"]}>{errorMsg}</div>
        )}
        <Button
          type="pink"
          cb={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={submitted}
        >
          Login
        </Button>

        {/* <p className={styles["forgot-password"]}>
          <Link href="/forgot-password">Forgot password?</Link>
        </p> */}
        <p className={styles["par-login"]}>
          You don't have an account? Go to{" "}
          <Link href="/register">register</Link> page.
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
