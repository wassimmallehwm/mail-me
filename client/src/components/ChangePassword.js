import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { changeUserPassword } from '../services/api'
import { Toast } from '../utils/toast';

const ChangePassword = ({user}) => {
    const [state, setState] = useState({
        loading: false,
        password: '',
        newPassword: '',
        newPasswordCheck: ''
    })

    const { loading, password, newPassword, newPasswordCheck } = state;

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const initInputs = () => {
        setState({
            ...state,
            loading: false,
            password: '',
            newPassword: '',
            newPasswordCheck: ''
        })
    }

    const changePass = (e) => {
        e.preventDefault();
        setState({...state, loading: true})
        changeUserPassword(user.token, {password, newPassword, newPasswordCheck})
        .then(
            res => {
                if(res.data){
                    initInputs();
                    Toast("SUCCESS", "Password changed successfully");
                }
            },
            error => {
                setState({...state, loading: false})
                Toast("ERROR", "Error changing user password");
            }
        )
    }

    const changePasswordForm = (
        <Form onSubmit={changePass} className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Current Password"
                placeholder="Current Password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
            />

            <Form.Input
                label="New Password"
                placeholder="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={onChange}
            />
            <Form.Input
                label="Confirm New Password"
                placeholder="Confirm New Password"
                name="newPasswordCheck"
                type="password"
                value={newPasswordCheck}
                onChange={onChange}
            />
            <Button type="submit" floated="right" primary>
                Save
            </Button>
        </Form>
    )

    return changePasswordForm
}

export default ChangePassword
