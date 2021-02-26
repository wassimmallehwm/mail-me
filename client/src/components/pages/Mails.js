import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../context/auth';
import { mailsList } from '../../services/api';
import { Table, Icon, Grid } from 'semantic-ui-react';
import moment from 'moment';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';
import NoData from '../NoData';

const Mails = ({ history }) => {
    const { user } = useContext(AuthContext);
    const [state, setState] = useState({
        mails: null
    })

    const { mails } = state;

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    useEffect(() => {
        user && mailsList(user.token).then(
            (res) => {
                setState({ mails: res.data })
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading mails");
            }
        )
    }, []);

    const openMail = (data) => {
        history.push('/mails/content', data);
    }


    const mailsTable = (
        <Grid.Row>
            {
                mails && mails.length > 0 ? (
                    <>
                        <Table selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>E-mail</Table.HeaderCell>
                                    <Table.HeaderCell>Sent On</Table.HeaderCell>
                                    <Table.HeaderCell>Read</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    mails.map((mail, i) => (
                                        <Table.Row key={i} onClick={() => openMail(mail)}>
                                            <Table.Cell>{mail.to}</Table.Cell>
                                            <Table.Cell> {formatDate(mail.createdAt)} </Table.Cell>
                                            <Table.Cell> {mail.read ? (<Icon className="checkmark-icon" name='checkmark' />) : (<Icon style={{float: 'none'}} name='close' />)} </Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                    </>
                ) :
                    (

                        <NoData />
                    )
            }
        </Grid.Row>
    )

    return (
        <Grid columns={1} className="main-grid">
            {mails ? mailsTable : (<Loading />)}
        </Grid>
    )
}

export default Mails
