import { useNavigate } from "react-router";
import APIMethods from "../services/apiService";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const UserProfile = (props) => {
  const { setLogoutError } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    setLogoutError("");

    try {
      await APIMethods.postData("/api/logout");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
      setLogoutError("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className="profile-menu-container"
      onMouseEnter={() => setShowProfile(true)}
      onMouseLeave={() => setShowProfile(false)}
      onFocus={() => setShowProfile(true)}
    >
      <div className="header-user" aria-label="ProjectFlow workspace">
        <button
          className="profile-circle"
          type="button"
          aria-label="Open profile menu"
          aria-expanded={showProfile}
          aria-haspopup="true"
        >
          {initials || "U"}
        </button>
      </div>
      {showProfile && (
        <div className="profile-dropdown">
          <h4>{user?.name || "User"}</h4>
          <p>{user?.email}</p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
