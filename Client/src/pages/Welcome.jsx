import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching user session data, will change to actual API call
    setTimeout(() => {
      setUserData({
        username: "TestUser",
        email: "test@example.com",
        role: "Admin",
      });
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Redirect after 3 seconds
    if (userData) {
      console.log("redirecting to main page after 3 seconds ...");
      const timer = setTimeout(() => {
        navigate("/main", { state: userData });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userData, navigate]);

  return (
    <div className="welcome-container">
      {loading ? (
        <p className="loading">Loading user data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h1 className="welsome-h1">Welcome, {userData.username}!</h1>
          <p className="welcome-p">Email: {userData.email}</p>
          <p className="welcome-p">Role: {userData.role}</p>
          <p className="redirect-message">Redirecting to the main page...</p>
        </>
      )}
    </div>
  );
}

export default Welcome;
