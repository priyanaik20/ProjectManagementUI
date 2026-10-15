import { useEffect, useState } from "react";
import APIMethods from "../../services/apiService";
import { LoadingSpinner } from "../../components/LoadingStates";
import "../../styles/dashboard.css";
import RecentProjects from "./RecentProjects";
import RecentTasks from "./RecentTasks";
import { projectMetrics } from "../../utils/util";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    APIMethods.getData("/api/dashboard")
      .then((response) => {
        setSummary(response);
      })
      .catch((requestError) => {
        console.error("Error fetching dashboard summary:", requestError);
        setError("Could not load dashboard summary. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadSummary();
  }, []);

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
            onClick={async () => {
              setError("");
              setIsLoading(true);
              await loadSummary();
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-metrics" aria-busy={isLoading}>
        {projectMetrics.map((metric) => {
          const value = summary?.[metric.key];

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
        <RecentProjects />
        <RecentTasks />
      </div>
    </section>
  );
}

export default Dashboard;
