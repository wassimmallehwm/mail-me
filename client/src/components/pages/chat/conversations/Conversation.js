import React, { useEffect, useState } from 'react'
import { Image } from 'semantic-ui-react'
import config from '../../../../config';
import displayName from '../../../../utils/displayName';
import './conversation.css'

const Conversation = ({conversation, online, currentUserId}) => {
    const imgUrl = config.publicUrl + "images/users/";

    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(conversation.members.find(elem => elem._id != currentUserId))
    }, [])

    const isOnline = () => {
        return online && user && online.find(elem => elem.user._id == user._id)
    }

    return user && (
        <div className="conversation">
            {/* <Image avatar className="conversationImg" src={imgUrl + user.imagePath} alt="Wassim Malleh"/>
            <div className={isOnline() ? "chatOnlineBadge" : ""}  ></div> */}
            <div className="chatOnlineImgContainer">
                <Image avatar className="conversationImg" src={imgUrl + user?.imagePath} alt="Wassim Malleh" />
                <div className={isOnline() ? "chatOnlineBadge" : ""}></div>
            </div>
            <span className="conversationName"> {displayName(user)} </span>
        </div>
    )
}

export default Conversation
