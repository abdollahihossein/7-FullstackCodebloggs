import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function UserDropdown({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(`http://localhost:5000/user/${email}`);
      const data = await response.json();
      setUserName(`${data.first_name} ${data.last_name}`);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleSettings = () => {
    // Implement your account settings logic here
  };

  return (
    <div className="dropdown">
      <div
        className="dropdown-toggle"
        data-toggle="dropdown"
        data-bs-toggle="dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        {userName}
      </div>
      <ul
        className={`dropdown-menu${isOpen ? " show" : ""}`}
        aria-labelledby="dropdownMenuButton"
      >
        <li>
          <button className="dropdown-item" onClick={handleSettings}>
            Account Settings
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default UserDropdown;
