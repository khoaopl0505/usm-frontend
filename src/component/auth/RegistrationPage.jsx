import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import UserService from '../service/UserService';
import moment from 'moment';


function RegistrationPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        email: '',
        password: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });

        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
                setPasswordError('Confirm password incorrect');
            } else if (name === 'confirmPassword' && value !== formData.password) {
                setPasswordError('Confirm password incorrect');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Confirm password incorrect');
            setLoading(false);
            return;
        }

        try {
            const userData = await UserService.register(formData);
            console.log(userData);

            if (userData.success) {
                navigate('/login', { state: { refresh: true } });
            } else {
                setError(userData.message || 'Registration failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during registration');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ margin_bottom: 100 }}>
            <h2>Registration</h2>
            {error && <Alert message={error} showIcon closable style={{ marginBottom: 24 }} />}
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleSubmit}
            >
                <Form.Item label="Name" required>
                    <Input 
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Date of Birth" required>
                    <DatePicker
                        name="dateOfBirth"
                        style={{ width: '100%' }}
                        value={formData.dateOfBirth ? moment(formData.dateOfBirth) : null}
                        onChange={(date, dateString) => handleInputChange('dateOfBirth', dateString)}
                    />
                </Form.Item>
                <Form.Item label="Email" required>
                    <Input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Password" required>
                    <Input.Password 
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <PasswordStrengthBar password={formData.password} />
                </Form.Item>
                <Form.Item label="Confirm Password" required>
                    <Input.Password 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    {passwordError && <p className="error-message" style={{ color: 'red' }}>{passwordError}</p>}
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default RegistrationPage;
