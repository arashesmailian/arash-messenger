import React from "react";

//components
import Img from "../assets/image1.jpg";
import Camera from "../assets/svg/Camera";

//styles
import styles from "./profile.module.css";

const Profile = () => {
  return (
    <section>
      <div className={styles.profile_container}>
        <div className={styles.img_container}>
          <img src={Img} alt="avatar" />
          <div className={styles.overlay}>
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              <input
                type="file"
                className={styles.file_input}
                id="photo"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className={styles.text_container}>
          <h3>User name</h3>
          <p>User email</p>
          <hr />
          <small>joined on: ...</small>
        </div>
      </div>
    </section>
  );
};

export default Profile;
