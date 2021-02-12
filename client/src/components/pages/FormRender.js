import React, { useState, useEffect, useContext } from 'react'
import { Form, FormBuilder, FormEdit } from 'react-formio';
import Loading from '../Loading';
import Error from '../Error';
import { Button, Grid } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { getMenuForm, setMenuForm } from '../../services/menu.service';
import { formSubmit } from '../../services/api';

const FormRender = ({ match, history }) => {
    const { user } = useContext(AuthContext)
    const [state, setState] = useState({
        form: null
    })
    const [loading, setLoading] = useState(false)
    const [menu, setMenu] = useState(null)
    const initError = {
        isError: false,
        message: null,
        status: 500
    };
    const [error, setError] = useState(initError)
    const { form } = state;
    const { isError, message } = error;

    const getForm = () => {
        setLoading(true);
        getMenuForm(user.token, { menuId: match.params.menuId })
            .then(
                res => {
                    setState({ ...state, form: JSON.parse(res.data.form) })
                    setMenu(res.data.menu);
                    setLoading(false);
                    setError(initError)
                },
                error => {
                    let errorMessage = 'Server error';
                    let errorStatus = 500;
                    if (error.response) {
                        errorMessage = error.response.data.error
                        errorStatus = error.response.status
                    }
                    setLoading(false);
                    setError({ isError: true, message: errorMessage, status: errorStatus });
                }
            )
    }

    useEffect(() => {
        getForm();
    }, [match.params.menuId])

    const onFormSubmit = (event) => {
        if (event.data) {
            formSubmit(user.token, menu, event.data)
                .then(
                    res => {
                        history.push(menu.redirectMenu.url);
                    },
                    error => {
                        console.log(error)
                    }
                )
        }

    }

    const onFormChange = (event) => {
        console.log(event)
    }

    return (
        <Grid>
            <Grid.Row id="form-render">
                {
                    loading ?
                        (<Loading />) :
                        isError ?
                            (<Error error={error} tryAgain={getForm} />) :
                            (<Form form={form} onCustomEvent={onFormChange} onSubmit={onFormSubmit} />)
                }
            </Grid.Row>
        </Grid>
    )
}

export default FormRender
