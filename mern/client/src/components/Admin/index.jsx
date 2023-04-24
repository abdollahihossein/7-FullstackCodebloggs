import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-page-container">
      <div className="card-container">
        <Link to="/admin-content">
          <Card className="card">
            <Card.Body>
              <Card.Title className="text-center card-title">
                Content Manager
              </Card.Title>
            </Card.Body>
          </Card>
        </Link>

        <Link to="/admin-user">
          <Card className="card">
            <Card.Body>
              <Card.Title className="text-center card-title">
                User Manager
              </Card.Title>
            </Card.Body>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
