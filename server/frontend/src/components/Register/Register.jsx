import React, { useState } from "react";

import closeIcon from "../assets/close.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import userIcon from "../assets/person.png";
import "./Register.css";


const Register = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (event) => {
    event.preventDefault();
    const response = await fetch(
      window.location.origin + "/djangoapp/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          firstName,
          lastName,
          email,
          password,
        }),
      }
    );
    const result = await response.json();
    if (response.ok && result.status === "Authenticated") {
      sessionStorage.setItem("username", result.userName);
      sessionStorage.setItem("firstname", result.firstName);
      sessionStorage.setItem("lastname", result.lastName);
      window.location.href = "/";
      return;
    }
    if (result.error === "Already Registered") {
      alert("A user with this username is already registered.");
      return;
    }
    alert(result.error || "Registration could not be completed.");
  };

  return (
    <main className="register_container" style={{ width: "50%" }}>
      <div
        className="header"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span className="text">Sign Up</span>
        <a href="/" aria-label="Close registration">
          <img style={{ width: "1cm" }} src={closeIcon} alt="Close" />
        </a>
      </div>
      <form onSubmit={register}>
        <div className="inputs">
          <label className="input">
            <img src={userIcon} className="img_icon" alt="" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input_field"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
            />
          </label>
          <label className="input">
            <img src={userIcon} className="img_icon" alt="" />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="input_field"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </label>
          <label className="input">
            <img src={userIcon} className="img_icon" alt="" />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="input_field"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </label>
          <label className="input">
            <img src={emailIcon} className="img_icon" alt="" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input_field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="input">
            <img src={passwordIcon} className="img_icon" alt="" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input_field"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="4"
              required
            />
          </label>
        </div>
        <div className="submit_panel">
          <input className="submit" type="submit" value="Register" />
        </div>
      </form>
    </main>
  );
};

export default Register;
