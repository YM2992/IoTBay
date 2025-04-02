import ProfileTabs from "../components/ProfileTabs";
import { RxAvatar } from "react-icons/rx";

import { AuthContext } from "../main";
import { useContext } from "react";

function Test() {
  const { user } = useContext(AuthContext);
  const { name } = user;
  console.log(user);

  return (
    <div className="profile-container">
      <div className="profile-left" style={{ marginBottom: "2rem" }}>
        <div className="profile-image">
          {user.profilePicture ? <img src={user.profilePicture} alt="Profile" /> : <RxAvatar />}
        </div>
        <div style={{ textAlign: "left" }}>
          <h1>{name}</h1>
          <p>{user.transactions} Transactions</p>
          <p className="joined-info">
            Joined in {user.joinedYear} 🌏 {user.location}
          </p>
        </div>
      </div>
      <ProfileTabs></ProfileTabs>
    </div>
  );
}

export default Test;
