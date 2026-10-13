import TaskForm from "../../components/TaskForm";
import "./Tasks.css";

function CreateTask() {
  return (
    <section className="task-screen">
      <div className="task-screen-heading">
        <div>
          <h1>Create task</h1>
          <p>Add the details and assignment for a new task.</p>
        </div>
      </div>
      <TaskForm />
    </section>
  );
}

export default CreateTask;
