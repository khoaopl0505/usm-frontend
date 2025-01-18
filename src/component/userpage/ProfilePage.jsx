import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Card, Descriptions, Button } from 'antd';
import UpdateUserPopup from '../popup/UpdateUserPopup';
import ChangePasswordPopup from '../popup/ChangePasswordPopup';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isChangePasswordPopupVisible, setIsChangePasswordPopupVisible] = useState(false);
    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const handleOpenPopup = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleOpenPopupChangePassowrd = () => {
        setIsChangePasswordPopupVisible(true);
    };

    const handleClosePopupChangePassowrd = () => {
        setIsChangePasswordPopupVisible(false);
    };

    const refreshProfile = () => {
        fetchProfileInfo();
    };

    return (
        <div className="profile-page-container">
            <Card title="Profile Information" style={{ width: '100%' }}  style-header={{ textAlign: 'center' }}>
                <Descriptions>
                    <Descriptions.Item label="ID">{profileInfo.id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{profileInfo.name}</Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">{profileInfo.dateOfBirth}</Descriptions.Item>
                    <Descriptions.Item label="Email">{profileInfo.email}</Descriptions.Item>      
                    <Descriptions.Item label="Group">{profileInfo.group?.groupName }</Descriptions.Item>
                    <Descriptions.Item label="PhoneNumber">{profileInfo.phoneNumber }</Descriptions.Item>
                    <Descriptions.Item label="Status">{profileInfo.statusUser }</Descriptions.Item>
                </Descriptions>

                <div>
                <Button type="primary" onClick={handleOpenPopup}>
                        Update Profile
                    </Button>
            
                  <Button type="primary" onClick={handleOpenPopupChangePassowrd}>
                     Change Password
                  </Button>
                </div>
            </Card> 

            {isPopupVisible && (
                <UpdateUserPopup
                  userId={profileInfo.id}
                  visible={isPopupVisible}
                  onClose={handleClosePopup}
                  refreshProfile={refreshProfile}
                />
            )}

            {isChangePasswordPopupVisible && (
                <ChangePasswordPopup
                  userId={profileInfo.id}
                  visible={isChangePasswordPopupVisible}
                  onClose={handleClosePopupChangePassowrd}
                  refreshProfile={refreshProfile}
                />
            )}
        </div>
    );
}

export default ProfilePage;
