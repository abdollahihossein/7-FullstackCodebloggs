import React, { useState, useEffect } from "react";
import Initials from "./Avatar";
import UserInfo from "./Info";
import Status from "./Status";
import styles from "./HomePage.module.css";
import PostList from "./List";
import axios from "axios";

const UserName = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("email");
      const url = `http://localhost:5000/user/${email}`;
      try {
        const response = await axios.get(url);
        const { first_name, last_name } = response.data;
        const name = `${first_name} ${last_name}`;
        setUserName(name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return userName;
};

const HomePage = () => {
  const userName = UserName();

  return (
    <div>
      <div className={styles.container}>
        <div style={{ flex: 1 }}>
          <div className={styles.flexContainer}>
            <div className={`${styles.initialsContainer}`}>
              <Initials name={userName} />
            </div>
          </div>
          <div className={styles.flexContainer}>
            <div className={`${styles.statusContainer}`}>
              <Status />
            </div>
          </div>
          <div className={styles.flexContainer}>
            <div className={`${styles.userInfoContainer}`}>
              <UserInfo />
            </div>
          </div>
        </div>
        <div className={`${styles.secondColumn}`} style={{ flex: 1 }}>
          <div className={styles.flexContainer}>
            <div className={`${styles.initialsContainer}`}>
              <PostList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
