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

    // Reset form when modal opens
    useEffect(() => {
        if (visible) {
            form.resetFields();
            setNewPassword('');
        }
    }, [visible, form]);

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
                UserService.logout();
                navigate('/login');
            } else {
                message.error('Failed to change password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            message.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    // Handle new password change
    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        // Trigger validation for confirm password
        form.validateFields(['confirmPassword']);
    };

    return (
        <Modal
            title="Change Password"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
        >
            <Form 
                form={form} 
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Old Password"
                    name="password"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input your old password!' 
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input your new password!' 
                        }
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                >
                    <Input.Password
                        onChange={handleNewPasswordChange}
                    />
                </Form.Item>
                
                <PasswordStrengthBar password={newPassword} />

                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { 
                            required: true, 
                            message: 'Please confirm your new password!' 
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('The two passwords do not match!')
                                );
                            },
                        }),
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                       
                    >
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ChangePasswordPopup;