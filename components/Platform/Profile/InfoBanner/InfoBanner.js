import React, { useEffect, useState } from "react";
import styles from "./infoBanner.module.scss";
import Image from "next/image";

import { HiUpload } from "react-icons/hi";
import Button from "../../../utils/Button/Button";
import useUserStore from "../../../State/UserState";
import axios from "axios";

const InfoBanner = () => {
  const [initials, setInitials] = useState("");
  const [file, setFile] = useState(null);
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);

  const user = useUserStore((state) => state);
  const updateUser = useUserStore((state) => state.updateUser);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadPhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("jwtToken");

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
      localStorage.setItem("jwtToken", response.data.item2);

      const updatedUser = {
        ...user,
        profilePhoto: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.item1}`,
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

  return (
    <>
      {uploadPhotoModal && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>
            <p>Update your profile photo</p>
            <form>
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
            {user.role !== "Admin" && (
              <button
                className={styles.uploadPhoto}
                onClick={() => setUploadPhotoModal(true)}
              >
                <HiUpload size={40} color="#fff" />
              </button>
            )}
          </div>
          <div className={styles.text}>
            <div className={styles.flexRow}>
              <h4>{user.fullName}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoBanner;
