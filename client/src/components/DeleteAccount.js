import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { remove } from '../services/users.service'
import { Toast } from '../utils/toast';

const DeleteAccount = () => {

    const { user, logout, login } = useContext(AuthContext);
    const [state, setState] = useState({
        loading: false,
        password: ''
    })

    const { loading, password } = state;

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const initInputs = () => {
        setState({
            ...state,
            loading: false,
            password: ''
        })
    }

    const onDeleteAccount = (e) => {
        e.preventDefault();
        setState({...state, loading: true})
        remove(user.token, {password}, user._id)
        .then(
            res => {
                if(res.data){
                    logout();
                }
            },
            error => {
                setState({...state, loading: false})
                Toast("ERROR", "Error deleting the account");
            }
        )
    }

    const deleteAccountForm = (
        <Form onSubmit={onDeleteAccount} className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
            />
            <Button type="submit" floated="right" negative>
                Delete
            </Button>
        </Form>
    )

    return deleteAccountForm
}

export default DeleteAccount
