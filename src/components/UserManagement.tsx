import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { User } from '../utils/types';
import { getAllUsers, addUser, updateUser, deleteUserById } from '../utils/ApiFunctions';

const initialState: User = { 
    userName: '',
    userAge: 0,
    userSalary: 0,
    userMobileNumber: ''
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<Partial<User> | null>(null);
    const [formData, setFormData] = useState<User>(initialState);

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddUser = async () => {
        if (formData.userName && formData.userAge && formData.userSalary && formData.userMobileNumber) {
            const success = await addUser(formData as User);
            if (success) {
                fetchUsers();
                setFormData(initialState);
                setShowModal(false);
            }
        }
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setFormData(user);
        setShowModal(true);
    };

    const handleUpdateUser = async () => {
        if (editUser && formData.userName && formData.userAge && formData.userSalary && formData.userMobileNumber) {
            const success = await updateUser(editUser.userId!, formData as User);
            if (success) {
                fetchUsers();
                setEditUser(null);
                setFormData(initialState);
                setShowModal(false);
            }
        }
    };

    const handleDeleteUser = async (id: number) => {
        const success = await deleteUserById(id);
        if (success) {
            fetchUsers();
        }
    };

    return (
        <div className="container mt-4">
            <h1>User Management</h1>
            <Button variant="primary" onClick={() => {
                setShowModal(true);
                setEditUser(null);
                setFormData(initialState); 
            }}>
                Add User
            </Button>

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Salary</th>
                        <th>Mobile Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userAge}</td>
                            <td>{user.userSalary}</td>
                            <td>{user.userMobileNumber}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user.userId!)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editUser ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">   
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="userAge"
                                value={formData.userAge}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="userSalary"
                                value={formData.userSalary}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="userMobileNumber"
                                value={formData.userMobileNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={editUser ? handleUpdateUser : handleAddUser}
                    >
                        {editUser ? 'Update' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;