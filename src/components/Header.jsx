import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import APIMethods from "../services/apiService";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/view-projects": "Projects",
  "/new-project": "New project",
  "/view-tasks": "Tasks",
  "/create-task": "Create task",
  "/edit-project": "Edit project",
  "/edit-task": "Edit task",
};

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const pageTitle =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(`${path}/`),
    )?.[1] ||
    "Project workspace";
  const { user } = useAuth();
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
    <header className="app-header">
      <div className="header-brand">
        <span className="header-brand-mark" aria-hidden="true">
          PM
        </span>
        <span className="header-brand-name">ProjectFlow</span>
      </div>

      <div className="header-page-title">{pageTitle}</div>

      {logoutError && (
        <span className="header-logout-error" role="alert">
          {logoutError}
        </span>
      )}

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
    </header>
  );
}

export default Header;
