import React, { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";
import { toast } from "react-hot-toast";

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
        // Prepare data for the API call
        const data = {
          name: editedProfile.username,
          email: editedProfile.email,
          password: editedProfile.password,
          phone: editedProfile.phone,
          address: editedProfile.address,
          userid: user.id,
        };

        // Make API call to update the user profile
        await fetchPost("user/", optionMaker(data, "PATCH", token));
        toast.success("Profile updated successfully!");

        // Update the local state
        setProfile({ ...editedProfile });
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>View Profile</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={isEditing ? editedProfile.username : profile.username}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={isEditing ? editedProfile.password : profile.password}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={isEditing ? editedProfile.email : profile.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={isEditing ? editedProfile.phone : profile.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={isEditing ? editedProfile.address : profile.address}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </label>
      </div>
      <button onClick={handleEditToggle}>
        {isEditing ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  );
};

export default ViewProfile;
