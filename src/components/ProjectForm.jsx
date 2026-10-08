import { useEffect, useState } from 'react';
import APIMethods from '../services/apiService';
import { useNavigate } from 'react-router-dom';
function ProjectForm ({projectData})
{
    console.log('projectData:', projectData);
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        name: projectData?.name || '',
        description: projectData?.description || '',
        status: projectData?.status || 'active',
        endDate: projectData?.endDate || '',
        createdBy: '1',
        createdAt: new Date().toISOString(), 
    });

    useEffect(() => {
        if (projectData) {
            setFormData({
                name: projectData.name || '',
                description: projectData.description || '',
                status: projectData.status || 'active',
                endDate: projectData.endDate || '',
                createdBy: '1',
                createdAt: new Date().toISOString(),
            });
        }
    }, [projectData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let response;
            if(projectData)
            {
             response = await APIMethods.updateData('/api/project',formData);
             console.log('Project created:', response.data);
            }
            else   
               { response = await APIMethods.postData('/api/project',formData);
                console.log('Project updated:', response.data);
               }
            
            navigate('/view-projects');
        }
        catch (error) {
            console.error('Error creating project:', error);
        }
    }

    return(
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" ,height:"100vh", width:"100vw", padding:"1rem"}}>
            <h1>ProjectForm</h1>
            <label htmlFor="name" style={{width:"20rem"}}>Project Name:</label>
            <input type="text" placeholder="Add project name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{width:"20rem"}} />
             <label htmlFor="description" style={{width:"20rem"}}>Description:</label>
            <input type="text" placeholder="Add project description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{width:"20rem"}} />
            <label htmlFor="status" style={{width:"20rem"}}>Status:</label>
            <select name="status" id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{width:"20rem"}}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <label htmlFor="endDate" style={{width:"20rem"}}>End Date:</label>
            <input type ="date" placeholder="Add project end date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={{width:"20rem"}} />
            <button type="submit" onClick={(e)=>handleSubmit(e)} style={{width:"5rem"}}>Submit</button>
        </div>
    )
}

export default ProjectForm;