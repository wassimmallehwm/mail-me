import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

const Loading = () => {
    return (
        <Segment style={{width: '100%'}}>
            <Dimmer style={{height: '80vh', border: 'none'}} active inverted>
                <Loader inline='centered' size='large' inverted>Loading</Loader>
            </Dimmer>
        </Segment>
    )
}

export default Loading
