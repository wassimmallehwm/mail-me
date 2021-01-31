import React from 'react'
import { Button, Grid } from 'semantic-ui-react'

const Error = ({error, tryAgain}) => {
    return (
        <Grid>
            <Grid.Column textAlign="center">
                <h1 style={{fontSize: '80px', color: 'lightgrey'}}>
                    {error.status}
                </h1>
                <h2 style={{marginTop: '-15px'}}>{error.message}</h2>
                <Button onClick={tryAgain}>Try again</Button>
            </Grid.Column>
        </Grid>
    )
}

export default Error
