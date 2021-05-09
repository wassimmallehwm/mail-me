import React, { useContext, useState, useEffect } from 'react'
import { Button, Table, Grid, Modal, Form } from 'semantic-ui-react'
import { AuthContext } from '../../context/auth'
import { createOrUpdateAccount, accountsList, deleteUserAccount } from '../../services/api'
import { Toast } from '../../utils/toast';
import DeleteModal from '../DeleteModal';
import Loading from '../Loading';

const Accounts = () => {
    const { user } = useContext(AuthContext)

    const [state, setState] = useState({
        addEditModalOpen: false,
        deleteModalOpen: false,
        deleteAccount: null,
        accounts: null,
        Account: {
            label: '',
            email: ''
        },
        mode: "add",
        modalTitle: "Add Account",
        loading: false
    })
    const { addEditModalOpen, deleteModalOpen, deleteAccount, accounts, Account, mode, modalTitle, loading } = state

    useEffect(() => {
        user && accountsList(user.token).then(
            (res) => {
                setState({ ...state, accounts: res.data })
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading accounts");
            }
        )
    }, []);

    const onChangeAccount = (e) => {
        const acc = Account
        acc[e.target.name] = e.target.value;
        setState({ ...state, Account: acc })
    }

    const createOrUpdate = () => {
        setState({ ...state, loading: true })
        createOrUpdateAccount(user.token, mode, Account).then(
            (res) => {
                const acc = { label: '', email: '' }
                setState({ ...state, loading: false, addEditModalOpen: false, accounts: res.data, Account: acc })
            },
            error => {
                console.log(error);
                setState({ ...state, loading: false })
                Toast("ERROR", "Error creating the account");
            }
        )
    }

    const openDeleteModal = (data) => {
        setState({ ...state, deleteModalOpen: true, deleteAccount: data });
    }

    const closeDeleteModal = (data) => {
        setState({ ...state, deleteModalOpen: false, deleteAccount: null });
    }

    const removeAccount = () => {
        deleteUserAccount(user.token, { id: deleteAccount }).then(
            (res) => {
                setState({ ...state, deleteModalOpen: false, accounts: res.data, deleteAccount: null })
            },
            error => {
                console.log(error);
                setState({ ...state, deleteModalOpen: false, deleteAccount: null })
                Toast("ERROR", "Error deleting the account");
            }
        )
    }

    const deleteAccountModal = (
        <DeleteModal
            title="Are you sure you want to delete this account ?"
            deleteModalOpen={deleteModalOpen}
            //openDeleteModal={openDeleteModal}
            closeDeleteModal={closeDeleteModal}
            submit={removeAccount}
        />
    )


    const openEditAccountModal = (data) => {
        setState({ ...state, Account: data, mode: "edit", modalTitle: "Edit Account", addEditModalOpen: true })
    }

    const onModalClose = (e, data) => {
        const acc = { label: '', email: '' }
        setState({ ...state, Account: acc, mode: "add", modalTitle: "Add Account", addEditModalOpen: false });
    }

    const addAccountForm = (
        <Form className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Label"
                placeholder="Label"
                name="label"
                type="text"
                value={Account.label}
                onChange={onChangeAccount}
            />

            <Form.Input
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={Account.email}
                onChange={onChangeAccount}
            />
        </Form>
    )

    const addAccountModal = (
        <Grid.Column floated="right">
            <Modal
                closeOnEscape={true}
                closeOnDimmerClick={true}
                open={addEditModalOpen}
                dimmer="blurring"
                size="tiny"
                onOpen={() => setState({ ...state, addEditModalOpen: true })}
                onClose={onModalClose}
            >
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Content>
                    {addAccountForm}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onModalClose} basic>
                        Cancel
            </Button>
                    <Button onClick={createOrUpdate} primary>
                        Save
            </Button>
                </Modal.Actions>
            </Modal>
        </Grid.Column>
    );


    const dataTable = (
        <Grid.Row>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setState({ ...state, addEditModalOpen: true })} primary icon='plus' floated="right" />
            </div>
            {
                accounts && accounts.length > 0 ? (
                    <Table style={{border: 'none'}} selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Label</Table.HeaderCell>
                                <Table.HeaderCell>E-Mail</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                accounts.map((data, i) => (
                                    <Table.Row key={data._id}>
                                        <Table.Cell>{data.label}</Table.Cell>
                                        <Table.Cell> {data.email} </Table.Cell>
                                        <Table.Cell>
                                            <Button circular onClick={() => openEditAccountModal(data)} primary icon='edit' />
                                            <Button circular onClick={() => openDeleteModal(data._id)} negative icon='trash' />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                ) :
                    (
                        <h3>Create an account</h3>
                    )
            }

        </Grid.Row>
    )

    return (
        <Grid columns={1} className="main-grid">
            {addAccountModal}
            {deleteAccountModal}
            {accounts ? dataTable : (<Loading />)}
        </Grid>
    )
}

export default Accounts
