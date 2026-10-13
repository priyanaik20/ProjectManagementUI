import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";
import { useNavigate } from "react-router";
import { TASK_STATUSES } from "./taskStatuses";
import EmptyState from "../../components/EmptyState";
import {
  //   KanbanSkeleton,
  LoadingSpinner,
  TableSkeletonRows,
} from "../../components/LoadingStates";
import "./Tasks.css";
function ViewTask() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState(() => new Set());
  const [deletingTaskIds, setDeletingTaskIds] = useState(() => new Set());
  const [statusMessage, setStatusMessage] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const navigate = useNavigate();
  const handleCreateTask = () => {
    navigate("/create-task");
  };

  const handleTaskDragStart = (event, taskId) => {
    // event.dataTransfer.effectAllowed = "move";
    // event.dataTransfer.setData("text/plain", String(taskId));
    setDraggedTaskId(taskId);
    setStatusMessage("");
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (event, columnId) => {
    event.preventDefault();
    // event.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleTaskDrop = async (event, column) => {
    console.log("column", column, event);
    event.preventDefault();
    setDragOverColumn(null);

    const droppedTaskId =
      event.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);
    const task = tasks.find(
      (item) => String(item.id) === String(droppedTaskId),
    );

    if (!task || task.status === column.label) {
      return;
    }

    if (updatingTaskIds.has(task.id)) {
      return;
    }

    setUpdatingTaskIds((currentIds) => new Set(currentIds).add(task.id));
    
    setStatusMessage("");

    try {
      await APIMethods.updateData(`/api/taskList/${task.id}`, {
        ...task,
        status: column.label,
      });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? { ...currentTask, status: column.label }
            : currentTask,
        ),
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setStatusMessage(
        `Could not move "${task.title || "task"}". Please try again.`,
      );
    } finally {
      setUpdatingTaskIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(task.id);
        return nextIds;
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const response = await APIMethods.getData("/api/taskList");
        if (isMounted) {
          setTasks(response);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (isMounted) {
          setLoadError("Could not load tasks. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [dataChanged]);

  const handleDelete = async (id) => {
    setStatusMessage("");
    setDeletingTaskIds((currentIds) => new Set(currentIds).add(String(id)));
    try {
      await APIMethods.deleteData(`/api/taskList/${id}`);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => String(task.id) !== String(id)),
      );
      setDataChanged(true);
    } catch (error) {
      console.error("Error deleting task:", error);
      setStatusMessage("Could not delete the task. Please try again.");
    } finally {
      setDeletingTaskIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(String(id));
        return nextIds;
      });
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
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
      {viewMode === "list" ? (
        isLoading ? (
          <div className="task-table-wrap">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody aria-busy="true">
                <TableSkeletonRows columns={8} rows={6} />
              </tbody>
            </table>
          </div>
        ) : loadError ? (
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
        ) : (
          <div className="task-table-wrap">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{task.projectId}</td>
                    <td>{task.assignedTo}</td>
                    <td>
                      <div className="task-actions">
                        <button
                          className="task-secondary-button"
                          onClick={() => handleEdit(task.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="task-danger-button"
                          onClick={() => handleDelete(task.id)}
                          disabled={deletingTaskIds.has(String(task.id))}
                        >
                          {deletingTaskIds.has(String(task.id)) ? (
                            <LoadingSpinner label="Deleting..." />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : loadError ? (
        <p className="task-status-message" role="alert">
          {loadError}
        </p>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Create a task to add work to the Kanban board."
          action={
            <button
              className="task-primary-button"
              type="button"
              onClick={handleCreateTask}
            >
              Create task
            </button>
          }
        />
      ) : (
        <div className="task-kanban-board-wrap">
          <div className="task-kanban-board">
            {TASK_STATUSES.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.label,
              );

              return (
                <section
                  className={`task-kanban-column task-column-${column.id}${dragOverColumn === column.id ? " drag-over" : ""}`}
                  key={column.id}
                  onDragOver={(event) => handleColumnDragOver(event, column.id)}
                  onDragLeave={() => {
                    // if (!event.currentTarget.contains(event.relatedTarget)) {
                    //   console.log(event);
                    setDragOverColumn(null);
                    // }
                  }}
                  onDrop={(event) => handleTaskDrop(event, column)}
                >
                  <div className="task-kanban-column-header">
                    <h2>{column.label}</h2>
                    <span className="task-kanban-count">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="task-kanban-cards">
                    {columnTasks.length === 0 ? (
                      <p className="task-kanban-empty">No tasks here</p>
                    ) : (
                      columnTasks.map((task) => (
                        <article
                          className={`task-kanban-card${draggedTaskId === task.id ? " dragging" : ""}`}
                          key={task.id}
                          draggable={!updatingTaskIds.has(task.id)}
                          onDragStart={(event) =>
                            handleTaskDragStart(event, task.id)
                          }
                          onDragEnd={handleTaskDragEnd}
                          aria-label={`Task: ${task.title || "Untitled task"}. Drag to change status.`}
                        >
                          <div className="task-kanban-card-top">
                            <h3>{task.title || "Untitled task"}</h3>
                            <span
                              className={`task-priority-badge task-priority-${String(task.priority || "normal").toLowerCase()}`}
                            >
                              {task.priority || "No priority"}
                            </span>
                            {updatingTaskIds.has(task.id) && (
                              <span className="task-saving-indicator">
                                Saving...
                              </span>
                            )}
                          </div>

                          {task.description && <p>{task.description}</p>}
                          <div className="task-kanban-card-meta">
                            {task.dueDate && <span>Due {task.dueDate}</span>}
                            {task.projectId && (
                              <span>Project {task.projectId}</span>
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default ViewTask;
