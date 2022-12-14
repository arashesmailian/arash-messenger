import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//******components
import Photo from "../assets/image1.jpg";
import Camera from "../assets/svg/Camera";
import Delete from "../assets/svg/Delete";
import { storage, db, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";

//******styles
import styles from "./profile.module.css";

const Profile = () => {
  //******states
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const navigate = useNavigate();

  //******functions
  const imgHandler = (e) => {
    setImg(e.target.files[0]);
  };
  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath)); //deleting from storage
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          // updating avatar info in database
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      // getting logged in user info from database
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}` //name is a key of img object
        );
        try {
          if (user.avatarPath) {
            //deleting existing image from database
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img); //uploading to firebase storage
          console.log(snap.ref.fullPath); //name of the image in storage
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath)); //getting image url from storage tp upgrade user info in database
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            //adding user avatar to user info in database
            avatar: url,
            avatarPath: snap.ref.fullPath, // we have to save path because when we want to delete image we want its path
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  return user ? (
    <section>
      <div className={styles.profile_container}>
        <div className={styles.img_container}>
          <img src={user.avatar || Photo} alt="avatar" />
          <div className={styles.overlay}>
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
              <input
                type="file"
                className={styles.file_input}
                id="photo"
                accept="image/*"
                onChange={imgHandler}
              />
            </div>
          </div>
        </div>
        <div className={styles.text_container}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>
            joined on:{" "}
            {
              user.createdAt.toDate().toDateString()
              //you can find createdAt property in user info in database
            }
          </small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
