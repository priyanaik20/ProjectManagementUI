import { useNavigate, useParams } from "react-router";
import ProjectForm from "../../components/ProjectForm";
import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";
import { LoadingSpinner } from "../../components/LoadingStates";
import "../../styles/project.css";
import PageTitle from "../../components/PageTitle";

function EditProject() {
  const { id } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    APIMethods.getData(`/api/project/${id}`)
      .then((data) => {
        setProjectData(data);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        setLoadError("Could not load this project. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleOnBack = () => {
    navigate("/view-projects");
  };

  return (
    <section className="project-page project-form-page">
      <div className="project-page-heading">
        <div>
          <PageTitle title="Edit Project" onBack={handleOnBack} />
          <p>Update the details for this project.</p>
        </div>
      </div>
      {isLoading ? (
        <div className="project-loading-state">
          <LoadingSpinner label="Loading project..." />
        </div>
      ) : loadError ? (
        <p className="project-form-error" role="alert">
          {loadError}
        </p>
      ) : projectData ? (
        <ProjectForm projectData={projectData} />
      ) : null}
    </section>
  );
}

export default EditProject;
