import React, { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";
import { toast } from "react-hot-toast";
import "./ViewProfile.css"; // Assuming you have a CSS file for styling

const ViewProfile = () => {
  const { user, token } = useContext(AppContext);
  const { name, email, password, address, phone } = user;

  const [profile, setProfile] = useState({
    username: name,
    password: password,
    email: email,
    phone: phone,
    address: address,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const data = {
          name: editedProfile.username,
          email: editedProfile.email,
          password: editedProfile.password,
          phone: editedProfile.phone,
          address: editedProfile.address,
          userid: user.id,
        };

        await fetchPost("user/", optionMaker(data, "PATCH", token));
        toast.success("Profile updated successfully!");
        setProfile({ ...editedProfile });
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="view-profile-container">
      <h1 className="view-profile-title">View Profile</h1>
      <div className="view-profile-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={isEditing ? editedProfile.username : profile.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={isEditing ? editedProfile.password : profile.password}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={isEditing ? editedProfile.email : profile.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={isEditing ? editedProfile.phone : profile.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={isEditing ? editedProfile.address : profile.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
          />
        </div>
        <button onClick={handleEditToggle} className="form-button">
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ViewProfile;
