import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import APIMethods from "../services/apiService";
import { LoadingSpinner, TableSkeletonRows } from "../components/LoadingStates";
import EmptyState from "../components/EmptyState";
import "./Dashboard.css";
import tasks from "../assets/tasks.png";
import projects from "../assets/projects.png";
import completedTasks from "../assets/completedTasks.png";
import pendingTasks from "../assets/pendingTasks.png";

const metrics = [
  {
    key: "totalProjects",
    label: "Total projects",
    aliases: ["totalprojects", "totalprojectcount", "projectcount"],
    icon: projects,
    tone: "purple",
  },
  {
    key: "totalTasks",
    label: "Total tasks",
    aliases: ["totaltasks", "totaltaskcount", "taskcount"],
    icon: tasks,
    tone: "blue",
  },
  {
    key: "pendingTasks",
    label: "Pending tasks",
    aliases: ["pendingtasks", "pendingtaskcount", "totaltodotasks"],
    icon: pendingTasks,
    tone: "amber",
  },
  {
    key: "completedTasks",
    label: "Completed tasks",
    aliases: ["completedtasks", "completedtaskcount", "completetasks"],
    icon: completedTasks,
    tone: "green",
  },
];

function readCollection(response, keys) {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === "object") {
    const entry = Object.entries(response).find(([key]) =>
      keys.includes(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
    );

    if (entry && Array.isArray(entry[1])) {
      return entry[1];
    }
  }

  return null;
}

function readField(item, ...keys) {
  if (!item || typeof item !== "object") return "";
  const targetKeys = keys.map((key) => key.toLowerCase());
  const entry = Object.entries(item).find(([key]) =>
    targetKeys.includes(key.toLowerCase()),
  );

  return entry?.[1] ?? "";
}

function readMetric(summary, aliases) {
  const entry = Object.entries(summary).find(([key]) =>
    aliases.includes(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );

  if (
    !entry ||
    entry[1] === null ||
    entry[1] === undefined ||
    entry[1] === ""
  ) {
    return null;
  }

  const value = Number(entry[1]);
  return Number.isFinite(value) ? value : null;
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoadingRecentProjects, setIsLoadingRecentProjects] = useState(true);
  const [isLoadingRecentTasks, setIsLoadingRecentTasks] = useState(true);
  const [recentProjectsError, setRecentProjectsError] = useState("");
  const [recentTasksError, setRecentTasksError] = useState("");
  const [projectsRetryKey, setProjectsRetryKey] = useState(0);
  const [tasksRetryKey, setTasksRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    APIMethods.getData("/api/dashboard")
      .then((response) => {
        if (isMounted) {
          setSummary(response);
        }
      })
      .catch((requestError) => {
        console.error("Error fetching dashboard summary:", requestError);
        if (isMounted) {
          setError("Could not load dashboard summary. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  useEffect(() => {
    let isMounted = true;

    APIMethods.getData("/api/project/recent")
      .then((response) => {
        const projects = readCollection(response, [
          "recentprojects",
          "projects",
          "items",
          "data",
        ]);
        if (!projects) {
          throw new Error("Recent projects response must be an array.");
        }
        if (isMounted) {
          setRecentProjects(projects);
          setRecentProjectsError("");
        }
      })
      .catch((requestError) => {
        console.error("Error fetching recent projects:", requestError);
        if (isMounted) {
          setRecentProjectsError("Could not load recent projects.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingRecentProjects(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [projectsRetryKey]);

  useEffect(() => {
    let isMounted = true;

    APIMethods.getData("/api/taskList/recent")
      .then((response) => {
        const tasks = readCollection(response, [
          "recenttasks",
          "tasks",
          "items",
          "data",
        ]);
        if (!tasks) {
          throw new Error("Recent tasks response must be an array.");
        }
        if (isMounted) {
          setRecentTasks(tasks);
          setRecentTasksError("");
        }
      })
      .catch((requestError) => {
        console.error("Error fetching recent tasks:", requestError);
        if (isMounted) {
          setRecentTasksError("Could not load recent tasks.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingRecentTasks(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [tasksRetryKey]);

  const summaryIsValid =
    summary !== null && typeof summary === "object" && !Array.isArray(summary);
  const metricValues = summaryIsValid
    ? metrics.map((metric) => ({
        ...metric,
        value: readMetric(summary, metric.aliases),
      }))
    : [];
  const missingMetrics = metricValues.filter((metric) => metric.value === null);

  return (
    <section className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>A quick snapshot of projects and task progress.</p>
        </div>
      </header>

      {error && (
        <div className="dashboard-message error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsLoading(true);
              setRetryKey((key) => key + 1);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && !summaryIsValid && (
        <p className="dashboard-message error" role="alert">
          Dashboard returned an invalid summary.
        </p>
      )}

      {!isLoading && !error && missingMetrics.length > 0 && (
        <p className="dashboard-message warning" role="status">
          Some dashboard totals are missing from the response.
        </p>
      )}

      <div className="dashboard-metrics" aria-busy={isLoading}>
        {metrics.map((metric, index) => {
          const value = metricValues[index]?.value;

          return (
            <article
              className={`dashboard-metric-card dashboard-metric-${metric.tone}`}
              key={metric.key}
            >
              <div className="dashboard-metric-top">
                <span className="dashboard-metric-label">{metric.label}</span>
                <span className="dashboard-metric-icon" aria-hidden="true">
                  <img src={metric.icon} height={23} width={23} />
                </span>
              </div>
              {isLoading ? (
                <span
                  className="dashboard-metric-skeleton"
                  aria-hidden="true"
                />
              ) : (
                <strong className="dashboard-metric-value">
                  {value === null || value === undefined
                    ? "—"
                    : value.toLocaleString()}
                </strong>
              )}
            </article>
          );
        })}
      </div>

      {isLoading && (
        <div className="dashboard-loading-note">
          <LoadingSpinner label="Loading dashboard..." />
        </div>
      )}

      <div className="dashboard-recent-grid">
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
                    setProjectsRetryKey((key) => key + 1);
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
                  {recentProjects.map((project, index) => (
                    <tr
                      key={
                        readField(project, "id", "projectId") ||
                        `project-${index}`
                      }
                    >
                      <td className="dashboard-recent-primary">
                        {readField(project, "name", "projectName") ||
                          "Untitled project"}
                      </td>
                      <td>{readField(project, "status") || "—"}</td>
                      <td>
                        {readField(
                          project,
                          "endDate",
                          "dueDate",
                          "createdAt",
                        ) || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

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
                    setTasksRetryKey((key) => key + 1);
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
                  {recentTasks.map((task, index) => (
                    <tr
                      key={readField(task, "id", "taskId") || `task-${index}`}
                    >
                      <td className="dashboard-recent-primary">
                        {readField(task, "title", "taskName", "name") ||
                          "Untitled task"}
                      </td>
                      <td>{readField(task, "status") || "—"}</td>
                      <td>{readField(task, "priority") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
