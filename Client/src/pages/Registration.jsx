import React, { useState } from "react";
import "./Login.css";
import Input from "../components/Input";
import { json } from "react-router-dom";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const emailInput = document.getElementById("email").value;
  // const passwordInput = document.getElementsByTagName("password").value;

  const handleSubmit = async () => {
    if (email.trim === "" || password.trim === "") return "";
    const data = {
      email,
      password,
    };

    const res = await fetch("http://localhost:8000/api/user/registration/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // if res.status. == fail code != 200
    //asdfsadf
    // got the
    const resData = await res.json();
    console.log(resData.token);
    localStorage.setItem("jwt", resData.token);

    if (res.status === 200) {
      window.location.href = "/welcome";
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };
  //asdfasdf
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <span className="text-xl font-bold text-black">IotBay</span>
          </div>
          <h2 className="welcome-text">Join Now!</h2>
          <p className="info-text">Become a member with us today for FREE.</p>
        </div>

        <div className="input-container">
          <Input field="First Name" />
          <Input field="Username" />
          <Input field="Email" func={setEmail} required />
          <Input field="Password" func={setPassword} />
          <Input field="Confirm Password" required />
        </div>

        <button onClick={handleSubmit} type="submit" className="sign-in-btn">
          Create Account
        </button>

        <p className="contact-us">
          Already a Member? <a href="/login">login here</a>
        </p>
      </div>
    </div>
  );
}

export default Registration;
