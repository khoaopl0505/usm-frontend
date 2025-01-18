import axios from "axios";
class TaskService{
    static BASE_URL = "http://localhost:8080"
    static async createTask(taskData, token){
        try{
            const response = await axios.post(`${TaskService.BASE_URL}/admin/create-task`, taskData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getListTask(token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/admin/list-task`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getTaskById(taskId, token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/admin/get-task-by-id`, taskId, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async deleteTask(taskId, token){
        try{
            const response = await axios.delete(`${TaskService.BASE_URL}/admin/delete-task/${taskId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async updateTask(taskId, taskData, token){
        try{
            const response = await axios.put(`${TaskService.BASE_URL}/group/update-task/${taskId}`, taskData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getTaskByIdUser(userId, token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/group/get-task-by-id-user/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getTaskByIdProject(projectId, token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/group/get-task-by-id-project/${projectId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    
    static async getIdFileByIdTask(taskId, token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/group/file-id/${ taskId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    
    static async getIdUserByIdTask(taskId, token){
        try{
            const response = await axios.get(`${TaskService.BASE_URL}/group/user-id/${ taskId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
}
export default TaskService;