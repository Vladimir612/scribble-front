import axios from "axios";
import React, { useState } from "react";
import Button from "../Button/Button";
import styles from "./form.module.scss";
import { validateEmail } from "./validations";

const QuestionForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (fullName === "" || email === "" || message === "") {
      setErrorMsg("Please fill out all fields");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Email is not valid");
      return;
    }

    setSubmitted(true);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/User/sendMessage`;

    const requestBody = {
      fullName: fullName,
      email: email,
      messageText: message,
    };

    try {
      await axios.post(url, requestBody);

      setSuccess(true);
    } catch (err) {
      console.err(err);
      setSuccess(false);
    }
    setSubmitted(false);
  };

  return success ? (
    <p className={styles["success-msg"]}>
      You have successfully sent us your email. Expect an email from us soon!
    </p>
  ) : (
    <form className={styles["question-form"]}>
      <div className={styles["input-group"]}>
        <label htmlFor="fullname">Full name</label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Enter your full name"
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        />
      </div>
      <div className={styles["input-group"]}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className={styles["input-group"]} style={{ marginBottom: "1rem" }}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Enter your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <Button
        type="pink"
        cb={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        disabled={submitted}
      >
        Send message
      </Button>
      <p className={styles["error-msg"]}>{errorMsg}</p>
    </form>
  );
};

export default QuestionForm;
