import React, {useEffect, useContext, useState} from 'react'
import { AuthContext } from '../../context/auth';
import { mailsList } from '../../services/api';
import { Table, Icon } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';

const Mails = ({history}) => {
    const { user } = useContext(AuthContext);
    const [state, setState] = useState({
        mails: null
    })

    const {mails} = state;

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    useEffect(() => {
        user && mailsList(user.token).then(
            (res) => {
                setState({ mails: res.data })
                Toast("SUCCESS", "Mails loaded successfully");
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading mails");
            }
        )
    }, []);

    const openMail = (mailId) => {
        history.push('/mails/' + mailId);
    }


    const mailsTable = () => (
        mails ? (
            mails.length > 0 ? (
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
                                <Table.Row key={i} onClick={() => openMail(mail._id)}>
                                    <Table.Cell>{mail.to}</Table.Cell>
                                    <Table.Cell> {formatDate(mail.createdAt)} </Table.Cell>
                                    <Table.Cell> {mail.read ? (<Icon name='checkmark' />) : (<Icon name='close' />)} </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
                </>
                ) :
                (
                    <h3>You sent no mails</h3>
                )
        ) : (
            <Loading/>
        )
    )


    return mailsTable()
}

export default Mails
