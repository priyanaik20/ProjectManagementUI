import { useNavigate } from "react-router";
import ProjectForm from "../../components/ProjectForm";
import PageTitle from "../../components/PageTitle";

function NewProject() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/view-projects");
  };

  return (
    <section className="project-page project-form-page">
      <div className="project-page-heading">
        <div>
          <PageTitle title="Add Project" onBack={handleBack} />
          <p>Add the details for a project you want to track.</p>
        </div>
      </div>
      <ProjectForm />
    </section>
  );
}

export default NewProject;
