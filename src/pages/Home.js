import React, { useEffect, useState } from "react";

//******components
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore"; //onSnapShot is real time but getDoc executed once
import User from "../components/User";

//******styles
import styles from "./home.module.css";

const Home = () => {
  //******states
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");

  //******functions
  const selectUser = (user) => {
    // selecting user from left-side user list
    setChat(user);
    console.log(user);
  };

  useEffect(() => {
    const usersRef = collection(db, "users"); // usersRef now refers to all users
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid])); // getting all users except onlins's (such as me)
    const unsub = onSnapshot(q, (querySnapshot) => {
      //we use onSnapshot cause we need real time data(like isOnline)
      //adding query to snapshot
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub(); //cuase this method is realTime we need to unmount(????)
  }, []);

  return (
    <div className={styles.home_container}>
      <div className={styles.users_container}>
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className={styles.message_container}>
        {chat ? (
          <div className={styles.message_user}>
            <h3>{chat.name}</h3>
          </div>
        ) : (
          <h3 className={styles.no_conv}>
            Select a user to start conversation
          </h3>
        )}
      </div>
    </div>
  );
};

export default Home;
