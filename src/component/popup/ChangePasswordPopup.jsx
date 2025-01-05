import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';

function ChangePasswordPopup({ userId, visible, onClose }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    useEffect(() => {
        if (visible && userId) {
            const fetchUserData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await UserService.getUserById(userId, token);
                    form.setFieldsValue(response.user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    message.error('Failed to fetch user data');
                }
            };

            fetchUserData();
        }
    }, [visible, userId, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userData = {
                password: values.password,
                newPassword: values.newPassword
            };

            const response = await UserService.changePassword(userId, userData, token);

            if (response.statusCode === 200) {
                message.success('Check email to confirm change password');
                // onClose();
                // form.resetFields();
                UserService.logout();
                navigate('/login');
            } else {
                message.error('Failed to change password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            message.error('Failed to change password');
        } finally{
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Change Password"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form 
                form={form} 
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Old Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your old password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordStrengthBar password={newPassword} />
                </Form.Item>
                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ChangePasswordPopup;