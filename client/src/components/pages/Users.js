import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Grid, Modal, Table, Image, Checkbox } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth'
import { findAll, findOne } from '../../services/users.service'
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

    useEffect(() => {
        getUsers();
    }, []);

    const addOrEditUser = () => {
        console.log(editUser)
    }

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    const openAddModal = () => {
        setEditUserModal(true)
    }

    const closeAddModal = () => {
        setEditUserModal(false)
        setEditUser(initUser)
    }

    const openEditModal = (data) => {
        setEditUser(data)
        getOneUser(data._id)
        openAddModal()
    }

    const openDeleteModal = (data) => {
        setDeleteUser(data)
        setDeleteUserModal(true);
    }

    const onEditUserChange = (e) => {
        setEditUser({...editUser, [e.target.name]: e.target.value})
    }

    const onChangeEnabled = (e, data) => {
        setEditUser({...editUser, enabled: data.checked})
    }

    const userDetailsForm= (
        <Form className={loading ? "loading" : ''} noValidate>
            <Checkbox label='Enabled' checked={editUser.enabled} onChange={onChangeEnabled}/>
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
                {editUser.imagePath && <Image circular size='tiny' src={imgUrl + editUser.imagePath} />}
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

    const dataTable = (
        <Grid.Row>
            {
                usersList && usersList.length > 0 ? (
                    <Table selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                usersList.map((data, i) => (
                                    <Table.Row key={data._id}>
                                        <Table.Cell>{data.username}</Table.Cell>
                                        <Table.Cell>{formatDate(data.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            <Button onClick={() => openEditModal(data)} circular primary icon='edit' />
                                            <Button onClick={() => openDeleteModal(data._id)} circular negative icon='trash' />
                                        </Table.Cell>
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
            {usersList ? dataTable : (<Loading />)}
        </Grid>
    )
}

export default Users
