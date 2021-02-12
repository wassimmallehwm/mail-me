import React, { useState, useEffect, useContext } from 'react'
import { Form, FormBuilder, FormEdit } from 'react-formio';
import { Button, Grid } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { getMenuForm, setMenuForm } from '../../services/menu.service';
import { Toast } from '../../utils/toast';
import Loading from '../Loading';

const FormCreator = ({history, location}) => {
    const { user } = useContext(AuthContext)
    const [state, setState] = useState({
        form: null,
        display: false,
        menuId: location.state,
        formRes: null
    })
    const { form, display, menuId, formRes } = state;

    const updateFormRes = (value) => {
        setState({ ...state, formRes: value })
    }

    const getForm = () => {
        getMenuForm(user.token, {menuId})
        .then(
            res => {
                let data = [];
                if(res.data.form != '[]'){
                    const value = JSON.parse(res.data.form)
                    data = value.components;
                }
                setState({...state, form: data})
            },
            error => {
                console.log(error)
            }
        )
    }

    useEffect(() => {
        getForm();
    }, [])

    const saveForm = () => {
        const formData = JSON.stringify(formRes)
        setMenuForm(user.token, {menuId, formData})
        .then(
            res => {
                Toast("SUCCESS", "Form saved successfully");
                history.push('/menus')
            },
            error => {
                console.log(error)
                Toast("ERROR", "Error while saving the form");
            }
        )
    }

    let defaultC = [{ "label": "HTML", "tag": "h1", "className": "", "attrs": [{ "attr": "", "value": "" }], "content": "default-page-title", "refreshOnChange": false, "customClass": "", "hidden": false, "modalEdit": false, "key": "html", "tags": [], "properties": {}, "conditional": { "show": null, "when": null, "eq": "", "json": "" }, "customConditional": "", "logic": [], "attributes": {}, "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" }, "type": "htmlelement", "input": false, "tableView": false, "placeholder": "", "prefix": "", "suffix": "", "multiple": false, "defaultValue": null, "protected": false, "unique": false, "persistent": false, "clearOnHide": true, "refreshOn": "", "redrawOn": "", "labelPosition": "top", "description": "", "errorLabel": "", "tooltip": "", "hideLabel": false, "tabindex": "", "disabled": false, "autofocus": false, "dbIndex": false, "customDefaultValue": "", "calculateValue": "", "calculateServer": false, "widget": null, "validateOn": "change", "validate": { "required": false, "custom": "", "customPrivate": false, "strictDateValidation": false, "multiple": false, "unique": false }, "allowCalculateOverride": false, "encrypted": false, "showCharCount": false, "showWordCount": false, "allowMultipleMasks": false, "id": "ednmtm" }];
    return (
        <>
            <Grid>
                <Grid.Row>
                <Button style={{ marginLeft: 'auto' }} floated="right" basic color="green" onClick={saveForm}>Save</Button>
            </Grid.Row>
                <Grid.Row id="form-builder" style={{ border: '0.2px solid lightgrey' }}>
                    {
                        form != null ? (
                            <FormBuilder
                        style={{ width: '100%' }}
                        form={{ display: "form", components: form }}
                        onChange={updateFormRes}
                    />
                        ) :
                        (<Loading/>)
                    }
                </Grid.Row>
            </Grid>
        </>
    )
}

export default FormCreator
