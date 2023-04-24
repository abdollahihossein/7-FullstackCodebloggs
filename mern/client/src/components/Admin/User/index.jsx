import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "./UserTable.module.css";
import Skeleton from "react-loading-skeleton"; // Import the skeleton loader component

const UserRow = ({ user, handleEdit, handleDelete }) => (
  <tr>
    <td>{user.first_name}</td>
    <td>{user.last_name}</td>
    <td>
      <button onClick={() => handleEdit(user)}>Edit</button>
      <button onClick={() => handleDelete(user)}>Delete</button>
    </td>
  </tr>
);

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true); // Set the loading state to true before making the fetch request
      try {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false); // Set the loading state to false after the data has been fetched and processed
    }

    fetchUsers();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-user/${user._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.text();
      console.log("Delete user response:", data);

      setUsers(users.filter((u) => u._id !== user._id));
      setFilteredUsers(filteredUsers.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = () => {
    if (searchFirstName || searchLastName) {
      const filtered = users.filter(
        (user) =>
          (searchFirstName
            ? user.first_name
                .toLowerCase()
                .includes(searchFirstName.toLowerCase())
            : true) &&
          (searchLastName
            ? user.last_name
                .toLowerCase()
                .includes(searchLastName.toLowerCase())
            : true)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/update-user/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editUser),
        }
      );
      const data = await response.json();
      console.log("Update user response:", data);

      const response2 = await fetch("http://localhost:5000/users");
      const data2 = await response2.json();
      console.log("Fetched users:", data2);
      setUsers(data2);
      setFilteredUsers(data2);

      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((editUser) =>
      editUser ? { ...editUser, [name]: value } : null
    );
  };

  // Define the skeleton loader component
  const SkeletonLoader = () => (
    <tbody>
      {Array(10)
        .fill()
        .map((_, index) => (
          <tr key={index}>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>
        ))}
    </tbody>
  );

  return (
    <div className={styles.container}>
      {loading ? ( // Conditional rendering that shows either the skeleton loader or the actual content depending on the loading state
        <SkeletonLoader />
      ) : (
        <>
          <h3>User List</h3>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <table className="table table-striped" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editUser?.first_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editUser?.last_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Save Changes</button>
              </form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
