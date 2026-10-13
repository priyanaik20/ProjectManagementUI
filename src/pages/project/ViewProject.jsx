import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import APIMethods from '../../services/apiService';
import EmptyState from '../../components/EmptyState';
import { LoadingSpinner, TableSkeletonRows } from '../../components/LoadingStates';
import './Project.css';

function ViewProject(){

    const[projects, setProjects] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const[loadError, setLoadError] = useState('');
    const[actionError, setActionError] = useState('');
    const[deletingProjectIds, setDeletingProjectIds] = useState(() => new Set());
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        APIMethods.getData('/api/project')
            .then((data) => {
                if (isMounted) {
                    setProjects(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                if (isMounted) {
                    setLoadError('Could not load projects. Please try again.');
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
    }, []);

    const handleCreateProject = () => {
        navigate('/new-project');
    }

    const handleEdit = (projectId) => {
        navigate(`/edit-project/${projectId}`);
    }   

    const handleDelete = async (projectId) => {
        setActionError('');
        setDeletingProjectIds((currentIds) => new Set(currentIds).add(String(projectId)));
        try {
           await APIMethods.deleteData(`api/project/${projectId}`);
           setProjects((currentProjects) =>
               currentProjects.filter((project) => project.id !== projectId)
           );
        }
        catch (error) {
            console.error('Error deleting project:', error);
            setActionError('Could not delete the project. Please try again.');
        } finally {
            setDeletingProjectIds((currentIds) => {
                const nextIds = new Set(currentIds);
                nextIds.delete(String(projectId));
                return nextIds;
            });
        }
    }

    return(
        <section className="project-page">
            <div className="project-page-heading">
                <div>
                    {/* <span className="project-eyebrow">Workspace</span> */}
                    <h1>Projects</h1>
                    <p>Plan and manage your team’s project work.</p>
                </div>
                <button className="project-primary-button" onClick={handleCreateProject}>Create project</button>
            </div>
  {actionError && <p className="project-table-message error" role="alert">{actionError}</p>}
  {isLoading ? (
  <div className="project-table-wrap"><table className="project-table" aria-busy="true">
    <thead>
        <tr>
            <th className="project-id-column">ID</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody><TableSkeletonRows columns={5} rows={6} /></tbody>
  </table></div>
  ) : loadError ? (
    <EmptyState variant="error" title="Projects could not be loaded" message={loadError} />
  ) : projects.length === 0 ? (
    <EmptyState
      title="No projects yet"
      message="Create a project to start organizing your work."
      action={
        <button
          className="project-primary-button"
          type="button"
          onClick={handleCreateProject}
        >
          Create project
        </button>
      }
    />
  ) : (
  <div className="project-table-wrap"><table className="project-table">
    <thead>
        <tr>
            <th className="project-id-column">ID</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {projects.map((project) => (
            <tr key={project.id}>
                <td className="project-id-column">
                    {project.id}
                </td>
                <td className="project-name-cell">
                    {project.name}
                </td>
                <td className="project-description-cell">
                    {project.description}
                </td>
                <td>
                    {project.status}
                </td>
                <td>
                    {project.endDate}
                </td>
                <td className="project-action-cell">
                    <button className="project-secondary-button" onClick={()=>handleEdit(project.id)}>Edit</button>
                    <button
                        className="project-danger-button"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingProjectIds.has(String(project.id))}
                    >
                        {deletingProjectIds.has(String(project.id)) ? (
                            <LoadingSpinner label="Deleting..." />
                        ) : 'Delete'}
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table></div>
  )}
        </section>
        
        
    )

}

export default ViewProject;