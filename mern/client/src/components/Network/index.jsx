import React, { useState, useEffect } from "react";
// import "./Bloggs.css"; // import the CSS file
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

const NetworkPage = () => {
  return (
    <div className="container">
      <div className="center">
        <PostList />
      </div>
    </div>
  );
};

export default NetworkPage;
