import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  // redirect to landing page after 3 seconds
  useEffect(() => {
      const timer = setTimeout(() => {
          navigate("/landing");
      }, 3000);
      return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Simulate logout, will change to actual API call
    console.log("Logging out...");
    // Clear user data from session storage
    sessionStorage.removeItem("userData");
  }, []);

  return (
    <div className="logout-container">
    <div className="logout-left">
        
        <div className="logout-content">
            <div className="logout-icon">👋</div>
            <h1 className="logout-h1">Goodbye for now!</h1>
            <p className="redirect-message">
                You've successfully signed out on this device. Sign back in to access your account.
            </p>
            
            <button className="logout-button" onClick={() => navigate("/login")}>
                Sign back in
            </button>
        </div>
    </div>

    <div className="logout-right"></div>
</div>
  );
}

export default Logout;
