import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Button, message, DatePicker } from 'antd';
import moment from 'moment'; // Import thêm moment
import UserService from '../service/UserService';

function UpdateUserPopup({ userId, visible, onClose, refreshProfile }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Fetch user data and set fields
    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getUserById(userId, token);

            // Chuyển đổi dateOfBirth sang moment
            const userData = {
                ...response.user,
                dateOfBirth: response.user.dateOfBirth
                    ? moment(response.user.dateOfBirth)
                    : null,
            };

            form.setFieldsValue(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            message.error('Failed to fetch user data');
        }
    }, [userId, form]);

    useEffect(() => {
        if (visible && userId) {
            fetchUserData();
        }
    }, [visible, userId, fetchUserData]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Format dateOfBirth trước khi gửi
            const formattedValues = {
                ...values,
                dateOfBirth: values.dateOfBirth
                    ? values.dateOfBirth.format('YYYY-MM-DD')
                    : null,
            };

            await UserService.updateUser(userId, formattedValues, token);
            message.success('Profile updated successfully');
            refreshProfile();
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Update Profile"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select the date of birth' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UpdateUserPopup;
