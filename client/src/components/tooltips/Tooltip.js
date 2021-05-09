import React from 'react'
import { Popup } from 'semantic-ui-react'

const Tooltip = ({content, size = "small", children}) => {
    return (
        <Popup
            trigger={children}
            content={content}
            size={size}
            basic>
        </Popup>
    )
}

export default Tooltip
