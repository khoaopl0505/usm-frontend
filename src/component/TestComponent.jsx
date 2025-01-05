
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import UserService from '../service/UserService';
// import 'reactjs-popup/dist/index.css';
// import AddUserPopup from '../popup/AddUserPopup';


// function UserManagementPage() {
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, itemsPerPage]);


//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token'); 
//       const response = await UserService.getAllUsers(token);
//       setUsers(response.ourUsersList); 
//     } catch (error) {
//       setError('Error fetching users. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const deleteUser = async (userId) => {
//     try {
//       const confirmDelete = window.confirm('Are you sure you want to delete this user?');
//       const token = localStorage.getItem('token'); 
//       if (confirmDelete) {
//         await UserService.deleteUser(userId, token);
//         fetchUsers(); // Refresh user list after deletion
//       }
//     } catch (error) {
//       setError('Error deleting user. Please try again later.');
//     }
//   };


//   // Calculate pagination
//   const indexOfLastUser = currentPage * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

//   // Pagination controls
//   const totalPages = Math.ceil(users.length / itemsPerPage);

//   return (
//     <div className="user-management-container">
//       <h2>Users Management Page</h2>
//       <AddUserPopup refreshUsers={fetchUsers} /> {AddUserPopup}
      
//       {loading && <p>Loading users...</p>}
//       {error && <p className="error-message">{error}</p>}
      
//       {!loading && !error && (
//         <>
//           <table>
//             <thead>
//               <tr>
//                 <th className='label-table'>No.</th>
//                 <th className='label-table'>ID</th>
//                 <th className='label-table'>Name</th>
//                 <th className='label-table'>Email</th>
//                 <th className='label-table'>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentUsers.map((user, index) => (
//                 <tr key={user.id}>
//                   <td>{indexOfFirstUser + index + 1}</td> {/* Serial Number */}
//                   <td>{user.id}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>
//                     <button className='delete-button' onClick={() => deleteUser(user.id)}>Delete</button>
//                     <button>
//                       <Link to={`/update-user/${user.id}`}>
//                         Update
//                       </Link>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           <div className="pagination-controls">
//             <button 
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span>Page {currentPage} of {totalPages}</span>
//             <button 
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default UserManagementPage;

{/*
    import { Select } from 'antd';
    const { Option } = Select;
    <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                >
                    <Select>
                        <Option value="USER">User</Option>
                        <Option value="ADMIN">Admin</Option>
                    </Select>
                </Form.Item> */}



                // import { useState } from "react";
                // import UserService from "../service/UserService";
                // import { Form, Input, Button, message } from 'antd';
                // import PasswordStrengthBar from 'react-password-strength-bar';
                // import { useNavigate } from "react-router-dom";
                
                // function ForgotPassword(){
                
                //     const [loading, setLoading] = useState(false);
                //     const navigate = useNavigate();
                //     const [newPassword, setNewPassword] = useState('');
                //     const handleSubmit = async (value) =>{
                //         setLoading(true);
                //         try{
                //             const userData = {
                //                 password: value.password,
                //                 newPassword: value.newPassword,
                //             };
                            
                //             const response = await UserService.forgotPassword(value.email, userData)
                            
                //             if(response.statusCode === 200){
                //                 message.success('Check email to confirm reset password');
                //                 navigate('/login');
                //             }else{
                //                 message.error('Fail to reset password');
                //             }
                //         }catch(error){
                //             console.error('Error during reset password: ', error);
                //             message.error('Error reseting password');
                //         }finally{
                //             setLoading(false);
                //         }
                //     };
                //     return (
                //         <div className="auth-container">
                //             <h2>Forgot Password</h2>
                //             <Form
                //                 layout="vertical"
                //                 onFinish={handleSubmit}
                //             >
                //                 <Form.Item
                //                     label="Email"
                //                     name="email"
                //                     rules={[{ required: true, message: 'Please input your email!' }]}
                //                 >
                //                     <Input />
                //                 </Form.Item>
                
                //                 <Form.Item
                //                     label="Old Password"
                //                     name="password"
                //                     rules={[{ required: true, message: 'Please input your old password!' }]}
                //                 >
                //                     <Input.Password />
                //                 </Form.Item>
                
                //                 <Form.Item
                //                     label="New Password"
                //                     name="newPassword"
                //                     rules={[{ required: true, message: 'Please input your new password!' }]}
                //                 >
                //                     <Input.Password
                //                      value={newPassword}
                //                      onChange={(e) => setNewPassword(e.target.value)}
                //                       />
                //                     <PasswordStrengthBar password={newPassword} />
                //                 </Form.Item>
                
                //                 <Form.Item
                //                     label="Confirm New Password"
                //                     name="confirmPassword"
                //                     dependencies={['newPassword']}
                //                     rules={[
                //                         { required: true, message: 'Please confirm your new password!' },
                //                         ({ getFieldValue }) => ({
                //                             validator(_, value) {
                //                                 if (!value || getFieldValue('newPassword') === value) {
                //                                     return Promise.resolve();
                //                                 }
                //                                 return Promise.reject(new Error('The two passwords do not match!'));
                //                             },
                //                         }),
                //                     ]}
                //                 >
                //                     <Input.Password />
                //                 </Form.Item>
                
                //                 <Form.Item style={{textAlign: "center"}}>
                //                     <Button type="primary" htmlType="submit" loading={loading} >
                //                         Reset Password
                //                     </Button>
                //                 </Form.Item>
                //             </Form>
                //         </div>
                //     );
                // }
                
                // export default ForgotPassword;