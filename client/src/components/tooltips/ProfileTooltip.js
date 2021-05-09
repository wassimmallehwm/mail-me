import React from 'react'
import { Button, Icon, Image, Popup } from 'semantic-ui-react'
import config from '../../config';
import displayName from '../../utils/displayName'

const ProfileTooltip = ({ user, redirect, children }) => {
    const imgUrl = config.publicUrl + "images/users/";
    const style = {
        borderRadius: 2,
        backgroundColor: 'var(--lightGray)',
        padding: '1.2em',
    }

    const container = {
        display: 'flex',
        alignItems: 'center'
    }

    const nameStyle = {
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
    
    const btnStyle = {
        borderRadius: 2,
        backgroundColor: 'var(--blue)',
        color: 'white',
        padding: '0.8em 1em',
    }

    const redirectTo = () => {
        redirect(`/${user.username}`)
    }
    return (
        <Popup
            trigger={children}
            hoverable
            style={style}
            basic
        >
            <Popup.Content>
                <div style={container}>
                    <Image className="profileImg" onClick={redirectTo} style={{ marginRight: '1rem', cursor: 'pointer' }} avatar size="tiny" src={imgUrl + user.imagePath} alt={user.username} />
                    <div style={{ textAlign: 'center' }}>
                        <p onClick={redirectTo} className="nameStyle" style={nameStyle}>{displayName(user)}</p>
                        <Button onClick={redirectTo} style={btnStyle}>
                            <Icon name='user' />
                            Profile
                        </Button>
                    </div>

                </div>
            </Popup.Content>
        </Popup>
    )
}

export default ProfileTooltip
