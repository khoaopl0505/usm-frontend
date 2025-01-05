// src/components/UnlockAccount.js

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

function UnlockAccount() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await UserService.unlockAccount(values.email);
            if (response.success) {
                message.success('Account unlocked successfully. Please check your email.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error unlocking account:', error);
            message.error('An error occurred while unlocking the account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Form 
                form={form} 
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Unlock Account
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UnlockAccount;
