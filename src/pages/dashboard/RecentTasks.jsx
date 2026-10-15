import { useEffect, useState } from "react";
import APIMethods from "../../services/apiService";
import EmptyState from "../../components/EmptyState";
import { Link } from "react-router-dom";
import { TableSkeletonRows } from "../../components/LoadingStates";

const RecentTasks = () => {
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoadingRecentTasks, setIsLoadingRecentTasks] = useState(true);
  const [recentTasksError, setRecentTasksError] = useState("");

  useEffect(() => {
    APIMethods.getData("/api/taskList/recent")
      .then((response) => {
        if (!response) {
          throw new Error("Recent tasks response must be an array.");
        }
        setRecentTasks(response);
        setRecentTasksError("");
      })
      .catch((requestError) => {
        console.error("Error fetching recent tasks:", requestError);
        setRecentTasksError("Could not load recent tasks.");
      })
      .finally(() => {
        setIsLoadingRecentTasks(false);
      });
  }, []);

  return (
    <section className="dashboard-recent-section">
      <div className="dashboard-recent-heading">
        <div>
          <h2>Recent tasks</h2>
          <p>Your latest task activity</p>
        </div>
        <Link className="dashboard-view-more" to="/view-tasks">
          View more
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      {isLoadingRecentTasks ? (
        <div className="dashboard-recent-table-wrap">
          <table className="dashboard-recent-table" aria-busy="true">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <TableSkeletonRows columns={3} rows={3} />
            </tbody>
          </table>
        </div>
      ) : recentTasksError ? (
        <EmptyState
          variant="error"
          title="Recent tasks unavailable"
          message={recentTasksError}
          action={
            <button
              type="button"
              className="dashboard-empty-retry"
              onClick={() => {
                setRecentTasksError("");
                setIsLoadingRecentTasks(true);
              }}
            >
              Retry
            </button>
          }
        />
      ) : recentTasks.length === 0 ? (
        <EmptyState
          title="No recent tasks"
          message="New tasks will appear here."
        />
      ) : (
        <div className="dashboard-recent-table-wrap">
          <table className="dashboard-recent-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td className="dashboard-recent-primary">{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentTasks;
