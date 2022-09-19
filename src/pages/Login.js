import React, { useState } from "react";

//components
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

//styles
import styles from "./login.module.css";

const Login = () => {
  //states
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { email, password, error, loading } = data;
  const navigate = useNavigate();

  //functions
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "all fields are required!" });
    }
    try {
      //login user
      const result = await signInWithEmailAndPassword(auth, email, password);
      // setting user in firestore database
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      navigate("/");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <section>
      <h3>Log into your Account</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_container}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.btn_container}>
          <button className={styles.btn} disabled={loading}>
            {loading ? "Logging in ..." : "Login"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
