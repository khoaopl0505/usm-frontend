import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import UserService from '../service/UserService';

const AddUserPopup = ({ refreshUsers, groupId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Tìm user theo email
      const user = await UserService.getUserByEmail(values.email, token);
      
      // Update group ID cho user
      await UserService.updateUser(user.id, { 
        group: { id: groupId }
      }, token);
      
      message.success('User added to group successfully');
      handleCancel();
      refreshUsers();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('User not found with this email');
      } else {
        message.error('Error adding user to group');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add User To Group
      </Button>
      
      <Modal
        title="Add User To Group"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserPopup;