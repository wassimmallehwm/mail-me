import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

const Loading = () => {
    return (
        <Segment>
            <Dimmer active inverted>
                <Loader inline='centered' size='large' inverted>Loading</Loader>
            </Dimmer>
        </Segment>
    )
}

export default Loading
