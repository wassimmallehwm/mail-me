import React from 'react'
import { Image } from 'semantic-ui-react';
import config from '../../../../config';
import './message.css'
import { format } from 'timeago.js';
import Tooltip from '../../../tooltips/Tooltip';
import moment from 'moment';
import ProfileTooltip from '../../../tooltips/ProfileTooltip';

const Message = ({ message, own, nextMessage, redirect }) => {
    const imgUrl = config.publicUrl + "images/users/";

    const sameSender = () => {
        const messageDate = moment(message.createdAt)
        const nextMessageDate = moment(nextMessage?.createdAt)
        return nextMessage && messageDate.diff(nextMessageDate, 'seconds') <= 30
            && message.sender._id == nextMessage.sender._id;
    }

    // const seenMessage = () => {
    //     return own && message.seen && (!nextMessage || !nextMessage.seen)
    // }

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                {
                    own ? null :
                        (
                            <ProfileTooltip user={message.sender} redirect={redirect}>
                                <Image avatar className="messageImg" src={imgUrl + message.sender.imagePath} alt={message.sender.username} />
                            </ProfileTooltip>
                        )
                }

                <p className="messageText">
                    {message.text}
                </p>
                {/* {seenMessage() && (
                    <Image avatar className="seenImg" src={imgUrl + receiver.imagePath} alt={receiver.username} />
                )} */}
            </div>
            {
                sameSender() ?
                    null :
                    (
                        <Tooltip size="mini" content={(<span className="messageBottomTiny">{formatDate(message.createdAt)}</span>)}>
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
