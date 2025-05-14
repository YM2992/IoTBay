import React, { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-hot-toast";
import "react-tabs/style/react-tabs.css";
import "./ViewProfile.css";

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
  const [tabIndex, setTabIndex] = useState(0);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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

  const handleDeactivateAccount = async () => {
    try {
      await fetchPost(
        "user/deactivate",
        optionMaker({ activate: 0 }, "PATCH", token)
      );
      toast.success("Account deactivated successfully!");
      window.location.href = "/logout";
    } catch (error) {
      toast.error(error.message || "Failed to deactivate account.");
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="view-profile-container">
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Deactivate Account</Tab>
        </TabList>

        {/* Profile Tab */}
        <TabPanel>
          <h1 className="view-profile-title">Profile</h1>
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
        </TabPanel>

        {/* Delete Account Tab */}
        <TabPanel>
          <h1 className="delete-account-title">Deactivate Account</h1>
          <p className="delete-account-warning">
            Deactivating your account is permanent and cannot be undone. Are you
            sure you want to proceed?
          </p>

          <button
            className="deactivate-account-button"
            onClick={handleConfirmDelete}
            // Updated function name
          >
            Deactivate My Account
          </button>

          {showConfirmPopup && (
            <div className="confirm-popup">
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="popup-buttons">
                <button
                  className="confirm-button"
                  onClick={handleDeactivateAccount} // Updated function name
                >
                  Yes, Deactivate
                </button>
                <button className="cancel-button" onClick={handleCancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ViewProfile;
