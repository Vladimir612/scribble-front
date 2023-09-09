import React, { useEffect, useState } from "react";
import MainNav from "../MainNav/MainNav";
import Button from "../Button/Button";
import styles from "./form.module.scss";
import axios from "axios";
import { validateEmail } from "./validations";
import CustomImage from "../../Landing/CustomImage/CustomImage";
import Link from "next/link";
import { useRouter } from "next/router";

const RegisterCcpForm = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [positionInCompany, setPositionInCompany] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      push("/app/profile");
    }
  }, [success]);

  const handleSubmit = async () => {
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setErrorMsg("Please fill out all required fields");
      return;
    }
    if (email !== "") {
      if (!validateEmail(email)) {
        setErrorMsg("Email is not valid");
        return;
      }
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords doesn't match");
      return;
    }

    setSubmitted(true);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/CCP/completeRegistration`;

    const requestBody = {
      fullName: fullName,
      email: email,
      userName: userName,
      password: password,
      verificationCode: verificationCode,
      positionInCompany: positionInCompany,
    };

    try {
      let result = await axios.post(url, requestBody);

      localStorage.setItem("jwtToken", result.data);
      setSuccess(true);
      setErrorMsg("");
    } catch (err) {
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
        <h2>Register!</h2>
        <p>
          Hi, you probably got an email if you are here, please type in your
          email with verification code and fill in the rest of the form
        </p>
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
          <label htmlFor="verificationCode">
            Verification code <span style={{ color: "#ff5292" }}>*</span>
          </label>
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            placeholder="Enter your verification code"
            onChange={(e) => setVerificationCode(e.target.value)}
            value={verificationCode}
          />
        </div>
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
          <label htmlFor="confirm-password">Company position</label>
          <input
            id="company-position"
            name="company-position"
            type="text"
            placeholder="What is your position in the company"
            onChange={(e) => setPositionInCompany(e.target.value)}
            value={positionInCompany}
          />
        </div>
        <div className={styles["error-msg"]}>{errorMsg}</div>
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
          You already have an account? Go to <Link href="/login">login</Link>{" "}
          page.
        </p>
      </form>
    </section>
  );
};

export default RegisterCcpForm;
