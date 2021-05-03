import React from 'react'
import { Image } from 'semantic-ui-react';
import config from '../../../../config';
import './message.css'
import { format } from 'timeago.js';
import Tooltip from '../../../Tooltip';
import moment from 'moment';

const Message = ({ message, own, nextMessage }) => {
    const imgUrl = config.publicUrl + "images/users/";

    const sameSender = () => {
        const messageDate = moment(message.createdAt)
        const nextMessageDate = moment(nextMessage?.createdAt)
        return nextMessage && messageDate.diff(nextMessageDate, 'seconds') <= 30
        && message.sender._id == nextMessage.sender._id;
    }

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <Image avatar className="messageImg" src={imgUrl + message.sender.imagePath} alt="Wassim Malleh" />
                <p className="messageText"> {message.text} </p>
            </div>
            {
                sameSender() ? 
                null : 
                (
                    <Tooltip content={formatDate(message.createdAt)}>
                <div className="messageBottom">
                    {format(message.createdAt)}
                </div>
            </Tooltip>
                )
            }
        </div>
    )
}

export default Message
