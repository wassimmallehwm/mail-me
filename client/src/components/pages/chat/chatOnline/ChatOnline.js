import React from 'react'
import { Image } from 'semantic-ui-react'
import config from '../../../../config';
import displayName from '../../../../utils/displayName';
import './chatOnline.css'

const ChatOnline = ({user}) => {
    const imgUrl = config.publicUrl + "images/users/";
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <Image avatar className="chatOnlineImg" src={imgUrl + user?.imagePath} alt="Wassim Malleh" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">
                    {displayName(user)}
                </span>
            </div>
        </div>
    )
}

export default ChatOnline
