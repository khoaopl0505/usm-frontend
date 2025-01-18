import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import UserService from '../service/UserService';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (value) => {
    setLoading(true);
    try {
   
        const userData = {
            newPassword: value.newPassword,
        };
        const response = await UserService.forgotPassword(value.email, userData)
      if (response.data.statusCode === 200) {
        message.success(response.data.message);
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi gửi yêu cầu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="forgot_password"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: 'auto', marginTop: '50px' }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email của bạn!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Xác nhận thay đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
