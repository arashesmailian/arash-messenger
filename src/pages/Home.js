import React, { useEffect, useState } from "react";

//components
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore"; //onSnapShot is real time but getDoc executed once
import User from "../components/User";

//styles
import styles from "./home.module.css";

const Home = () => {
  //states
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users"); // usersRef now refers to all users
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid])); // getting all users except onlins's (such as me)
    const unsub = onSnapshot(q, (querySnapshot) => {
      //adding query to snapshot
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub(); //cuase this method is realTime we need to unmount(????)
  }, []);
  console.log(users);

  return (
    <div className={styles.home_container}>
      <div className={styles.users_container}>
        {users.map((user) => (
          <User key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Home;
