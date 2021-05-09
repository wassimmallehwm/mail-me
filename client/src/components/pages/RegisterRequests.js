import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Grid, Table } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth'
import { findAll, validate, remove } from '../../services/register-request.service'
import { Toast } from '../../utils/toast';
import Loading from '../Loading';
import moment from 'moment';
import NoData from '../NoData';
import Emitter from '../../services/events';
import {ClientEvents} from '../../constants/EventConst'

const RegisterRequests = () => {

    const { user } = useContext(AuthContext)
    const [requestList, setRequestsList] = useState(null);

    const getRequests = () => {
        user && findAll(user.token).then(
            (res) => {
                setRequestsList(res.data)
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading users registrations requests");
            }
        )
    }

    useEffect(() => {
        getRequests();
    }, [])

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    const removeItem = (id) => {
        let list = requestList.filter(elem => elem._id != id);
        setRequestsList(list);
    }

    const validateUser = (id) => {
        user && validate(user.token, id).then(
            (res) => {
                Emitter.emit(ClientEvents.requestsNumber, res.data);
                removeItem(id);
                Toast("SUCCESS", "User request validated successfully");
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error validating user request");
            }
        )
    }

    const removeUser = (id) => {
        user && remove(user.token, id).then(
            (res) => {
                Emitter.emit(ClientEvents.requestsNumber, res.data);
                removeItem(id);
                Toast("SUCCESS", "User request rejected successfully");
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error removing user request");
            }
        )
    }

    const dataTable = (
        <Grid.Row>
            {
                requestList && requestList.length > 0 ? (
                    <Table selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                requestList.map(data => (
                                    <Table.Row key={data._id}>
                                        <Table.Cell>{data.user.username}</Table.Cell>
                                        <Table.Cell>{formatDate(data.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            <Button onClick={() => validateUser(data._id)} circular primary icon='checkmark' />
                                            <Button onClick={() => removeUser(data._id)} circular negative icon='trash' />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                ) :
                    (
                        <NoData />
                    )
            }

        </Grid.Row>
    )

    return (
        <Grid columns={1} className="main-grid">
            {/* {addUserModal} */}
            {requestList ? dataTable : (<Loading />)}
        </Grid>
    )
}

export default RegisterRequests
