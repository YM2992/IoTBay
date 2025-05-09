import { useContext } from "react";
import { RxAvatar } from "react-icons/rx";
import ProfileTabs from "../components/ProfileTabs";
import { AppContext } from "@/context/AppContext";
import "./profile.css";

function Profile() {
  const { user } = useContext(AppContext);
  const { name } = user;

  const navigateToViewProfile = () => {
    window.location.href = "/view-profile";
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <div className="profile-image">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <RxAvatar className="profile-avatar" />
            )}
          </div>
          <div className="profile-info">
            <h2>{name}</h2>
            <p>0 Transactions</p>
            <p>Joined in 2025</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-btn" onClick={navigateToViewProfile}>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="tabs-wrapper">
        <ProfileTabs />
      </div>
    </div>
  );
}

export default Profile;
