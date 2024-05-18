import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [about, setAbout] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!about.trim()) {
      newErrors.about = "About is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post("http://localhost:3001/register", {
        name,
        email,
        password,
        position,
        about,
      })
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Register Successful",
          text: "Welcome!",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  // This function handles changes in the input fields and clears corresponding errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "position":
        setPosition(value);
        break;
      case "about":
        setAbout(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-50">
        <h2>
          <center>Sign Up</center>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              value={name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="position">
              <strong>Position</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Position"
              name="position"
              className="form-control rounded-0"
              value={position}
              onChange={handleInputChange}
            />
            {errors.position && (
              <div className="text-danger">{errors.position}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="about">
              <strong>About</strong>
            </label>
            <input
              type="text"
              placeholder="Enter About"
              name="about"
              className="form-control rounded-0"
              value={about}
              onChange={handleInputChange}
            />
            {errors.about && <div className="text-danger">{errors.about}</div>}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign Up
          </button>
        </form>
        <p>Already have an account?</p>
        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
