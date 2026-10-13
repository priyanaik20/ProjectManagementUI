import { useEffect, useState } from "react";
import APIMethods from "../services/apiService";
import FormItem from "../components/FormItem";

function TaskForm() {
    const[projects, setProjects] = useState([]);
    const[users, setUsers] = useState([]);
    const[formData, setFormData] = useState({
        title: '',
        projectId: '',
        priority: '',
        dueDate: '',
        status: '',
        description: '',
        assignedTo: '',
        createdBy: '1',
        createdAt: new Date().toISOString(),
    })

    const handleChangeEvent = (value, key)=>
    {
     setFormData({ ...formData, [key]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await APIMethods.postData('/api/taskList', formData);
            console.log('Task created:', response.data);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }


    const fetchProjects = async () => {
        try {
            const response = await APIMethods.getData('/api/project');           
            setProjects(response);
        }
            catch (error) {
                console.error('Error fetching projects:', error);
            }
        }

            const fetchUsers = async () => {
        try {
            const response = await APIMethods.getData('/api/user');           
            setUsers(response);
        }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        useEffect(() => {
            fetchProjects();
            fetchUsers();
        }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1rem",
            }}
        >
            <h1>Create Task</h1>


            <div style={{ display: "flex",gap: "20px", justifyContent: "space-between" }}>
            <FormItem id="taskName" label="Task Name">
                <input
                    type="text"
                    id="taskName"
                    placeholder="Enter task name"
                    value={formData.title}
                    onChange={(e) => handleChangeEvent(e.target.value,'title')}
                />
            </FormItem>

            <FormItem id="project" label="Project">
            <select id="project" onChange={(e) => handleChangeEvent(e.target.value,'projectId')}>
                <option value="">Select Project</option>
             {   projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
                value={formData.projectId}
            </select>
            </FormItem>
            </div>

            <div style={{ display: "flex",gap: "20px", justifyContent: "space-between" }}>

            <FormItem id="priority" label="Priority">
            <select id="priority" value={formData.priority} onChange={(e) => handleChangeEvent(e.target.value, 'priority')}>
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            </FormItem>


            <FormItem id="dueDate" label="Due Date">
                <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => handleChangeEvent(e.target.value, 'dueDate')}
                />
            </FormItem>
            </div>

            <div style={{ display: "flex",width: "100%" }}>

            <FormItem id="description" label="Description" fullWidth>
                <textarea
                    id="description"
                    placeholder="Enter task description"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => handleChangeEvent(e.target.value, 'description')}
                />
            </FormItem>

            </div>

            <div style={{ display: "flex",gap: "20px", justifyContent: "space-between" }}>
            
            <FormItem id="status" label="Status">
                <select id="status" value={formData.status} onChange={(e) => handleChangeEvent(e.target.value, 'status')}>
                    <option value="">Select Status</option>
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </FormItem>

            <FormItem id="assignedTo" label="Assign To">
                <select id="assignedTo" value={formData.assignedTo} onChange={(e) => handleChangeEvent(e.target.value, 'assignedTo')}>
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </FormItem>
            </div>

            <button
                type="button"
                style={{
                    width: "10rem",
                    padding: "10px",
                    border: "1px solid black",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
                onClick={handleSubmit}
            >
                Create Task
            </button>
        </div>
    );
}

export default TaskForm;