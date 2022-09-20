import React from "react";

//******components
import Img from "../assets/image1.jpg";

//******styles
import styles from "./user.module.css";

const User = ({ user, selectUser }) => {
  return (
    <div className={styles.user_wrapper} onClick={() => selectUser(user)}>
      <div className={styles.user_info}>
        <div className={styles.user_detail}>
          <img
            src={user.avatar || Img}
            alt="avatar"
            className={styles.avatar}
          />
          <h4>{user.name}</h4>
        </div>
        <div
          className={
            user.isOnline
              ? styles.user_status_online
              : styles.user_status_offline
          }
        ></div>
      </div>
    </div>
  );
};

export default User;
