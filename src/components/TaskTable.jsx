import { useNavigate } from "react-router";
import { LoadingSpinner, TableSkeletonRows } from "./LoadingStates";

function TaskTable(props) {
  const { data, isLoading, isDeleteLoading, onDelete } = props;
  const navigate = useNavigate();

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
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
          {data.map((task) => (
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
                    onClick={() => onDelete(task.id)}
                  >
                    {isDeleteLoading ? (
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
  );
}
export default TaskTable;
