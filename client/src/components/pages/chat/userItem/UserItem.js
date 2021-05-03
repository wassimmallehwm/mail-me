import React, { useEffect, useState } from 'react'
import { Image } from 'semantic-ui-react'
import config from '../../../../config';
import displayName from '../../../../utils/displayName';
import './userItem.css'

const UserItem = ({ user, online }) => {
    const imgUrl = config.publicUrl + "images/users/";

    const isOnline = () => {
        return online && user && online.find(elem => elem.user._id == user._id)
    }

    return user && (
        <div className="conversation">
            <div className="chatOnlineImgContainer">
                <Image avatar className="conversationImg" src={imgUrl + user?.imagePath} alt="Wassim Malleh" />
                <div className={isOnline() ? "chatOnlineBadge" : ""}></div>
            </div>
            <span className="conversationName"> {displayName(user)} </span>
        </div>
    )
}

export default UserItem
