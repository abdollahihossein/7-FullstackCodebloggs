import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("email");
      const url = `http://localhost:5000/user/${email}`;
      try {
        const response = await axios.get(url);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const propertiesToRender = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "birthday", label: "Birthday" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "occupation", label: "Occupation" },
  ];

  return (
    <div style={{ width: "400px" }}>
      <ListGroup variant="flush">
        {user &&
          propertiesToRender.map(({ key, label }) => (
            <ListGroup.Item
              key={key}
              variant="secondary"
              className="text-center"
            >
              {label}: {user[key]}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default UserInfo;
