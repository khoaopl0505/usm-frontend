import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Table, Select, Button, Pagination, message, Modal, Form, Input, Typography, DatePicker } from 'antd';


const { Option } = Select;

function LeaderManagementPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [addUserForm] = Form.useForm();
  const { Title } = Typography;
  const [searchTerm, setSearchTerm] = useState('');
  const [groupId, setGroupId] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProfileAndUsers();
  }, []);

  const fetchProfileAndUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Lấy profile và group ID
      const profileResponse = await UserService.getYourProfile(token);
      const userGroupId = profileResponse.user.group?.id;
      
      if (!userGroupId) {
        throw new Error('Group ID not found in profile data');
      }
      
      setGroupId(userGroupId);
      
      // Lấy danh sách users dựa trên group ID
      const response = await UserService.getListUserByIdGroup(userGroupId, token);
      
      // Kiểm tra nếu response là một mảng
      if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
        message.warning('No users found for this group');
      }
      
    } catch (error) {
      setError('Error fetching data: ' + error.message);
      message.error('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await UserService.getListUserByIdGroup(groupId, token);
      
      if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
        message.warning('No users found for this group');
      }
    } catch (error) {
      setError('Error fetching users: ' + error.message);
      message.error('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values) => {
    try {
      const token = localStorage.getItem('token');
      
      // Tìm user bằng email và lấy response
      const response = await UserService.getUserByEmail(values.email, token);
      
      if (!response || !response.user || !response.user.id) {
        message.error('User not found');
        return;
      }
  
      // Sử dụng dữ liệu hiện tại của user và chỉ cập nhật idUserGroup
      const currentUserData = response.user;
      const updateData = {
        ...currentUserData, // Giữ lại tất cả các trường dữ liệu khác
        idUserGroup: groupId,
      };
      
      await UserService.updateUser(currentUserData.id, updateData, token);
      message.success('User added to group successfully');
      
      // Refresh lại danh sách user
      await refreshUsers();
      
      // Đóng modal và reset form
      setIsAddUserModalVisible(false);
      addUserForm.resetFields();
      
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('User not found');
      } else {
        message.error('Error adding user to group: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const removeUserFromGroup = async (userId) => {
    try {
      const token = localStorage.getItem('token');
    
  
      await UserService.removeUser(userId, token);
      message.success('User removed from group successfully');
      
      // Cập nhật danh sách người dùng sau khi xóa
      await refreshUsers();
    } catch (error) {
      message.error('Error removing user: ' + (error.response?.data?.message || error.message));
    }
  };
  

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      
      // Chỉ gửi trường idUserGroup trong request
      const updateData = {
        idUserGroup: groupId  // Sử dụng groupId từ state
      };
      
      await UserService.updateUser(currentUser.id, updateData, token);
      message.success('User updated successfully');
      await refreshUsers();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Error updating user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

 

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.statusUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: 200,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      align: 'center',
      width: 120,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'statusUser',
      key: 'statusUser',
      align: 'center',
      width: 120,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      width: 100,
    },
    {
      title: 'Group',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <div className="space-x-2">
          <Button 
            danger
            onClick={() => removeUserFromGroup(record.id)}
            title="Remove from group"
          >
            Remove
          </Button>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="user-management-container p-6">
      <Title>MEMBERS GROUP</Title>
      
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Button 
          type="primary"
          onClick={() => setIsAddUserModalVisible(true)}
        >
          Add User to Group
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={currentUsers.map((user, index) => ({
              key: user.id,
              index: indexOfFirstUser + index + 1,
              id: user.id,
              name: user.name,
              email: user.email,
              dateOfBirth: user.dateOfBirth,
              phoneNumber: user.phoneNumber,
              statusUser: user.statusUser,
              role: user.role,
              groupName: user.group?.groupName,
            }))}
            pagination={false}
            scroll={{ x: 1500 }}
            bordered
          />
          
          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={filteredUsers.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* Add User Modal */}
      <Modal
        title="Add User to Group"
        open={isAddUserModalVisible}
        onCancel={() => {
          setIsAddUserModalVisible(false);
          addUserForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={addUserForm}
          layout="vertical"
          onFinish={handleAddUser}
        >
          <Form.Item
            name="email"
            label="User Email"
            rules={[
              { required: true, message: 'Please enter user email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button 
              onClick={() => {
                setIsAddUserModalVisible(false);
                addUserForm.resetFields();
              }} 
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update User Modal */}
      <Modal
        title="Update User"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            role: 'USER',
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^[0-9]{9,10}$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="statusUser"
            label="Status"
            rules={[{ required: true, message: 'Please enter status' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="USER">USER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LeaderManagementPage;