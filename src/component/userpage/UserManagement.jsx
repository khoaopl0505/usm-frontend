import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Table, Select, Button, Pagination, message, Modal, Form, Input, Typography, DatePicker } from 'antd';
import AddUserPopup from '../popup/AddUserPopup';
import moment from 'moment';

const {Option} = Select;

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const { Title} = Typography;
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
      fetchUsers();
    
  }, [currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    setLoading(true);


    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getAllUsers(token);
      setUsers(response.listUsers);
     
    } catch (error) {
      setError('Error fetching users. Please try again later.');
      message.error('Error fetching users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this user?');
      const token = localStorage.getItem('token'); 
      if (confirmDelete) {
        await UserService.deleteUser(userId, token);
        fetchUsers(); 
      }
    } catch (error) {
      setError('Error deleting user. Please try again later.');
    }
  };

  const showUpdateModal = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      ...user,
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null, 
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      };
      await UserService.updateUser(currentUser.id, formattedValues, token);
      message.success('User updated successfully');
      fetchUsers(); 
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error updating user');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      align: 'center',
    },
    {
      title: 'Group',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: 'Create At',
      dataIndex: 'createAt',
      key: 'createAt',
      align: 'center',
      render: (createAt) => {
      
        if (createAt) {
          return createAt.replace("T", " ");
        }
        return createAt;
      },
    },
    {
      title: 'Last Login At',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      align: 'center',
      render: (lastLoginAt) => {
      
        if (lastLoginAt) {
          return lastLoginAt.replace("T", " ");
        }
        return lastLoginAt;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button  danger onClick={() => deleteUser(record.id)}> 
           {/* type="primary" */}
            Delete
          </Button>
          <Button type="default" onClick={() => showUpdateModal(record)}>
            Update
          </Button>
        </>
      ),
      align: 'center',
    },
  ];

  const paginationProps = {
    current: currentPage,
    total: filteredUsers.length,
    pageSize: itemsPerPage,
    onChange: (page) => setCurrentPage(page),
  };

  return (
    <div className="user-management-container">
      <Title className="centered-title">USER MANAGEMENT</Title>
      <AddUserPopup refreshUsers={fetchUsers} />

      <Input
        placeholder="Search info user"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 150 }}
      />
      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
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
              createAt: user.createAt,
              lastLoginAt: user.lastLoginAt,
              groupName: user.group?.groupName,
            }))}
            pagination={false}
          />
          <Pagination {...paginationProps} />
        </>
      )}

      <Modal
        title="Update User"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          // initialValues={currentUser}
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
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select the date of birth' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
         
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
              <Select>
                  <Option value="USER">USER</Option>
                  <Option value="ADMIN">ADMIN</Option>
              </Select>
          </Form.Item>
          <Form.Item style={{textAlign: 'center'}}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagementPage;
