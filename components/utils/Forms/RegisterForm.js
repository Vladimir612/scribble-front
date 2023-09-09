import React, { useState } from "react";
import MainNav from "../MainNav/MainNav";
import Button from "../Button/Button";
import styles from "./form.module.scss";
import axios from "axios";
import { validateEmail } from "./validations";
import CustomImage from "../../Landing/CustomImage/CustomImage";
import Link from "next/link";
import Loader from "../Loader/Loader";

const RegisterForm = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [platformDiscovery, setPlatformDiscovery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    setShowLoader(true);

    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setShowLoader(false);
      setErrorMsg("Please fill out all required fields");
      return;
    }
    if (email !== "") {
      if (!validateEmail(email)) {
        setShowLoader(false);
        setErrorMsg("Email is not valid");
        return;
      }
    }
    if (password.length < 6) {
      setShowLoader(false);
      setErrorMsg("Password must be at least 6 characters long");
      setSubmitted(false);
      return;
    }
    if (password !== confirmPassword) {
      setShowLoader(false);
      setErrorMsg("Passwords doesn't match");
      return;
    }

    setSubmitted(true);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/Candidate/register`;

    const requestBody = {
      fullName: fullName,
      email: email,
      userName: userName,
      password: password,
      city: city,
      platformDiscovery: platformDiscovery,
    };

    try {
      let result = await axios.post(url, requestBody);

      setShowLoader(false);
      setSuccessMsg(result.data);
      setErrorMsg("");
    } catch (err) {
      setShowLoader(false);
      setSubmitted(false);
      if (!err.response) {
        setErrorMsg("Server is down!");
        return;
      }
      setErrorMsg(err.response.data);

      return;
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
        {successMsg !== "" ? (
          <p className={styles["success-msg"]}>{successMsg}</p>
        ) : (
          <>
            <h2>Register!</h2>
            <p>
              If you want to learn with us register now! We will make sure to
              inform you on time about the release of our platform.
            </p>
            <div className={styles["input-group"]}>
              <label htmlFor="fullName">
                Full name <span style={{ color: "#ff5292" }}>*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="email">
                Email <span style={{ color: "#ff5292" }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="password">
                Password <span style={{ color: "#ff5292" }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="confirm-password">
                Confirm Password <span style={{ color: "#ff5292" }}>*</span>
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter your city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="platform-discovery">
                How did you discover this platform?
              </label>
              <textarea
                id="platform-discovery"
                name="platform-discovery"
                placeholder="I saw it on instagram"
                onChange={(e) => setPlatformDiscovery(e.target.value)}
                value={platformDiscovery}
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
              Register
            </Button>

            <p className={styles["par-login"]}>
              You already have an account? Go to{" "}
              <Link href="/login">login</Link> page.
            </p>
          </>
        )}
      </form>
    </section>
  );
};

export default RegisterForm;
