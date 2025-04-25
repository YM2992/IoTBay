import ProfileTabs from "../components/ProfileTabs";
import { RxAvatar } from "react-icons/rx";

import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import "./profile.css";

// Old version moved to bottom

function Profile() {
  const { user } = useContext(AppContext);
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

// function Profile() {
//   const [userData, setUserData] = useState({});
//   const [activeTab, setActiveTab] = useState("Selling");
//   const { user } = useContext(AuthContext);
//   console.log(user);

//   return (
//     <div className="profile-container">
//       <div className="profile-header">
//         {/* Left Side - Profile Pic & Info */}
//         <div className="profile-left">
//           <div className="profile-image">
//             {userData.profilePicture ? (
//               <img src={userData.profilePicture} alt="Profile" />
//             ) : (
//               <div className="profile-placeholder">GO</div>
//             )}
//           </div>
//           <div className="profile-info">
//             <h1>{userData.username}</h1>
//             <p>{userData.transactions} Transactions</p>
//             <p className="joined-info">
//               Joined in {userData.joinedYear} 🌏 {userData.location}
//             </p>
//           </div>
//         </div>

//         {/* Right Side - Edit Profile Button */}
//         <button className="global-btn">Edit Profile</button>
//         <button className="global-btn">🔗</button>
//       </div>

//       {/* NAVIGATION section */}
//       <div className="profile-tabs">
//         {["Listings", "Orders History", "Insights", "Reviews"].map((tab) => (
//           <button
//             key={tab}
//             className={activeTab == tab ? "active-tab" : ""}
//             onClick={() => console.log(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* listing section */}
//       <div className="profile-listings">
//         <div className="listings-container">
//           <p className="listings-header">You don't have any listings right now.</p>
//           <button className="global-btn">Create a new listing</button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default Profile;
