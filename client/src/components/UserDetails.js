import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

const UserDetails = ({ userDetails, onUserDetailsChange, updateUserDetails }) => {
    const [state, setState] = useState({
        loading: false,
        userDetailsModalOpen: false
    })

    const { loading, userDetailsModalOpen } = state;

    const closeUserDetailsModal = () => {
        setState({ ...state, userDetailsModalOpen: false, loading: false  })
    }

    const openUserDetailsModal = () => {
        setState({ ...state, userDetailsModalOpen: true })
    }


    const userDetailsDisplay = (
        userDetails &&
        <>
            <Button
                style={{ position: "relative", zIndex: 9 }}
                onClick={openUserDetailsModal}
                icon='edit'
                floated="right"
                basic
                color="blue" />
            <Form>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={userDetails.username}
                />

                <Form.Input
                    label="Firstname"
                    placeholder="Firstname"
                    name="firstname"
                    type="text"
                    value={userDetails.firstname}
                />
                <Form.Input
                    label="Lastname"
                    placeholder="Lastname"
                    name="lastname"
                    type="text"
                    value={userDetails.lastname}
                />

                <Form.Input
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={userDetails.email}
                />
            </Form>
        </>
    )

    const userDetailsForm = (
        userDetails && <Form className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Username"
                placeholder="Username"
                name="username"
                type="text"
                value={userDetails.username}
                onChange={onUserDetailsChange}
            />

            <Form.Input
                label="Firstname"
                placeholder="Firstname"
                name="firstname"
                type="text"
                value={userDetails.firstname}
                onChange={onUserDetailsChange}
            />
            <Form.Input
                label="Lastname"
                placeholder="Lastname"
                name="lastname"
                type="text"
                value={userDetails.lastname}
                onChange={onUserDetailsChange}
            />

            <Form.Input
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={userDetails.email}
                onChange={onUserDetailsChange}
            />
        </Form>
    )

    const stopLoading = () => {
        setState({ ...state, loading: false })
    }

    const updateUser = () => {
        setState({ ...state, loading: true })
        updateUserDetails(closeUserDetailsModal, stopLoading);
    }

    const userDetailsModal = (
        <Modal
            closeOnEscape={true}
            closeOnDimmerClick={true}
            open={userDetailsModalOpen}
            dimmer="blurring"
            size="tiny"
            onOpen={openUserDetailsModal}
            onClose={closeUserDetailsModal}
        >
            <Modal.Content>
                {userDetailsForm}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeUserDetailsModal} floated="left" basic>
                    Cancel
                </Button>
                <Button onClick={updateUser} primary>
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
        {userDetailsModal}
        {userDetailsDisplay}
        </>
    )
}

export default UserDetails
