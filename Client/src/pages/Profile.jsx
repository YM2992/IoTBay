import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css"; // Import styling

    function Profile() {
      const navigate = useNavigate();
      const [userData, setUserData] = useState({});   // Initialize userData state
      const [activeTab, setActiveTab] = useState("Selling");
      
      useEffect(() => {
        // Simulate API call with setTimeout (1.5 seconds)
        setTimeout(() => {
            const mockUser = {
                username: "Gordon",
                transactions: 0,
                joinedYear: 2020,
                location: "Australia",
                reviews: 0,
                following: 0,
                followers: 0,
                listings: [],
                profilePicture: null, // Use null if no profile picture
            };

            // Store in session storage (mimic API behavior)
            sessionStorage.setItem("userData", JSON.stringify(mockUser));
            setUserData(mockUser);
            setLoading(false);
        }, 1500); // Simulated delay
    }, []);

      return (
        <div className="profile-container">
            <div className="profile-header">
                {/* Left Side - Profile Pic & Info */}
                <div className="profile-left">
                    <div className="profile-image">
                        {userData.profilePicture ? (
                            <img src={userData.profilePicture} alt="Profile" />
                        ) : (
                            <div className="profile-placeholder">GO</div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1>{userData.username}</h1>
                        <p>{userData.transactions} Transactions</p>
                        <p className="joined-info">Joined in {userData.joinedYear} 🌏 {userData.location}</p>
                    </div>
                </div>

                {/* Right Side - Edit Profile Button */}
                <button className="global-btn">Edit Profile</button>
                <button className="global-btn">🔗</button>
            </div>

             {/* NAVIGATION section */}
             <div className="profile-tabs"> 
                {["Listings","Orders History", "Insights", "Reviews"].map((tab) => (
                    <button 
                    key={tab} 
                    className={activeTab == tab ? "active-tab" : ""}
                    onClick={() => console.log(tab)}
                    >
                        {tab}
                    </button>
                ))}
             </div>

            {/* listing section */}
            <div className="profile-listings">
                <div className = "listings-container">
                <p className="listings-header">You don't have any listings right now.</p>
                <button className="global-btn">Create a new listing</button>
                </div>
            </div>
        </div>
      );
    }

export default Profile;
