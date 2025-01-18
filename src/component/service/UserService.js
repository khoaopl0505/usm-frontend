import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:8080"

    static async login(email, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async unlockAccount(email){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/unlock`, {email})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData)  
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserByEmail(email, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/find_by_email/${email}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async changePassword(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/group/change-password/${userId}`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async forgotPassword(email, userData){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/auth/reset-password/${email}`, userData)
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/list_users`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/group/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/group/find_by_id/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserByName(name, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/find_by_name/${name}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/group/update-user/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    
    static async getUserByIdGroup(groupId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/count-by-group/${groupId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getListUserByIdGroup(groupId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/user-by-id-group/${groupId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async removeUser(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/group/update-id-group/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isLeaderGroup(){
        const role = localStorage.getItem('role')
        return role === 'LEADER_GROUP'
    }
    static isLeaderProject(){
        const role = localStorage.getItem('role')
        return role === 'LEADER_PROJECT'
    }
    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }
    static leaderGroupOnly(){
        return this.isAuthenticated() && this.isLeaderGroup();
    }
    static leaderProjectOnly(){
        return this.isAuthenticated() && this.isLeaderProject();
    }

}

export default UserService;