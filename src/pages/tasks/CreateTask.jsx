import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";
import TaskForm from "../../components/TaskForm";
import "../../styles/tasks.css";

function CreateTask() {
  const navigate = useNavigate();

  const handleOnBack = () => {
    navigate("/view-tasks");
  };
  return (
    <section className="task-screen">
      <div className="task-screen-heading">
        <div>
          <PageTitle title="Create task" onBack={handleOnBack} />
          <p>Add the details and assignment for a new task.</p>
        </div>
      </div>
      <TaskForm />
    </section>
  );
}

export default CreateTask;
