import axios from "axios";

class GroupService {
  static BASE_URL = "http://localhost:8080";

  static async createGroup(groupData, token) {
    try {
      const response = await axios.post(
        `${GroupService.BASE_URL}/admin/create-group`,
        groupData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getListGroup(token) {
    try {
      const response = await axios.get(`${GroupService.BASE_URL}/admin/list-group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getGroupById(groupId, token) {
    try {
      const response = await axios.get(
        `${GroupService.BASE_URL}/admin/get-group-by-id/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteGroup(groupId, token) {
    try {
      const response = await axios.delete(
        `${GroupService.BASE_URL}/admin/delete-group/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateGroup(groupId, groupData, token) {
    try {
      const response = await axios.put(
        `${GroupService.BASE_URL}/admin/update-group/${groupId}`,
        groupData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export default GroupService;
