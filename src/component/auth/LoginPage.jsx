import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from 'antd';
import UserService from "../service/UserService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try {
            const userData = await UserService.login(values.email, values.password);
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                navigate('/profile');
            } else {
                setError(userData.message);
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2 >Login</h2>
            <Form
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{ email, password }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                {error && (
                    <Form.Item>
                        <Alert message={error} type="error" showIcon />
                    </Form.Item>
                )}
                <Form.Item style={{textAlign: "center"}}>
                    <Button  type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                <p>Not a member? <a href="http://localhost:3000/register">Register</a></p>
                <p>Forgot password? <a href="http://localhost:3000/forgot-password">Reset password</a></p>
                </Form.Item>
            </Form>
        </div>
    );
}

export default LoginPage;
