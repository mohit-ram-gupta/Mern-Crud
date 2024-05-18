import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError("");
    setLoginSuccess("");

    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.success === true) {
          setLoginSuccess("Login successful");
          sessionStorage.setItem("Id", result.data.user._id);
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome!",
            timer: 2000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          setLoginError("Wrong email or password");
        }
      })
      .catch((err) => console.log(err));
  };

  // This function handles changes in the input fields and clears corresponding errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    } else if (name === "password") {
      setPassword(value);
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
    setLoginError("");
    setLoginSuccess("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-50">
        <h2>
          <center>Login</center>
        </h2>
        <form onSubmit={handleSubmit}>
          {loginSuccess && (
            <center className="text-success mb-3">{loginSuccess}</center>
          )}
          {loginError && (
            <center className="text-danger mb-3">{loginError}</center>
          )}
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={handleInputChange} // Use the combined onChange event handler
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={handleInputChange} // Use the combined onChange event handler
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>
        <p>Don't have an account?</p>
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
