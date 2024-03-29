import React, { useContext, useState } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { useForm } from '../../utils/hooks';
import { register } from '../../services/users.service';
import { Toast } from '../../utils/toast';

const Register = ({ history }) => {
    const context = useContext(AuthContext)
    const initState = {
        username: '',
        password: '',
        email: '',
        loading: false,
        passwordCheck: ''
    }
    const { onChange, onSubmit, values } = useForm(registerUser, initState)
    const [errors, setErrors] = useState({})

    const regUser = () => {
        const { username, email, password, passwordCheck } = values;
        const data = { username, email, password, passwordCheck };
        register(data).then(
            (res) => {
                if(res.data){
                    Toast("SUCCESS", "Registered successfully");
                    Toast("INFO", "You will get notified by mail when the account is activated");
                    history.push('/')
                }
            },
            error => {
                console.log(error)
                Toast("ERROR", error.response.data.msg);
            }
        )
    }

    function registerUser() {
        regUser()
    }
    return (
        <Grid style={{height: '80vh'}} verticalAlign='middle' columns={1} centered>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={12} computer={6}>
                    <Form onSubmit={onSubmit} className={values.loading ? "loading" : ''} noValidate>
                        <h1>Register</h1>

                        <Form.Input
                            label="Username"
                            placeholder="Username"
                            name="username"
                            type="text"
                            value={values.username}
                            error={errors.username ? true : false}
                            onChange={onChange}
                        />

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

                        <Form.Input
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            name="passwordCheck"
                            type="password"
                            value={values.passwordCheck}
                            error={errors.passwordCheck ? true : false}
                            onChange={onChange}
                        />
                        <Button type="submit" primary>
                            Register
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

export default Register
