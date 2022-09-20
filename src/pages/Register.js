import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//******components
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

//******styles
import styles from "./register.module.css";

const Register = () => {
  //******states
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { name, email, password, error, loading } = data;
  const navigate = useNavigate();

  //******functions
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "all fields are required!" });
    }
    try {
      //registering new user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // setting user in firestore database
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      setData({
        name: "",
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
      <h3>Create an Account</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_container}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
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
            {loading ? "Creating ..." : "Register"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
