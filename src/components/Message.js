import React, { useRef, useEffect } from "react";
import Moment from "react-moment"; //for getting online message

//******styles
import styles from "./message.module.css";

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef(); // we implement this because we want to scroll down automatically when new message arrives

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`${styles.message_wrapper} ${
        msg.from === user1 ? styles.own : ""
      }`}
      ref={scrollRef}
    >
      <p className={`${msg.from === user1 ? styles.me : styles.friend}`}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export default Message;
