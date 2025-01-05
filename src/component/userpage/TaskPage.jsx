import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Pagination, Typography, message, Modal, Form, Input as AntInput } from 'antd';
import moment from 'moment';
import TaskService from '../service/TaskService';

const { Title } = Typography;

function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ taskName: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await TaskService.getListTask(token);
      setTasks(response.taskList || []);
    } catch (error) {
      message.error('Error fetching tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredTasks = tasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleOpenEditModal = async (task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      taskName: task.taskName,
      description: task.description,
      completionSchedule: task.completionSchedule,
      deadline: task.deadline
    });
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingTask(null);
    editForm.resetFields();
  };

  const handleEditTask = async () => {
    try {
      const values = await editForm.validateFields();
      const token = localStorage.getItem('token');
      
      await TaskService.updateTask(editingTask.id, values, token);
      message.success('Task updated successfully');
      fetchTasks();
      handleCloseEditModal();
    } catch (error) {
      message.error('Error updating task. Please check your inputs.');
    }
  };

  const deleteTask = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this task?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await TaskService.deleteTask(id, token);
        message.success('Task deleted successfully');
        fetchTasks();
      }
    } catch (error) {
      message.error('Error deleting task.');
    }
  };

  const handleOpenAddTaskModal = () => {
    setNewTask({ taskName: '', description: '' });
    setIsAddTaskModalVisible(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token');
      await TaskService.createTask(newTask, token);
      message.success('Task added successfully');
      fetchTasks();
      handleCloseAddTaskModal();
    } catch (error) {
      message.error('Error adding task.');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Completion Schedule',
      dataIndex: 'completionSchedule',
      key: 'completionSchedule',
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'insDate',
      key: 'insDate',
      align: 'center',
      render: (insDate) => (insDate ? moment(insDate).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      align: 'center',
      render: (deadline) => (deadline ? moment(deadline).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleOpenEditModal(record)}>Edit</Button>
          <Button danger style={{ marginLeft: 8 }} onClick={() => deleteTask(record.id)}>
            Delete
          </Button>
        </>
      ),
      align: 'center',
    },
  ];

  const paginationProps = {
    current: currentPage,
    total: filteredTasks.length,
    pageSize: itemsPerPage,
    onChange: (page) => setCurrentPage(page),
  };

  return (
    <div className="task-management-container">
      <Title level={2}>Task Management</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 200 }}
        />
        <Button type="primary" onClick={handleOpenAddTaskModal}>
          Add Task
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={currentTasks.map((task) => ({
          key: task.id,
          ...task,
        }))}
        pagination={false}
        loading={loading}
      />
      <Pagination {...paginationProps} />

      {/* Add Task Modal */}
      <Modal
        title="Add New Task"
        visible={isAddTaskModalVisible}
        onCancel={handleCloseAddTaskModal}
        onOk={handleAddTask}
      >
        <Form layout="vertical">
          <Form.Item label="Task Name">
            <AntInput
              value={newTask.taskName}
              onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Description">
            <AntInput
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        onOk={handleEditTask}
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={editingTask}
        >
          <Form.Item 
            name="taskName" 
            label="Task Name"
            rules={[{ required: true, message: 'Please input task name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
          >
            <AntInput.TextArea rows={4} />
          </Form.Item>
          <Form.Item 
            name="completionSchedule" 
            label="Completion Schedule"
          >
            <AntInput />
          </Form.Item>
          <Form.Item 
            name="deadline" 
            label="Deadline"
          >
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TaskManagementPage;