import axios from "axios";
class ProjectService{
    static BASE_URL = "http://localhost:8080"
    static async createProject(projectData, token){
        try{
            const response = await axios.post(`${ProjectService.BASE_URL}/admin/create-project`, projectData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getListProject(token){
        try{
            const response = await axios.get(`${ProjectService.BASE_URL}/admin/list-project`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getProjectById(projectId, token){
        try{
            const response = await axios.get(`${ProjectService.BASE_URL}/admin/get-project-by-id`, projectId, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async deleteProject(projectId, token){
        try{
            const response = await axios.delete(`${ProjectService.BASE_URL}/admin/delete-project`, projectId, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async updateProject(projectId, projectData, token){
        try{
            const response = await axios.put(`${ProjectService.BASE_URL}/admin/update-project`, projectId, projectData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
}
export default ProjectService;