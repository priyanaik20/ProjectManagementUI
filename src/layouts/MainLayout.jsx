import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/main-layout.css";

function MainLayout() {
  const { pathname } = useLocation();
  const isDataView = ["/view-projects", "/view-tasks"].includes(pathname);

  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main
          className={`main-content${isDataView ? " main-content-data-view" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
