import axios from "axios";

class FileService {
    static BASE_URL = "http://localhost:8080";

    static async getFileById(fileId, token) {
        try {
          const response = await axios.get(`${FileService.BASE_URL}/group/get-file/${fileId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;  
        } catch (error) {
          console.error('Error getting file:', error);
          throw error;
        }
      }

    static async uploadFile(file, token) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${FileService.BASE_URL}/group/upload-file`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async downloadFile(filename, token) {
        try {
          const response = await axios.get(`http://localhost:8080/group/download`, {
            params: { file: filename },
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            responseType: 'blob', 
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename); 
          document.body.appendChild(link);
          link.click();
    
      
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
    
          return true;
        } catch (error) {
          console.error('Error downloading file:', error);
          return false; 
        }
      }
}

export default FileService;