import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

const Status = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("email");
      const url = `http://localhost:5000/user/${email}`;
      try {
        const response = await axios.get(url);
        setStatus(response.data.status);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: "400px" }}>
      <ListGroup variant="flush">
        <ListGroup.Item variant="secondary" className="text-center">
          {status}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Status;
