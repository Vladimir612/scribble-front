import React, { useState } from "react";
import Button from "../Button/Button";
import Link from "next/link";
import CustomImage from "../../Landing/CustomImage/CustomImage";
import styles from "./card.module.scss";
import { BsArrowRightShort } from "react-icons/bs";
import useUserStore from "../../State/UserState";
import usePositionsStore from "../../State/PositionsState";
import axios from "axios";
import MessageBox from "../MessageBox/MessageBox";

const ExplainerCard = ({ id, videoUrl, name, companies, image, type }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const user = useUserStore((state) => state);
  const updateUserPositions = useUserStore((state) => state.updatePositions);

  const positions = usePositionsStore((state) => state.positions);

  let slicedArrComp;
  if (companies) {
    slicedArrComp = companies.slice(0, 3);
  }

  const removeCourse = async () => {
    const token = localStorage.getItem("jwtToken");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/Candidate/cancelPosition`;

    try {
      await axios.delete(`${url}?positionId=${id}`, config);

      const updatedPositions = user.positions.filter(
        (position) => position.id !== id
      );

      updateUserPositions(updatedPositions);

      setSuccess(false);
      setMessage("You successfully removed course from your account");

      setShowMessageBox(true);
    } catch (err) {
      setMessage(err.response.data);
      setSuccess(false);
      setShowMessageBox(true);
    }
  };

  const startCourse = async () => {
    const token = localStorage.getItem("jwtToken");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/Candidate/applyPosition`;

    try {
      await axios.post(`${url}?positionId=${id}`, null, config);

      const filteredPosition = positions.find((position) => position.id === id);

      const positionWithProgress = {
        ...filteredPosition,
        progress: 0,
      };

      const updatedPositions = [...user.positions, positionWithProgress];

      updateUserPositions(updatedPositions);
      setSuccess(true);
      setMessage(`You successfully started ${name} course`);
      setShowMessageBox(true);
    } catch (err) {
      setMessage(err.response.data);
      setSuccess(false);
      setShowMessageBox(true);
    }
  };

  let isCourseEnrolled = false;

  if (user.positions.some((position) => position.id === id)) {
    isCourseEnrolled = true;
  }

  return (
    <>
      {showMessageBox && (
        <MessageBox message={message} close={() => setShowMessageBox(false)}>
          {success && (
            <Link href="/app/profile">
              <Button
                type="pink"
                customStyle={{
                  padding: "calc(0.5rem - 2px) 1rem",
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "2px solid #ff5292",
                  color: "#ff5292",
                }}
              >
                Check progress
              </Button>
            </Link>
          )}
        </MessageBox>
      )}
      <div className={`${styles.explainerCard} ${styles[type]}`}>
        <div className={styles["wrapper"]}>
          <div className={styles["video-wrapper"]}>
            <iframe
              src={videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className={styles.logoTitle}>
          <CustomImage
            path={image}
            className={styles["card-logo"]}
            alt={name}
          />
          <h2>{name}</h2>
        </div>
        <div className={styles.bottom}>
          {slicedArrComp && (
            <div className={styles.companies}>
              <p>Path supported by:</p>
              <ul className={styles.logos}>
                {slicedArrComp.map((com) => (
                  <li key={com.id}>
                    <CustomImage
                      path={com.img}
                      className={styles["comp-logo"]}
                      alt={com.name}
                    />
                  </li>
                ))}
                {companies.length > 3 && (
                  <li className={styles.more}>+{companies.length - 3}</li>
                )}
              </ul>
            </div>
          )}
          {type === "light" ? (
            user.role === "Candidate" ? (
              isCourseEnrolled ? (
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    background: "none",
                    border: "2px solid #ff5292",
                    color: "#ff5292",
                    fontWeight: 700,
                  }}
                  cb={removeCourse}
                >
                  Remove course
                </Button>
              ) : (
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={startCourse}
                >
                  Start course
                </Button>
              )
            ) : (
              user.role === "" && (
                <Link href="/register">
                  <Button
                    type="pink"
                    customStyle={{
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    You need to register first
                  </Button>
                </Link>
              )
            )
          ) : (
            <Link href={`/careerPaths/careerId=${id}`}>
              <Button
                type="pink"
                customStyle={{
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Checkout positions
                <BsArrowRightShort size={24} color="#fcf8ff" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ExplainerCard;
