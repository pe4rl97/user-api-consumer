import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';
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
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string>('');

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            setApiError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setApiError('Failed to fetch users. Please try again.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleAddUser = async () => {
        const result = await addUser(formData);
        if (result.success) {
            fetchUsers();
            setFormData(initialState);
            setShowModal(false);
            setValidationErrors({});
        } else {
            setValidationErrors(result.errors || {});
        }
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setFormData(user);
        setShowModal(true);
        setValidationErrors({});
    };

    const handleUpdateUser = async () => {
        if (!editUser?.userId) return;

        const result = await updateUser(editUser.userId, formData);
        if (result.success) {
            fetchUsers();
            setEditUser(null);
            setFormData(initialState);
            setShowModal(false);
            setValidationErrors({});
        } else {
            console.log(result.errors);
            setValidationErrors(result.errors || {});
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (confirm("Are you sure you want to delete?") === true) {
            const success = await deleteUserById(id);
            if (success) {
                fetchUsers();
            } else {
                setApiError('Failed to delete user. Please try again.')
            }
        }
    };

    const resetState = () => {
        setFormData(initialState);
        setEditUser(null);
        setValidationErrors({});
        setApiError('');
        setShowModal(false);
    }

    return (
        <div className="container mt-4">
            <h1>User Management</h1>
            {apiError && <Alert variant='danger'>{apiError}</Alert>}
            <Button variant="primary" onClick={() => {
                setShowModal(true);
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

            <Modal show={showModal} onHide={resetState}>
                <Modal.Header closeButton>
                    <Modal.Title>{editUser ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                isInvalid={!!validationErrors.userName}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.userName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">   
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                name="userAge"
                                value={formData.userAge}
                                onChange={handleInputChange}
                                isInvalid={!!validationErrors.userAge}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.userAge}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                name="userSalary"
                                value={formData.userSalary}
                                onChange={handleInputChange}
                                isInvalid={!!validationErrors.userSalary}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.userSalary}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="userMobileNumber"
                                value={formData.userMobileNumber}
                                onChange={handleInputChange}
                                isInvalid={!!validationErrors.userMobileNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.userMobileNumber}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetState}>
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