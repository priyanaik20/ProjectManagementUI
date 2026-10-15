import { useState } from "react";
import APIMethods from "../services/apiService";
import "../pages/project/Project.css";
import { LoadingSpinner } from "./LoadingStates";
import { useNavigate } from "react-router-dom";
import FormItem from "./FormItem";
function ProjectForm({ projectData }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: projectData?.name || "",
    description: projectData?.description || "",
    status: projectData?.status || "Active",
    endDate: projectData?.endDate || "",
    createdBy: "1",
    createdAt: new Date().toISOString(),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (projectData) {
        await APIMethods.updateData(`/api/project/${projectData.id}`, formData);
      } else {
        await APIMethods.postData("/api/project/", formData);
      }

      navigate("/view-projects");
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitError("Could not save the project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="project-form-field">
        <FormItem id="name" label="Project Name" isRequired>
          <input
            id="name"
            type="text"
            placeholder="Add project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormItem>
      </div>

      <div className="project-form-field">
        <FormItem id="description" label="Description" isRequired>
          <textarea
            id="description"
            placeholder="Add project description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
          />
        </FormItem>
      </div>
      <div className="project-form-field">
        <FormItem id="status" label="Status" isRequired>
          <select
            name="status"
            id="status"
            required
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FormItem>
      </div>
      <div className="project-form-field">
        <FormItem id="endDate" label="Due Date" isRequired>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            required
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </FormItem>
      </div>
      {submitError && (
        <p className="project-form-error" role="alert">
          {submitError}
        </p>
      )}
      <button
        className="project-primary-button project-submit-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner label="Saving..." /> : "Save project"}
      </button>
    </form>
  );
}

export default ProjectForm;
