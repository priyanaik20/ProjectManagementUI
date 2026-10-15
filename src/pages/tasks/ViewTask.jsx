import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";
import { useNavigate } from "react-router";
import EmptyState from "../../components/EmptyState";
import "./Tasks.css";
import TaskTable from "../../components/TaskTable";
import Kanbann from "../../components/Kanbann";

function ViewTask() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();
  const handleCreateTask = () => {
    navigate("/create-task");
  };

  const loadTasks = async () => {
    try {
      const response = await APIMethods.getData("/api/taskList");
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoadError("Could not load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    setStatusMessage("");
    setIsDeleteLoading(true);
    try {
      await APIMethods.deleteData(`/api/taskList/${id}`);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => String(task.id) !== String(id)),
      );
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setStatusMessage("Could not delete the task. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <section className="task-screen">
      <div className="task-screen-heading">
        <div>
          <h1>Tasks</h1>
          <p>Track assignments, priorities, and due dates.</p>
        </div>
        <div className="task-heading-actions">
          <div className="task-view-toggle" role="group" aria-label="Task view">
            <button
              type="button"
              className={`task-view-button${viewMode === "list" ? " active" : ""}`}
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
            <button
              type="button"
              className={`task-view-button${viewMode === "kanban" ? " active" : ""}`}
              aria-pressed={viewMode === "kanban"}
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
          </div>
          <button className="task-primary-button" onClick={handleCreateTask}>
            Create task
          </button>
        </div>
      </div>
      {statusMessage && (
        <p className="task-status-message" role="alert">
          {statusMessage}
        </p>
      )}
      {loadError ? (
        <EmptyState
          variant="error"
          title="Tasks could not be loaded"
          message={loadError}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Create a task to start tracking work."
        />
      ) : viewMode === "list" ? (
        <TaskTable
          data={tasks}
          isLoading={isLoading}
          isDeleteLoading={isDeleteLoading}
          onDelete={handleDelete}
        />
      ) : (
        <Kanbann
          data={tasks}
          setData={setTasks}
          setStatusMessage={setStatusMessage}
        />
      )}
    </section>
  );
}

export default ViewTask;
