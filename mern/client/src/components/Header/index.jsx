import { useState } from "react";
import styles from "./styles.module.css";
import UserDropdown from "./Dropdown";
import { Modal, Button, Form } from "react-bootstrap";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const handleModalToggle = () => setShowModal(!showModal);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    const content = event.target.elements.formPostContent.value;
    console.log("Content:", content);
    const email = localStorage.getItem("email");
    const userResponse = await fetch(`http://localhost:5000/user/${email}`);
    const userData = await userResponse.json();
    const user_id = userData._id;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, user_id }),
    };
    try {
      const response = await fetch(
        "http://localhost:5000/post",
        requestOptions
      );
      const data = await response.json();
      console.log("Post submitted:", data);
    } catch (error) {
      console.error("Error submitting post:", error);
      console.log("Request options:", requestOptions);
    }
    handleModalToggle();
    window.location.reload();
  };

  return (
    <header className={styles.header}>
      <img src="/CodeBloggs logo.png" alt="Logo" className={styles.logo} />
      {/* <h1>CodeBloggs</h1> */}
      <button className={styles.post_btn} onClick={handleModalToggle}>
        Post
      </button>
      <UserDropdown />
      <Modal show={showModal} onHide={handleModalToggle}>
        <Modal.Header closeButton className={styles.modal_header}>
          <Modal.Title style={{ fontSize: "35px", marginLeft: "90px" }}>
            Blogg Something!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modal_body}>
          <Form onSubmit={handlePostSubmit}>
            <Form.Group controlId="formPostContent">
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Button
              className={styles.modal_btn}
              variant="primary"
              type="submit"
            >
              Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;
