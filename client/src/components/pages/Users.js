import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Grid, Modal, Table, Image, Checkbox } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth'
import { findAll, findOne, removeUser, addOrUpdateUser } from '../../services/users.service'
import { Toast } from '../../utils/toast';
import Loading from '../Loading';
import moment from 'moment';
import NoData from '../NoData';
import config from '../../config';

const Users = () => {
    const { user } = useContext(AuthContext)

    const initUser = {
        email: "",
        enabled: false,
        firstname: "",
        imagePath: "",
        lastname: "",
        role: "",
        username: "",
        _id: ""
    }

    const [loading, setLoading] = useState(false);
    const [usersList, setUsersList] = useState(null);
    const [editUser, setEditUser] = useState(initUser);
    const [deleteUser, setDeleteUser] = useState(null);
    const [editUserModal, setEditUserModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [mode, setMode] = useState('add');
    const imgUrl = config.publicUrl + "images/users/";

    const getUsers = () => {
        user && findAll(user.token).then(
            (res) => {
                setUsersList(res.data)
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading users");
            }
        )
    }

    const getOneUser = (id) => {
        user && findOne(user.token, id).then(
            (res) => {
                setEditUser(res.data);
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading user details");
            }
        )
    }

    const removeItem = (id) => {
        let list = usersList.filter(elem => elem._id != id);
        setUsersList(list);
    }

    const addItem = (item) => {
        let list = usersList;
        list.push(item);
        setUsersList(list);
    }

    const updateItem = (item) => {
        let list = usersList;
        const index = list.findIndex(elem => elem._id == item._id)
        list[index] = item;
        setUsersList(list);
    }

    const removeUserAccount = () => {
        user && removeUser(user.token, deleteUser).then(
            (res) => {
                removeItem(deleteUser)
                Toast("SUCCESS", "User deleted successfully");
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error deleting user !");
            }
        )
    }

    useEffect(() => {
        getUsers();
    }, []);

    const addOrEditUser = () => {
        setLoading(true);
        let userData = null
        if(mode === 'add'){
            userData = {...editUser, password, passwordCheck}
        } else {
            userData = editUser
        }
        user && addOrUpdateUser(user.token, mode, userData).then(
            (res) => {
                setLoading(false);
                if(mode === 'add'){
                    addItem(res.data);
                }else {
                    updateItem(res.data);
                }
                closeAddModal();
                Toast("SUCCESS", "User details saved successfully");
            },
            error => {
                console.log(error);
                setLoading(false);
                Toast("ERROR", "Error saving user details !");
            }
        )
    }

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    const openAddModal = () => {
        setEditUserModal(true)
    }

    const closeAddModal = () => {
        setMode('add')
        setEditUserModal(false)
        setEditUser(initUser)
    }

    const openEditModal = (data) => {
        setMode('edit')
        setEditUser(data)
        getOneUser(data._id)
        openAddModal()
    }

    const openDeleteModal = (data) => {
        setDeleteUser(data)
        setDeleteUserModal(true);
    }

    const closeDeleteModal = (data) => {
        setDeleteUser(null)
        setDeleteUserModal(false);
    }

    const onEditUserChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value })
    }

    const onChangeEnabled = (e, data) => {
        setEditUser({ ...editUser, enabled: data.checked })
    }

    const userDetailsForm = (
        <Form className={loading ? "loading" : ''} noValidate>
            <Checkbox label='Enabled' checked={editUser.enabled} onChange={onChangeEnabled} />
            {editUser.imagePath && <Image className="edit-user-img" floated="right" circular size='tiny' src={imgUrl + editUser.imagePath} />}
            <Form.Input
                label="Username"
                placeholder="Username"
                name="username"
                type="text"
                value={editUser.username}
                onChange={onEditUserChange}
            />

            <Form.Input
                label="Firstname"
                placeholder="Firstname"
                name="firstname"
                type="text"
                value={editUser.firstname}
                onChange={onEditUserChange}
            />
            <Form.Input
                label="Lastname"
                placeholder="Lastname"
                name="lastname"
                type="text"
                value={editUser.lastname}
                onChange={onEditUserChange}
            />

            <Form.Input
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={editUser.email}
                onChange={onEditUserChange}
            />
            {
                mode === 'add' ?
                (
                    <>
                    <Form.Input
                            label="Password"
                            placeholder="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Form.Input
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            name="passwordCheck"
                            type="password"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                    </>
                ): null
            }
        </Form>
    )

    const addUserModal = (
        <Grid.Column floated="right">
            <Modal
                closeOnEscape={true}
                closeOnDimmerClick={true}
                open={editUserModal}
                dimmer="blurring"
                size="tiny"
                onOpen={openAddModal}
                onClose={closeAddModal}
                trigger={<Button primary icon='plus' floated="right" />}
            >
                <Modal.Header>
                    <h4>{mode === 'add' ? 'Add User' : 'Edit User'}</h4>
                </Modal.Header>
                <Modal.Content>
                    {userDetailsForm}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeAddModal} basic>
                        Cancel
            </Button>
                    <Button onClick={addOrEditUser} primary>
                        Save
            </Button>
                </Modal.Actions>
            </Modal>
        </Grid.Column>
    );

    const deleteModal = (
        <Modal
            closeOnEscape={true}
            closeOnDimmerClick={true}
            open={deleteUserModal}
            dimmer="blurring"
            size="tiny"
            onOpen={() => setDeleteUserModal(true)}
            onClose={closeDeleteModal}
        >
            <Modal.Header>Confirmation</Modal.Header>
            <Modal.Content>
                <h3>Are you sure you want to delete the User ?</h3>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeDeleteModal} basic>
                    Cancel
        </Button>
                <Button onClick={removeUserAccount} negative>
                    Delete
        </Button>
            </Modal.Actions>
        </Modal>
    );

    const dataTable = (
        <Grid.Row>
            {
                usersList && usersList.length > 0 ? (
                    <Table selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Role</Table.HeaderCell>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                usersList.map((data, i) => (
                                    <Table.Row key={data._id}>
                                        <Table.Cell>{data.username}</Table.Cell>
                                        <Table.Cell>{data.role.label}</Table.Cell>
                                        <Table.Cell>{formatDate(data.createdAt)}</Table.Cell>
                                        {
                                            data.role.label != 'ADMIN' ?
                                                (
                                                    <Table.Cell>
                                                        <Button onClick={() => openEditModal(data)} circular primary icon='edit' />
                                                        <Button onClick={() => openDeleteModal(data._id)} circular negative icon='trash' />
                                                    </Table.Cell>
                                                )
                                                : null
                                        }

                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                ) :
                    (
                        <NoData />
                    )
            }

        </Grid.Row>
    )

    return (
        <Grid columns={1} className="main-grid">
            {addUserModal}
            {deleteModal}
            {usersList ? dataTable : (<Loading />)}
        </Grid>
    )
}

export default Users
