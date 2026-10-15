import { useEffect, useState } from "react";
import APIMethods from "../services/apiService";
import FormItem from "./FormItem";
import { LoadingSpinner } from "./LoadingStates";
import { useNavigate } from "react-router";
import { priorityOptions, taskStatuses } from "../utils/util";

function TaskForm({ tasks }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    title: tasks?.title || "",
    projectId: tasks?.projectId || "",
    priority: tasks?.priority || "",
    dueDate: tasks?.dueDate || "",
    status: tasks?.status || "Backlog",
    description: tasks?.description || "",
    assignedTo: tasks?.assignedTo || "",
    createdBy: tasks?.createdBy || "1",
    createdAt: tasks?.createdAt || new Date().toISOString(),
  });
  const navigate = useNavigate();

  const handleChangeEvent = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  const loadProjects = async () => {
    try {
      const response = await APIMethods.getData("/api/project");
      setProjects(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await APIMethods.getData("/api/user");
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  useEffect(() => {
    setFormData({
      title: tasks?.title || "",
      projectId: tasks?.projectId || "",
      priority: tasks?.priority || "",
      dueDate: tasks?.dueDate || "",
      status: tasks?.status || "Backlog",
      description: tasks?.description || "",
      assignedTo: tasks?.assignedTo || "",
      createdBy: tasks?.createdBy || "1",
      createdAt: tasks?.createdAt || new Date().toISOString(),
    });
  }, [tasks]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (tasks) {
        await APIMethods.updateData(`/api/taskList/${tasks.id}`, formData);
      } else {
        await APIMethods.postData("/api/taskList", formData);
      }
      navigate("/view-tasks");
    } catch {
      setSubmitError("Could not save the task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return <LoadingSpinner label="Saving..." />;
    } else {
      return `${!tasks ? "Create" : "Update"} Task`;
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h1>Task details</h1>
      <div className="task-form-row">
        <FormItem id="taskName" label="Task Name" isRequired>
          <input
            type="text"
            id="taskName"
            required
            placeholder="Enter task name"
            value={formData.title}
            onChange={(e) => handleChangeEvent(e.target.value, "title")}
          />
        </FormItem>
        <FormItem id="project" label="Project" isRequired>
          <select
            id="project"
            value={formData.projectId}
            onChange={(e) => handleChangeEvent(e.target.value, "projectId")}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </FormItem>
      </div>
      <div className="task-form-row">
        <FormItem id="priority" label="Priority" isRequired>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChangeEvent(e.target.value, "priority")}
          >
            <option value="">Select Priority</option>
            {priorityOptions.map((priority) => (
              <option value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </FormItem>

        <FormItem id="dueDate" label="Due Date" isRequired>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            required
            onChange={(e) => handleChangeEvent(e.target.value, "dueDate")}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormItem>
      </div>
      <div>
        <FormItem id="description" label="Description" fullWidth>
          <textarea
            id="description"
            placeholder="Enter task description"
            rows="4"
            value={formData.description}
            onChange={(e) => handleChangeEvent(e.target.value, "description")}
          />
        </FormItem>
      </div>
      <div className="task-form-row">
        <FormItem id="status" label="Status" isRequired>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChangeEvent(e.target.value, "status")}
            required
          >
            {taskStatuses.map((status) => (
              <option key={status.id} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </FormItem>

        <FormItem id="assignedTo" label="Assign To">
          <select
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => handleChangeEvent(e.target.value, "assignedTo")}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </FormItem>
      </div>
      {submitError && (
        <p className="task-status-message" role="alert">
          {submitError}
        </p>
      )}
      <button
        className="task-primary-button"
        type="submit"
        disabled={isSubmitting}
      >
        {getButtonText()}
      </button>
    </form>
  );
}

export default TaskForm;
