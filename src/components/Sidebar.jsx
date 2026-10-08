import { Link } from "react-router";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/view-projects">Projects</Link></li>
        <li><Link to="/create-task">Tasks</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;