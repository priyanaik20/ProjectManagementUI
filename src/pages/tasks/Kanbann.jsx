import { useState } from "react";
import APIMethods from "../../services/apiService";
import { taskStatuses } from "../../utils/util";

function Kanbann(props) {
  const { data, setData, setStatusMessage } = props;
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState(() => new Set());

  const handleTaskDragStart = (taskId) => {
    setDraggedTaskId(taskId);
    setStatusMessage("");
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (event, columnId) => {
    event.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleTaskDrop = async (event, column) => {
    console.log("column", column, event);
    event.preventDefault();
    setDragOverColumn(null);

    setDraggedTaskId(null);
    const task = data.find((item) => String(item.id) === String(draggedTaskId));

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
      setData((currentTasks) =>
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
  return (
    <div className="task-kanban-board-wrap">
      <div className="task-kanban-board">
        {taskStatuses.map((column) => {
          const columnTasks = data.filter(
            (task) => task.status === column.label,
          );

          return (
            <section
              className={`task-kanban-column task-column-${column.id}${dragOverColumn === column.id ? " drag-over" : ""}`}
              key={column.id}
              onDragOver={(event) => handleColumnDragOver(event, column.id)}
              onDragLeave={() => {
                setDragOverColumn(null);
              }}
              onDrop={(event) => handleTaskDrop(event, column)}
            >
              <div className="task-kanban-column-header">
                <h2>{column.label}</h2>
                <span className="task-kanban-count">{columnTasks.length}</span>
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
  );
}

export default Kanbann;
