import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { isEmail } from "validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const toastError = () => {
  toast.error("Invalid Email", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });
};

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/signup";
      // Validate form fields
      if (
        !data.firstName ||
        !data.lastName ||
        !isEmail(data.email) ||
        !data.dateOfBirth ||
        !data.password ||
        !data.occupation ||
        !data.location
      ) {
        toastError();
        return;
      }
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Registration</h1>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
                maxLength={20}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
                maxLength={20}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Occupation"
                name="occupation"
                onChange={handleChange}
                value={data.occupation}
                required
                className={styles.input}
                maxLength={50}
              />
              <input
                type="text"
                placeholder="Location"
                name="location"
                onChange={handleChange}
                value={data.location}
                required
                className={styles.input}
                maxLength={20}
              />
              <DatePicker
                placeholderText="Date of Birth"
                name="dateOfBirth"
                selected={data.dateOfBirth}
                onChange={(date) => setData({ ...data, dateOfBirth: date })}
                required
                className={styles.input}
              />
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Register
            </button>
            <p>
              Already a member?{" "}
              <Link to="/login" className={styles.signup_link}>
                Login now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
