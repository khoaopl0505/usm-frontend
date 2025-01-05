import axios from "axios";
class FileService{
    static BASE_URL = "http://localhost:8080"
    static async uploadFile(fileDataUpload, token){
        try{
            const response = await axios.get(`${FileService.BASE_URL}/group/upload-file`, fileDataUpload, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async downloadFile(fileDataDownload, token){
        try{
            const response = await axios.get(`${FileService.BASE_URL}/group/upload-file`, fileDataDownload, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
}
export default FileService;