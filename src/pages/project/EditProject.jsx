import { useParams } from "react-router";
import ProjectForm from "../../components/ProjectForm";
import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";

function EditProject() {
    const { id } = useParams(); 

    const[projectData, setProjectData] = useState(null);

    const fetchProjectData = async () => {
        try {
            const data = await APIMethods.getData(`/api/project/${id}`);         
            setProjectData(data);
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    return (<div>
        <h2>Edit Project</h2>
        <ProjectForm projectData={projectData} />
    </div>)
}

export default EditProject;