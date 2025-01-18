import React, { useState, useEffect } from 'react';
import { Table, Input, Pagination, Typography, Upload, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import TaskService from '../service/TaskService';
import UserService from '../service/UserService';
import FileService from '../service/FileService';

const { Title } = Typography;

function TaskManagementPage() {
  
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileNames, setFileNames] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const profileResponse = await UserService.getYourProfile(token);
      const userId = profileResponse?.user?.id;
  
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      const taskResponse = await TaskService.getTaskByIdUser(userId, token);
      const taskList = taskResponse?.taskList || [];
      setTasks(taskList);
  
      // Lấy idFile và tên file cho từng task
      const updatedFileNames = {};
      for (const task of taskList) {
        try {
          // Gọi API để lấy idFile từ taskId
          const fileIdResponse = await TaskService.getIdFileByIdTask(task.id, token);
          const idFile = parseInt(fileIdResponse, 10); // Chuyển chuỗi thành số
  
          if (!isNaN(idFile)) {
            // Lấy thông tin file từ idFile
            const fileData = await FileService.getFileById(idFile, token);
            if (fileData?.fileName) {
              updatedFileNames[task.id] = fileData.fileName;
            }
          }
        } catch (error) {
          console.error('Error fetching file for task:', task.id, error);
        }
      }
      setFileNames(updatedFileNames); // Cập nhật trạng thái tên file
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileChange = async (file, taskId) => {
    const token = localStorage.getItem('token');
    try {
      const uploadResponse = await FileService.uploadFile(file, token);
      if (uploadResponse?.includes("File uploaded successfully")) {
        const fileIdMatch = uploadResponse.match(/File ID: (\d+)/);
        const fileId = fileIdMatch ? parseInt(fileIdMatch[1], 10) : null;
  
        if (fileId) {
          message.success('File uploaded successfully!');
          
          const taskToUpdate = tasks.find(task => task.id === taskId);
          if (taskToUpdate) {
            const updatedTask = { 
              ...taskToUpdate, 
              idFile: fileId,
              fileName: file.name  
            };
            await TaskService.updateTask(taskId, updatedTask, token);
            fetchTasks();
          } else {
            message.error('Task not found');
          }
        }
      }
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      message.error('Error during file upload or task update.');
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
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

  const filteredTasks = tasks.filter((task) =>
    task.taskName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

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
      title: 'File Name',
      key: 'fileName',
      align: 'center',
      render: (_, record) => fileNames[record.id] || '-', 
    },
    {
      title: 'File Task',
      key: 'fileTask',
      align: 'center',
      render: (_, record) => (
        <Upload
          beforeUpload={(file) => {
            handleFileChange(file, record.id);
            return false; // Prevent automatic upload
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        record.id in fileNames && fileNames[record.id] ? (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(fileNames[record.id])} // Truyền fileName vào hàm handleDownload
          >
            Download
          </Button>
        ) : (
          <span>No file available</span>
        )
      ),
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
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 200 }}
        />
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
    </div>
  );
}

export default TaskManagementPage;