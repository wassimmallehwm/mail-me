import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import {useForm} from '../../utils/hooks';
import { login } from '../../services/api';

const Login = ({history}) => {
    const context = useContext(AuthContext)
    const initState = {
        loading: false,
        email: '',
        password: ''
    }
    const {onChange, onSubmit, values } = useForm(loginUser, initState)
    const [errors, setErrors] = useState({})

    const logUser = () => {
        const {email, password} = values;
        const data = {email, password};
        login(data).then(
            (res) => {
              context.login(res.data)
              history.push('/')
            },
            error => {
              console.log(error)
            }
        )
    }

    function loginUser(){
        logUser()
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={values.loading ? "loading" : ''} noValidate>
                <h1>Login</h1>

                <Form.Input
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 &&
                (
                    <div className="ui error message">
                        <ul className="list">
                            {
                                Object.values(errors).map(value => (
                                    <li key={value}>{value}</li>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

export default Login
