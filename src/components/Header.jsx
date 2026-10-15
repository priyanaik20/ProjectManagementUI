import { useState } from "react";
import "../styles/header.css";
import UserProfile from "./UserProfile";

function Header() {
  const [logoutError, setLogoutError] = useState("");

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-brand-mark" aria-hidden="true">
          PM
        </span>
        <span className="header-brand-name">ProjectFlow</span>
      </div>

      {logoutError && (
        <span className="header-logout-error" role="alert">
          {logoutError}
        </span>
      )}

      <UserProfile setLogoutError={setLogoutError} />
    </header>
  );
}

export default Header;
