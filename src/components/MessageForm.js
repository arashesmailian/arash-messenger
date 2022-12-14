import React from "react";

//******components
import Attachment from "../assets/svg/Attachment";

//******styles
import styles from "./message-form.module.css";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className={styles.message_form} onSubmit={handleSubmit}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className={styles.btn}>Send</button>
      </div>
    </form>
  );
};

export default MessageForm;
