import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementsByTagName("password").value;

  const handleSubmit = (e) => {
    e.preventDefault();

    // write me some code in NodeJS that makes a POST request to '[API PATH]'
    // POST request for user validation
    axios
      .post("example url/data", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Data posted successfully: ", response.data);
      })
      .catch((error) => {
        console.log("Error posting data: ", error);
      });

    //hard coded for now, but need to replace with api logic
    if (email === "admin@example.com" && password === "password123") {
      alert("Login successful!");
      setError("");
      navigate("/main");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <span className="text-xl font-bold text-black">IotBay</span>
          </div>
          <h2 className="welcome-text">Welcome!</h2>
          <p className="info-text">Please sign in to your account below</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="sign-in-btn">
            Sign in
          </button>
        </form>

        <p className="contact-us">
          Having problems? <a href="#">Contact us</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
