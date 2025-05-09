import React, { useState } from "react";

const ViewProfile = () => {
  const [profile, setProfile] = useState({
    username: "JohnDoe",
    password: "********",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, City, Country",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setProfile({ ...editedProfile });
    }
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
