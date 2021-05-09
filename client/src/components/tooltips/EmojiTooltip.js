import React from 'react'
import { Popup } from 'semantic-ui-react'
import { Picker } from 'emoji-mart'

const EmojiTooltip = ({ open, onSelect, children }) => {
    return (
        <Popup open={open} trigger={children} hoverable>
            <Popup.Content>
                <Picker onSelect={onSelect} set='facebook' skin={1} perLine={7} showPreview={false} showSkinTones={false} />
            </Popup.Content>
        </Popup>
    )
}

export default EmojiTooltip

