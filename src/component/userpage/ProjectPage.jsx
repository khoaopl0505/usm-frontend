import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, message, Typography, Input, Modal, Form } from 'antd';
import ProjectService from '../service/ProjectService';
import moment from 'moment';

const { Title } = Typography;

function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await ProjectService.getListProject(token);
      setProjects(response.projectList || []);
    } catch (error) {
      setError('Error fetching projects. Please try again later.');
      message.error('Error fetching projects.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this project?');
      const token = localStorage.getItem('token');
      if (confirmDelete) {
        await ProjectService.deleteProject(projectId, token);
        fetchProjects();
        message.success('Project deleted successfully.');
      }
    } catch (error) {
      message.error('Error deleting project. Please try again later.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const showAddModal = () => {
    setModalType('add');
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (project) => {
    setModalType('edit');
    setEditingProject(project);
    form.setFieldsValue({
      id: project.id,
      projectName: project.projectName,
      implementationTime: moment(project.implementationTime).format('YYYY-MM-DDTHH:mm'),
      deadline: moment(project.deadline).format('YYYY-MM-DDTHH:mm'),
      description: project.description,
      projectLeader: project.projectLeader, // Set project leader for editing
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    setModalLoading(true);
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const payload = {
        ...values,
        implementationTime: moment(values.implementationTime).toISOString(),
        deadline: moment(values.deadline).toISOString(),
      };
      if (modalType === 'add') {
        await ProjectService.createProject(payload, token);
        message.success('Project added successfully!');
      } else if (modalType === 'edit') {
        await ProjectService.updateProject(editingProject.id, payload, token);
        message.success('Project updated successfully!');
      }
      fetchProjects();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving project. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
    },
    {
      title: 'Project Leader',
      dataIndex: 'projectLeader',
      key: 'projectLeader',
      align: 'center',
    },
    {
      title: 'Implementation Time',
      dataIndex: 'implementationTime',
      key: 'implementationTime',
      align: 'center',
      render: (time) => (time ? moment(time).format('YYYY-MM-DD HH:mm') : 'N/A'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      align: 'center',
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm'),
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
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button danger onClick={() => deleteProject(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const paginationProps = {
    current: currentPage,
    total: filteredProjects.length,
    pageSize: itemsPerPage,
    onChange: (page) => setCurrentPage(page),
  };

  return (
    <div className="project-management-container">
      <Title className="centered-title">PROJECT MANAGEMENT</Title>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search project name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 200 }}
        />
        <Button type="primary" onClick={showAddModal}>
          Add Project
        </Button>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <Table
            columns={columns}
            dataSource={currentProjects.map((project, index) => ({
              key: project.id,
              index: indexOfFirstProject + index + 1,
              id: project.id,
              projectName: project.projectName,
              implementationTime: project.implementationTime,
              deadline: project.deadline,
              description: project.description,
              projectLeader: project.projectLeader, // Include project leader in table data
            }))}
            pagination={false}
          />
          <Pagination {...paginationProps} />
        </>
      )}

      <Modal
        title={modalType === 'add' ? 'Add Project' : 'Edit Project'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Project Leader"
            name="projectLeader"
            rules={[{ required: true, message: 'Please enter project leader' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Implementation Time"
            name="implementationTime"
            rules={[{ required: true, message: 'Please enter implementation time' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: 'Please enter deadline' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter project description' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProjectManagementPage;
