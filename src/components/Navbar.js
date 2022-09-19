import React from "react";
import { Link } from "react-router-dom";

//components
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";

//styles
import styles from "./navbar.module.css";
import { async } from "@firebase/util";

const Navbar = () => {
  //functions
  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
  };

  return (
    <nav>
      <h3>
        <Link to="/">Messenger</Link>
      </h3>
      <div>
        {auth.currentUser ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className={styles.btn} onClick={handleSignout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
