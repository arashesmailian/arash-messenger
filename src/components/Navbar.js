import React, { useContext } from "react";
import { Link } from "react-router-dom";

//components
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";

//styles
import styles from "./navbar.module.css";

const Navbar = () => {
  //states
  const { user } = useContext(AuthContext); //creating context to checking if we have loged in user or not

  const navigate = useNavigate();
  //functions
  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav>
      <h3>
        <Link to="/">Messenger</Link>
      </h3>
      <div>
        {user ? (
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
