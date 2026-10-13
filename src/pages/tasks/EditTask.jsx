import { useEffect, useState } from "react";
import TaskForm from "../../components/TaskForm";
import "./Tasks.css";
import APIMethods from "../../services/apiService";
import { useParams } from "react-router";

function EditTask() {
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();

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
          <h1>Edit task</h1>
          <p>Update the details and assignment for this task.</p>
        </div>
      </div>
      <TaskForm tasks={tasks} />
    </section>
  );
}

export default EditTask;
