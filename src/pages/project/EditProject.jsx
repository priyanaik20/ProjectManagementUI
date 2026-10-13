import { useParams } from "react-router";
import ProjectForm from "../../components/ProjectForm";
import { useState, useEffect } from "react";
import APIMethods from "../../services/apiService";
import { LoadingSpinner } from "../../components/LoadingStates";
import "./Project.css";

function EditProject() {
    const { id } = useParams(); 

    const[projectData, setProjectData] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const[loadError, setLoadError] = useState('');

    useEffect(() => {
        let isMounted = true;

        APIMethods.getData(`/api/project/${id}`)
            .then((data) => {
                if (isMounted) {
                    setProjectData(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching project data:", error);
                if (isMounted) {
                    setLoadError("Could not load this project. Please try again.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (<section className="project-page project-form-page">
        <div className="project-page-heading">
            <div>
                <h1>Edit project</h1>
                <p>Update the details for this project.</p>
            </div>
        </div>
        {isLoading ? (
            <div className="project-loading-state"><LoadingSpinner label="Loading project..." /></div>
        ) : loadError ? (
            <p className="project-form-error" role="alert">{loadError}</p>
        ) : projectData ? (
            <ProjectForm projectData={projectData} />
        ) : null}
    </section>)
}

export default EditProject;