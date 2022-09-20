import React, { useEffect, useState } from "react";

//******components
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"; //onSnapShot is real time but getDoc executed once
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";

//******styles
import styles from "./home.module.css";

const Home = () => {
  //******states
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(""); //user who we chat with
  const [text, setText] = useState(""); //text message content
  const [img, setImg] = useState(""); // for media message
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid; //user who is currently logged in

  //******functions
  const selectUser = (user) => {
    // selecting user from left-side user list
    setChat(user);
    console.log(user);
    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgsRef = collection(db, "messages", id, "chat"); //refering to messages database and chat subcollection
    const q = query(msgsRef, orderBy("createdAt", "asc")); // getting all messages from this user by order of time
    onSnapshot(q, (querySnapshot) => {
      //real-time message listener
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  };

  console.log(msgs, "msgs");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`; //chat ID(unique between two user)

    let url;
    if (img) {
      //if user selected an image
      // for sending images in chat
      const imgRef = ref(
        // creating image reference
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img); //upload image to firebase storage
      const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlurl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      //adding message to message collection with chat subcollection
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });
    setText("");
  };

  useEffect(() => {
    const usersRef = collection(db, "users"); // usersRef now refers to all users
    const q = query(usersRef, where("uid", "not-in", [user1])); // getting all users except onlins's (such as me)
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
          <>
            <div className={styles.message_user}>
              <h3>{chat.name}</h3>
            </div>
            <div className={styles.messages}>
              {msgs.length
                ? msgs.map((msg, i) => <Message key={i} msg={msg} user1={user1} />)
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
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
