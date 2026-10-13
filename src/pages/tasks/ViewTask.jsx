import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";
import { useNavigate } from "react-router";
function ViewTask() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const fetchTasks = async () => {
    try {
      const response = await APIMethods.getData("/api/taskList");
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = () => {
    navigate("/create-task");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <h2>View Task</h2>
      <button onClick={handleCreateTask}>Create task</button>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid black",
        }}
      >
        <th style={{ border: "1px solid black", padding: "8px" }}>Title</th>
        <th style={{ border: "1px solid black", padding: "8px" }}>
          Description
        </th>
        <th style={{ border: "1px solid black", padding: "8px" }}>Due Date</th>
        <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
        <th style={{ border: "1px solid black", padding: "8px" }}>Priority</th>
        <th style={{ border: "1px solid black", padding: "8px" }}>Project</th>
        <th style={{ border: "1px solid black", padding: "8px" }}>
          Assigned To
        </th>
        <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.title}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.description}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.dueDate}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.status}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.priority}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.projectId}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {task.assignedTo}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default ViewTask;
