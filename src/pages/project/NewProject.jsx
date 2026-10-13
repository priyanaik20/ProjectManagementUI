import { useNavigate } from "react-router";
import ProjectForm from "../../components/ProjectForm";
import Back from "../../components/Back";

function NewProject() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/view-projects");
  };

  return (
    <section className="project-page project-form-page">
      <div className="project-page-heading">
        <div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <Back onBack={handleBack} />
            <h1>New project</h1>
          </div>
          <p>Add the details for a project you want to track.</p>
        </div>
      </div>
      <ProjectForm />
    </section>
  );
}

export default NewProject;
