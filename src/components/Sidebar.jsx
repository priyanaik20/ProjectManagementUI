import { NavLink, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

const navigationItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "▦",
    activePaths: ["/dashboard"],
  },
  {
    to: "/view-projects",
    label: "Projects",
    icon: "◫",
    activePaths: ["/view-projects", "/new-project", "/edit-project"],
  },
  {
    to: "/view-tasks",
    label: "Tasks",
    icon: "✓",
    activePaths: ["/view-tasks", "/create-task", "/edit-task"],
  },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        <ul className="sidebar-nav">
          {navigationItems.map(({ to, label, icon, activePaths }) => {
            const isSelected = activePaths.some((path) =>
              pathname.startsWith(path),
            );

            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={`sidebar-link${isSelected ? " active" : ""}`}
                  aria-current={isSelected ? "page" : undefined}
                >
                  <span className="sidebar-link-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <span>{label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
