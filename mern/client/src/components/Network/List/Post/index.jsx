import React, { useState, useEffect } from "react";
import "./UserCard.css";
import Initials from "../../Avatar";

const UserCard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`http://localhost:5000/users`);
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="users-container">
      {users.map((user, index) => (
        <div key={user._id} className="user-container">
          <div className="initials-container">
            <Initials name={`${user.first_name} ${user.last_name}`} />
            <div className="user-status">{user.status}</div>
          </div>
          <div className="user-card">
            <div className="user-card__name">
              <strong>First Name:</strong> {user.first_name}
            </div>
            <div className="user-card__name">
              <strong>Last Name:</strong> {user.last_name}
            </div>
            <div className="user-card__birthday">
              <strong>Birthday:</strong> {user.birthday}
            </div>
            <div className="user-card__email">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="user-card__location">
              <strong>Location:</strong> {user.location}
            </div>
            <div className="user-card__occupation">
              <strong>Occupation:</strong> {user.occupation}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCard;
