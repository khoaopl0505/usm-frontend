import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Pagination, Typography, message, Modal, Form, Select, DatePicker } from 'antd';
import moment from 'moment';
import TaskService from '../service/TaskService';
import UserService from '../service/UserService';
import ProjectService from '../service/ProjectService';
import FileService from '../service/FileService';
import { DownloadOutlined } from '@ant-design/icons';
const { Title } = Typography;


function LeaderProjectManagementPage() {
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
  const [projectId, setProjectId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [currentTaskData, setCurrentTaskData] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [fileNames, setFileNames] = useState({});
  // Fetch user profile and set email
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await UserService.getYourProfile(token);
        // Access email from the nested user object in the response
        const email = response.user.email;
        if (email) {
          setUserEmail(email);
        } else {
          message.error('Email not found in user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        message.error('Failed to fetch user profile');
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch project when email is available
  useEffect(() => {
    const fetchProject = async () => {
      if (!userEmail) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await ProjectService.getProjectByEmail(userEmail, token);
        console.log('Project Response:', response);
        
        if (response.project && response.project.id) {
          console.log('Setting Project ID:', response.project.id);
          setProjectId(response.project.id);
        } else {
          console.log('No project found in response');
          message.warning('No project found for the user');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        message.error('Failed to fetch project');
      }
    };
    
    console.log('Fetching project for email:', userEmail);
    fetchProject();
  }, [userEmail]);

  useEffect(() => {
    const layTenNguoiNhan = async () => {
      if (!tasks.length) return;
      
      const token = localStorage.getItem('token');
      const danhSachTenMoi = { ...userNames };
  
      for (const task of tasks) {
        try {
          // Lấy userId của task - API trả về trực tiếp số userId
          const userId = await TaskService.getIdUserByIdTask(task.id, token);
          if (userId) {
            // Dùng userId để lấy thông tin user
            const thongTinUser = await UserService.getUserById(userId, token);
            if (thongTinUser && thongTinUser.user && thongTinUser.user.name) {
              danhSachTenMoi[task.id] = thongTinUser.user.name;
            }
          }
        } catch (error) {
          console.error(`Lỗi khi lấy tên người nhận cho task ${task.id}:`, error);
        }
      }
  
      setUserNames(danhSachTenMoi);
    };
  
    layTenNguoiNhan();
  }, [tasks]);
  
  // Fetch tasks useEffect
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        console.log('No projectId available yet');
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching tasks for projectId:', projectId);
        const token = localStorage.getItem('token');
        const response = await TaskService.getTaskByIdProject(projectId, token);
        console.log('Tasks Response:', response);
        
        if (response && response.taskList) {
          console.log('Setting tasks:', response.taskList); 
          setTasks(response.taskList);
        } else {
          console.log('No tasks found in response');
          setTasks([]);
          message.info('No tasks found for this project');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        message.error('Failed to fetch tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [projectId]); 

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        console.log('No projectId available yet');
        return;
      }
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await TaskService.getTaskByIdProject(projectId, token);
        
        if (response && response.taskList) {
          setTasks(response.taskList);
          
          // Fetch file information for each task
          const updatedFileNames = {};
          for (const task of response.taskList) {
            try {
              const fileIdResponse = await TaskService.getIdFileByIdTask(task.id, token);
              const idFile = parseInt(fileIdResponse, 10);
              
              if (!isNaN(idFile)) {
                const fileData = await FileService.getFileById(idFile, token);
                if (fileData?.fileName) {
                  updatedFileNames[task.id] = fileData.fileName;
                }
              }
            } catch (error) {
              console.error('Error fetching file for task:', task.id, error);
            }
          }
          setFileNames(updatedFileNames);
        } else {
          setTasks([]);
          message.info('No tasks found for this project');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        message.error('Failed to fetch tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [projectId]);

  const handleDownload = async (filename) => {
    if (!filename) {
      message.error('File name is missing. Unable to download.');
      return;
    }
  
    const token = localStorage.getItem('token');
    try {
      const success = await FileService.downloadFile(filename, token);
      if (success) {
        message.success('File downloaded successfully!');
      } else {
        message.error('Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during file download:', error);
      message.error('An error occurred while downloading the file.');
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

  const handleAddTask = async () => {
    if (!projectId) {
      message.error('No project selected');
      return;
    }
  
    try {
      const updatedTaskData = {
        ...newTask,
        idProject: projectId
      };
  
      const token = localStorage.getItem('token');
  
      await TaskService.createTask(updatedTaskData, token);
      message.success('Task added successfully');
  
      // Refresh tasks list
      const updatedTasks = await TaskService.getTaskByIdProject(projectId, token);
      setTasks(updatedTasks.taskList || []);
  
      handleCloseAddTaskModal();
    } catch (error) {
      message.error('Failed to add task');
    }
  };

  const handleEditTask = async () => {
    try {
      const values = await editForm.validateFields();
      const token = localStorage.getItem('token');
  
      const updatedTaskData = {
        idProject: projectId,
        ...currentTaskData,
        ...values
      };
  
      delete updatedTaskData.key;
      delete updatedTaskData.updDate;
      delete updatedTaskData.id;
      delete updatedTaskData.insDate;
      await TaskService.updateTask(editingTask.id, updatedTaskData, token);
  
      message.success('Task updated successfully');
  
      // Refresh tasks list
      const updatedTasks = await TaskService.getTaskByIdProject(projectId, token);
      setTasks(updatedTasks.taskList || []);
  
      handleCloseEditModal();
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this task?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await TaskService.deleteTask(id, token);
        message.success('Task deleted successfully');
        
        // Refresh tasks list
        const updatedTasks = await TaskService.getTaskByIdProject(projectId, token);
        setTasks(updatedTasks.taskList || []);
      }
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setCurrentTaskData({ ...task });
    editForm.setFieldsValue({
      taskName: task.taskName,
      description: task.description,
      completionSchedule: task.completionSchedule,
      deadline: moment(task.deadline),
      requestLevel: task.requestLever,
      idUser: task.idUser
    });
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingTask(null);
    editForm.resetFields();
  };

  const handleOpenAddTaskModal = () => {
    setNewTask({ taskName: '', description: '' });
    setIsAddTaskModalVisible(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
    setNewTask({ taskName: '', description: '' });
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
      title: 'Request Level',
      dataIndex: 'requestLever',
      key: 'requestLever',
      align: 'center',
    },
    {
      title: 'Receiver',
      key: 'receiver',
      align: 'center',
      render: (_, record) => userNames[record.id] || '-',
    },
    {
      title: 'File Name',
      key: 'fileName',
      align: 'center',
      render: (_, record) => (
        <div>
  <div>{fileNames[record.id] || '-'}</div>
  {fileNames[record.id] && (
    <Button
      icon={<DownloadOutlined />}
      onClick={() => handleDownload(fileNames[record.id])}
      style={{ marginTop: 8 }}
    >
      Download
    </Button>
  )}
</div>

      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleOpenEditModal(record)}>Edit</Button>
          <Button variant="destructive" className="ml-2" onClick={() => deleteTask(record.id)}>
            Delete
          </Button>
        </>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="p-4">
      <Title level={2}>Tasks by Project</Title>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={handleSearch}
          className="w-48"
          style={{ marginBottom: 16, width: 200 }}
        />
        <Button onClick={handleOpenAddTaskModal}>
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

      <div className="mt-4">
        <Pagination
          current={currentPage}
          total={filteredTasks.length}
          pageSize={itemsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Add Task Modal */}
      <Modal
        visible={isAddTaskModalVisible}
        onCancel={handleCloseAddTaskModal}
        onOk={handleAddTask}
        title="Add New Task"
      >
        <Form layout="vertical">
          <Form.Item 
            name="taskName" 
            label="Task Name"
            rules={[{ required: true, message: 'Please input task name!' }]}
          >
            <Input
              value={newTask.taskName}
              onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
            />
          </Form.Item>
          <Form.Item 
            name="deadline" 
            label="Deadline"
            rules={[{ required: true, message: 'Please select deadline!' }]}
          >
            <DatePicker 
              value={newTask.deadline}
              onChange={(date) => setNewTask({ ...newTask, deadline: date })}
            />
          </Form.Item>
          <Form.Item 
            name="completionSchedule" 
            label="Completion Schedule"
            rules={[{ required: true, message: 'Please input completion schedule!' }]}
          >
            <Input 
              value={newTask.completionSchedule}
              onChange={(e) => setNewTask({ ...newTask, completionSchedule: e.target.value })}
            />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Form.Item>
          <Form.Item 
            name="requestLevel" 
            label="Request Level"
            rules={[{ required: true, message: 'Please select request level!' }]}
          >
            <Select 
              value={newTask.requestLever}
              onChange={(value) => setNewTask({ ...newTask, requestLever: value })}
            >
              <Select.Option value="Low Priority">Low Priority</Select.Option>
              <Select.Option value="Medium Priority">Medium Priority</Select.Option>
              <Select.Option value="High Priority">High Priority</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        onOk={handleEditTask}
        title="Edit Task"
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
            <Input />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="completionSchedule" 
            label="Completion Schedule"
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="deadline" 
            label="Deadline"
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="idUser" 
            label="Id Receiver"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LeaderProjectManagementPage;