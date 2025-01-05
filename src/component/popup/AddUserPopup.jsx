import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, notification } from 'antd';
import UserService from '../service/UserService';
import PasswordStrengthBar from 'react-password-strength-bar';

const { Option } = Select;

function AddUserModal({ refreshUsers }) {
  const [form] = Form.useForm();
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // Control modal visibility

  const handleFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      setPasswordError('Confirm password incorrect');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await UserService.register(values, token);

      notification.success({
        message: 'Success',
        description: 'User registered successfully',
      });

      refreshUsers();
      setVisible(false); // Close modal after successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while registering user',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    const password = form.getFieldValue('password');
    const confirmPassword = form.getFieldValue('confirmPassword');
    if (password !== confirmPassword) {
      setPasswordError('Confirm password incorrect');
    } else {
      setPasswordError('');
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Add User
      </Button>

      <Modal
        title="Add New User"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null} 
        destroyOnClose={true} 
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            role: 'USER',
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of birth"
            name="dateOfBirth"
            rules={[{ required: true, message: 'YYYY-MM-DD' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Invalid email address' }, { required: true, message: 'Please enter the email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter the password' }]}
          >
            <Input.Password onChange={handlePasswordChange} />
          </Form.Item>
          <PasswordStrengthBar password={form.getFieldValue('password')} />

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            hasFeedback
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError}
            rules={[{ required: true, message: 'Please confirm the password' }]}
          >
            <Input.Password onChange={handlePasswordChange} />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the role' }]}
          >
            <Select>
              <Option value="USER">USER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button style={{ marginLeft: '10px' }} onClick={() => setVisible(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddUserModal;
