import { useContext } from "react";
import { RxAvatar } from "react-icons/rx";
import ProfileTabs from "../components/ProfileTabs";
import { AuthContext } from "../main";
import "./profile.css";

function Profile() {
  const { user } = useContext(AuthContext);
  const { name } = user;

  return (
    <div className="profile-page">
      {/* Top Profile Info */}
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
            <p> 0 Transactions</p>
            <p>Joined in 2025</p> 
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-wrapper">
        <ProfileTabs />
      </div>


    </div>
  );
}

export default Profile;
