import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  // userData	Stores the logged-in user session data	null
  // loading	Tracks whether data is still being fetched	true
  // error	Stores error messages if the session fetch fails	null
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // will change to actual API call
  // useEffect(() => {
  //   const fetchSessionData = async () => {
  //     try {
  //       // Simulate fetching user session data, will change to actual API call
  //       const response = await fetch("http://localhost:8000/api/user/session", {
  //         method: "GET",
  //         credentials: "include"
  //     });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user session data");
  //       }

  //       const data = await response.json();
  //       sessionStorage.setItem("userData", JSON.stringify(data)); //store user data in session storage
  //       setUserData(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setloading{false};
  //     }
  //   };

  //   fetchSessionData();
  // });

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
    // display user data if available, else display loading or error message
    // redirect to main page after 3 seconds
    <div className="welcome-container">
      {loading ? (
        <p className="loading">Loading user data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div className="welcome-accent welcome-accent-top-left"></div>
          <div className="welcome-accent welcome-accent-bottom-right"></div>
          <h1 className="welcome-h1">Hello, {userData.username}!</h1>
          <p className="welcome-p">Good to see you</p>
          <p className="welcome-p">Role: {userData.role}</p>
          <button className="welcome-button" onClick={() => navigate("/main", { state: userData })}>
            Go to Main Page
          </button>
          <p className="redirect-message"> Redirecting to the main page<span className="dots"></span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Welcome;
