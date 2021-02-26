import React, { useState, useContext } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { useForm } from '../../utils/hooks';
import { login } from '../../services/users.service';
import { Toast } from '../../utils/toast';
import { count } from '../../services/register-request.service';
import Emitter from '../../services/events';
import EventsTypes from '../../utils/EventsTypes';

const Login = ({ history }) => {
    const context = useContext(AuthContext)
    const initState = {
        loading: false,
        email: '',
        password: ''
    }
    const { onChange, onSubmit, values } = useForm(loginUser, initState)
    const [errors, setErrors] = useState({})

    const getUserRequestsCount = (user) => {
        user.isAdmin && count(user.token).then(
            (res) => {
                Emitter.emit(EventsTypes.REQUESTS_NUMBER, res.data);
            },
            error => {
                console.log(error);
            }
        )
    }

    const logUser = () => {
        const { email, password } = values;
        const data = { email, password };
        login(data).then(
            (res) => {
                context.login(res.data)
                getUserRequestsCount(res.data)
                history.push('/')
            },
            error => {
                Toast("ERROR", error.response.data.msg);
            }
        )
    }

    function loginUser() {
        logUser()
    }
    return (
        <Grid style={{ height: '80vh' }} verticalAlign='middle' columns={1} centered>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={12} computer={6}>
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
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default Login
