import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';
import APIMethods from '../../services/apiService';

function ViewProject(){

    const[projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://localhost:44326/api/project');
            const data = await response.data;
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
         fetchProjects();
    }, []);

    const handleCreateProject = () => {
        navigate('/new-project');
    }

    const handleEdit = (projectId) => {
        navigate(`/edit-project/${projectId}`);
    }   

    const handleDelete = async (projectId) => {
        try {
           await APIMethods.deleteData(`api/project/${projectId}`);
           fetchProjects(); // Refresh the project list
        }
        catch (error) {
            console.error('Error deleting project:', error);}
    }

    return(
        <div style={{height:"100vh"}}>
            <button onClick={handleCreateProject}>Create Project</button>
  <table style={{ borderCollapse: "collapse", width: "80%" }}>
    <thead>
        <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Project Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Description</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Due Date</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
        </tr>
    </thead>

    <tbody>
        {projects.map((project) => (
            <tr key={project.id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    {project.id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    {project.name}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    {project.description}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    {project.status}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    {project.endDate}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                    <button onClick={()=>handleEdit(project.id)}>Edit</button>
                    <button onClick={() => handleDelete(project.id)}>Delete</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
        </div>
        
        
    )

}

export default ViewProject;