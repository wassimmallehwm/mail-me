import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

const UserDetails = ({ userDetails, onUserDetailsChange, updateUserDetails }) => {
    const [state, setState] = useState({
        loading: false
    })

    const { loading } = state;
    const stopLoading = () => {
        setState({ ...state, loading: false })
    }

    const updateUser = () => {
        setState({ ...state, loading: true })
        updateUserDetails(stopLoading);
    }

    const userDetailsDisplay = (
        userDetails &&
        <>
            <Form onSubmit={updateUser} className={loading ? "loading" : ''} noValidate>
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
                <Button type="submit" floated="right" primary>
                    Save
                </Button>
            </Form>
        </>
    )

    return userDetailsDisplay
}

export default UserDetails
