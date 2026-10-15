import { useEffect, useState } from "react";
import APIMethods from "../../services/apiService";
import EmptyState from "../../components/EmptyState";
import { TableSkeletonRows } from "../../components/LoadingStates";
import { Link } from "react-router-dom";

const RecentProjects = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoadingRecentProjects, setIsLoadingRecentProjects] = useState(true);
  const [recentProjectsError, setRecentProjectsError] = useState("");

  useEffect(() => {
    APIMethods.getData("/api/project/recent")
      .then((response) => {
        if (!response) {
          throw new Error("Recent projects response must be an array.");
        }
        setRecentProjects(response);
        setRecentProjectsError("");
      })
      .catch((requestError) => {
        console.error("Error fetching recent projects:", requestError);
        setRecentProjectsError("Could not load recent projects.");
      })
      .finally(() => {
        setIsLoadingRecentProjects(false);
      });
  }, []);

  return (
    <section className="dashboard-recent-section">
      <div className="dashboard-recent-heading">
        <div>
          <h2>Recent projects</h2>
          <p>Your latest project activity</p>
        </div>
        <Link className="dashboard-view-more" to="/view-projects">
          View more
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      {isLoadingRecentProjects ? (
        <div className="dashboard-recent-table-wrap">
          <table className="dashboard-recent-table" aria-busy="true">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              <TableSkeletonRows columns={3} rows={3} />
            </tbody>
          </table>
        </div>
      ) : recentProjectsError ? (
        <EmptyState
          variant="error"
          title="Recent projects unavailable"
          message={recentProjectsError}
          action={
            <button
              type="button"
              className="dashboard-empty-retry"
              onClick={() => {
                setRecentProjectsError("");
                setIsLoadingRecentProjects(true);
              }}
            >
              Retry
            </button>
          }
        />
      ) : recentProjects.length === 0 ? (
        <EmptyState
          title="No recent projects"
          message="New projects will appear here."
        />
      ) : (
        <div className="dashboard-recent-table-wrap">
          <table className="dashboard-recent-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id}>
                  <td className="dashboard-recent-primary">{project.name}</td>
                  <td>{project.status}</td>
                  <td>{project.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentProjects;
