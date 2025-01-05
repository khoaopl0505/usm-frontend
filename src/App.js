import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './component/common/Navbar';
import LoginPage from './component/auth/LoginPage';
import RegistrationPage from './component/auth/RegistrationPage';
import FooterComponent from './component/common/Footer';
import UserService from './component/service/UserService';
import UpdateUser from './component/userpage/UpdateUser';
import UserManagementPage from './component/userpage/UserManagement';
import ProfilePage from './component/userpage/ProfilePage';
import UnlockAccount from './component/auth/UnlockAccount';
import ForgotPassword from './component/auth/ForgotPassword';
import GroupManagementPage from './component/userpage/GroupPage';
import ProjectManagementPage from './component/userpage/ProjectPage';
import ConfirmEmail from './component/userpage/ConfirmEmail';
import TaskManagementPage from './component/userpage/TaskPage';
import MyTaskPage from './component/userpage/MyTaskPage';


function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-task" element={<MyTaskPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/unlock" element={<UnlockAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            {/* Check if user is authenticated and admin before rendering admin-only routes */}
            {UserService.adminOnly() && (
              <>
                
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
                <Route path="/admin/group" element={<GroupManagementPage />} />
                <Route path="/admin/project" element={<ProjectManagementPage />} />
                <Route path="/admin/task" element={<TaskManagementPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
