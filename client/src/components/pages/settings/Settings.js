import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react';
import { findSettings, updateSettings } from '../../../services/settings.service';
import Loading from '../../Loading';
import { Toast } from '../../../utils/toast';
import { AuthContext } from '../../../context/auth';

const Settings = () => {

    const { user } = useContext(AuthContext)
    const [settings, setSettings] = useState();
    const [loading, setLoading] = useState(true);
    const [formLoading, setformLoading] = useState(false);

    useEffect(() => {
        findSettings().then(
            res => {
                setSettings(res.data)
                setLoading(false)
            },
            error => {
                console.log(error)
                setLoading(false)
            }
        )
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        setformLoading(true)
        updateSettings(user.token, settings).then(
            res => {
                if(res.data.success){
                    Toast("SUCCESS", "Settings updated successfully")
                    setformLoading(false)
                }
            }, error => {
                Toast("ERROR", "Updating settings failed")
                setformLoading(false)
            }
        )
    }

    const onChange = (e) => {
        setSettings({...settings, guestUrl: e.target.value})
    }


    const settingsForm = (
        settings && <Grid style={{ height: '80vh', margin: "2rem auto" }} columns={1} centered>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={12} computer={6}>
                    <Form onSubmit={onSubmit} className={formLoading ? "loading" : ''} noValidate>
                        <Form.Input
                            label="Guest url"
                            placeholder="Guest url"
                            name="url"
                            type="email"
                            value={settings.guestUrl}
                            onChange={onChange}
                        />
                        <Button floated="right" type="submit" primary>
                            Save
                        </Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
    return (
        <div>
            {
                loading ? 
                <Loading/> :
                settingsForm
            }
        </div>
    )
}

export default Settings
