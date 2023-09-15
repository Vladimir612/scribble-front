import React, { useEffect, useState } from "react";
import styles from "./infoBanner.module.scss";
import Image from "next/image";

import { HiUpload } from "react-icons/hi";
import Button from "../../../utils/Button/Button";
import useUserStore from "../../../State/UserState";
import axios from "axios";
import useAllGamesStore from "@/components/State/AllGamesState";
import Link from "next/link";
import Loader from "@/components/utils/Loader/Loader";
import { useRouter } from "next/router";

const InfoBanner = () => {
  const [initials, setInitials] = useState("");
  const [file, setFile] = useState(null);
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const { push } = useRouter();

  const [showMessageBoxCreate, setShowMessageBoxCreate] = useState(false);

  const [showMessageBoxJoin, setShowMessageBoxJoin] = useState(false);
  const [code, setCode] = useState("");

  const [gameRoomLink, setGameRoomLink] = useState("");

  const user = useUserStore((state) => state);
  const updateUser = useUserStore((state) => state.updateUser);

  const [errorMsg, setErrorMsg] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const games = useAllGamesStore((state) => state.games);
  const updateGames = useAllGamesStore((state) => state.updateGames);

  const uploadPhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = sessionStorage.getItem("jwtToken");

      if (token === "undefined") {
        sessionStorage.removeItem("jwtToken");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/User/uploadProfilePhoto`,
        formData,
        config
      );

      sessionStorage.setItem("jwtToken", response.data.jwtToken);

      const updatedUser = {
        ...user,
        profilePhoto: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.imageUrl}`,
      };
      updateUser(updatedUser);

      setFile(false);
      setUploadPhotoModal(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  useEffect(() => {
    if (user.fullName) {
      let arr = user.fullName.split(" ");
      if (arr.length !== 2) {
        setInitials(arr[0][0]);
      } else {
        setInitials(arr[0][0] + arr[1][0]);
      }
    }
  }, [user]);

  const createGame = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/create`;

    try {
      let result = await axios.post(url, null, config);

      const updatedGames = [...games, result.data];
      setGameRoomLink(`/gameRooms/gameId=${result.data.id}`);

      updateGames(updatedGames);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };

  const joinGame = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (token === "undefined") {
      sessionStorage.removeItem("jwtToken");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/GameRoom/joinByCode?verificationCode=${code}`;

    try {
      setShowLoader(true);
      let result = await axios.post(url, null, config);

      push(`/gameRooms/gameId=${result.data}`);

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.response.data);
      setSuccess(false);
    }
    setShowLoader(false);
  };

  return (
    <>
      {showMessageBoxJoin && (
        <div className={styles.modalBg}>
          <div className={`${styles.modal} ${styles.modalJoin}`}>
            <>
              <form>
                <div className={styles["input-group"]}>
                  <label htmlFor="code">Game code</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter game code"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                  />
                </div>
                <div className={styles.loaderAndErr}>
                  {showLoader ? (
                    <Loader backColor={"#fff"} />
                  ) : (
                    <div className={styles["error-msg"]}>{errorMsg}</div>
                  )}
                </div>
              </form>
              <div className={styles.btnsWrapper}>
                <Button
                  type="blue"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={async (e) => {
                    e.preventDefault();
                    await joinGame();
                  }}
                  disabled={code.length !== 6}
                >
                  Join
                </Button>
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={(e) => {
                    e.preventDefault();
                    setShowMessageBoxJoin(false);
                    setErrorMsg("");
                    setCode("");
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          </div>
        </div>
      )}
      {showMessageBoxCreate && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>
            {!success ? (
              <>
                <p>
                  You already created other game, go and delete it to make a new
                  one
                </p>
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={(e) => {
                    e.preventDefault();
                    setShowMessageBoxCreate(false);
                  }}
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <p>Successfully created new game</p>
                <Link href={gameRoomLink}>
                  <Button type="blue">Go to game room</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      {uploadPhotoModal && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>
            <p>Update your profile photo</p>
            <form className={styles.uploadForm}>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="file">Select Photo</label>
              {file && (
                <div className={styles.profileImg}>
                  <Image src={URL.createObjectURL(file)} alt="Selected" fill />
                </div>
              )}
              <div className={styles.btnsWrapper}>
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    width: "8rem",
                  }}
                  cb={(e) => {
                    e.preventDefault();
                    uploadPhoto();
                  }}
                  disabled={file === null}
                >
                  Update Photo
                </Button>
                <Button
                  type="pink"
                  customStyle={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  cb={(e) => {
                    e.preventDefault();
                    setUploadPhotoModal(false);
                    setFile(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={`${styles.infoBanner} padding-global`}>
        <div className={styles.info}>
          <div className={styles.profileImgWrapper}>
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

            <button
              className={styles.uploadPhoto}
              onClick={() => setUploadPhotoModal(true)}
            >
              <HiUpload size={40} color="#fff" />
            </button>
          </div>
          <div className={styles.text}>
            <div className={styles.flexRow}>
              <h4>{user.fullName}</h4>
            </div>
          </div>
        </div>
        <div className={styles.btnsWrapper}>
          <Button
            type="blue"
            cb={async () => {
              await createGame();
              setShowMessageBoxCreate(true);
            }}
          >
            Create game
          </Button>
          <Button
            type="pink"
            cb={async () => {
              setShowMessageBoxJoin(true);
            }}
          >
            Join game
          </Button>
        </div>
      </div>
    </>
  );
};

export default InfoBanner;
