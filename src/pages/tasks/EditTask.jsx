import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TaskForm from "../../components/TaskForm";
import "../../styles/tasks.css";
import APIMethods from "../../services/apiService";
import { useParams } from "react-router";
import PageTitle from "../../components/PageTitle";

function EditTask() {
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  const handleOnBack = () => {
    navigate("/view-tasks");
  };

  const fetchTasks = async () => {
    let data = await APIMethods.getData(`api/taskList/${id}`);
    console.log("fetched data", data);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  return (
    <section className="task-screen">
      <div className="task-screen-heading">
        <div>
          <PageTitle title="Edit task" onBack={handleOnBack} />
          <p>Update the details and assignment for this task.</p>
        </div>
      </div>
      <TaskForm tasks={tasks} />
    </section>
  );
}

export default EditTask;
