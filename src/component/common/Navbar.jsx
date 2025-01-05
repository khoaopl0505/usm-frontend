import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import { Layout, Menu } from 'antd';
function Navbar() {
    const [navbarKey, setNavbarKey] = useState(0);
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();
    const { Header } = Layout;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        
        setNavbarKey((prevKey) => prevKey + 1);
      }, [location.pathname]);

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
            navigate('/login');
        }
    };

    return (
        <Header key={navbarKey}>
            <Menu mode="horizontal" theme="dark">
                {!isAuthenticated && (
                    <Menu.Item key="home">
                        <Link to="/">Login Page</Link>
                    </Menu.Item>
                )}
                {!isAuthenticated && (
                    <Menu.Item key="register">
                        <Link to="/register">Register Page</Link>
                    </Menu.Item>
                )}
                {!isAuthenticated && (
                    <Menu.Item key="unlock">
                        <Link to="/unlock">Unlock Account</Link>
                    </Menu.Item>
                )}
                {isAuthenticated && (
                    <Menu.Item key="profile">
                        <Link to="/profile">Profile Page</Link>
                    </Menu.Item>
                )}
                {isAuthenticated && (
                    <Menu.Item key="my-task">
                        <Link to="/my-task">My Task Page</Link>
                    </Menu.Item>
                )}
                {isAdmin && (
                    <Menu.Item key="user-management">
                        <Link to="/admin/user-management">User Management</Link>
                    </Menu.Item>
                )}
                {isAdmin && (
                    <Menu.Item key="group management">
                        <Link to="/admin/group">Group Management</Link>
                    </Menu.Item>
                )}
                {isAdmin && (
                    <Menu.Item key="project management">
                        <Link to="/admin/project">Project Management</Link>
                    </Menu.Item>
                )}
                {isAdmin && (
                    <Menu.Item key="task management">
                        <Link to="/admin/task">Task Management</Link>
                    </Menu.Item>
                )}
                {isAuthenticated && (
                    <Menu.Item key="logout" onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                )}
            </Menu>
        </Header>
    );
}

export default Navbar;