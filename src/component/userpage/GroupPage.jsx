import React, { useState, useEffect } from 'react';
import { Table, Input, Pagination, Typography, message, Button, Modal, Form } from 'antd';
import GroupService from '../service/GroupService';
import UserService from '../service/UserService';

const { Title } = Typography;

function GroupManagementPage() {
  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingGroup, setEditingGroup] = useState(null);
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
  
      // Lấy danh sách nhóm
      const response = await GroupService.getListGroup(token);
      const groupList = response.groupList || [];
      setGroups(groupList);
  
      // Gửi request cho từng nhóm để lấy thông tin (không lưu kết quả)
      groupList.forEach(async (group) => {
        try {
          await UserService.getUserByIdGroup(group.id, token);
          console.log(`Request sent for group ID: ${group.id}`);
        } catch (error) {
          console.error(`Error sending request for group ID: ${group.id}`, error);
        }
      });
    } catch (error) {
      message.error('Error fetching groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastGroup = currentPage * itemsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - itemsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const showAddModal = () => {
    setModalType('add');
    setEditingGroup(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (group) => {
    setModalType('edit');
    setEditingGroup(group);
    form.setFieldsValue({
      groupName: group.groupName,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    setModalLoading(true);
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      if (modalType === 'add') {
        await GroupService.createGroup(values, token);
        message.success('Group added successfully!');
      } else if (modalType === 'edit') {
        await GroupService.updateGroup(editingGroup.id, values, token);
        message.success('Group updated successfully!');
      }
      fetchGroups();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving group. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const deleteGroup = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this group?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await GroupService.deleteGroup(id, token);
        message.success('Group deleted successfully');
        fetchGroups();
      }
    } catch (error) {
      message.error('Error deleting group.');
    }
  };

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
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: 'Members Quantity',
      dataIndex: 'membersQuantity',
      key: 'membersQuantity',
      align: 'center',
      
    },
    {
      title: 'Group Leader',
      dataIndex: 'groupLeader',
      key: 'groupLeader',
      align: 'center',
      
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)}>Edit</Button>
          <Button danger style={{ marginLeft: 8 }} onClick={() => deleteGroup(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const paginationProps = {
    current: currentPage,
    total: filteredGroups.length,
    pageSize: itemsPerPage,
    onChange: (page) => setCurrentPage(page),
  };

  return (
    <div className="group-management-container">
      <Title className="centered-title">GROUP MANAGEMENT</Title>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search group name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 200 }}
        />
        <Button type="primary" onClick={showAddModal}>
          Add Group
        </Button>
      </div>

      {loading && <p>Loading groups...</p>}

      {!loading && (
        <>
          <Table
            columns={columns}
            dataSource={currentGroups.map((group, index) => ({
              key: group.id,
              index: indexOfFirstGroup + index + 1,
              id: group.id,
              groupName: group.groupName,
              membersQuantity: group.membersQuantity,
              groupLeader: group.groupLeader,
              description: group.description,
            }))}
            pagination={false}
          />
          <Pagination {...paginationProps} />
        </>
      )}

      <Modal
        title={modalType === 'add' ? 'Add Group' : 'Edit Group'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Group Name"
            name="groupName"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input />
            </Form.Item>
    <Form.Item
      label="Group Leader (Email)"
      name="groupLeader"
      rules={[
        { required: true, message: 'Please enter the group leader email' },
        { type: 'email', message: 'Please enter a valid email address' },
      ]}
    >
      <Input placeholder="Enter group leader email" />
    </Form.Item>
    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please enter a description' }]}
    >
      <Input.TextArea rows={4} placeholder="Enter group description" />
    </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
}

export default GroupManagementPage;
