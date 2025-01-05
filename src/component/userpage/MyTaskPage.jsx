import React, { useState, useEffect } from 'react';
import { Table, Input, Pagination, Typography } from 'antd';
import moment from 'moment';
import TaskService from '../service/TaskService';
import UserService from '../service/UserService';

const { Title } = Typography;

function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // First get the user profile to get the user ID
      const profileResponse = await UserService.getYourProfile(token);
      const userId = profileResponse?.user?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Then use the user ID to fetch tasks
      const taskResponse = await TaskService.getTaskByIdUser(userId, token);
      setTasks(taskResponse.taskList || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
    }
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