import React from 'react'
import Error from '../Error'

const NotFound = ({history}) => {
    const error = {status: 404, message: 'Page not found'}
    const backBtn = () => {
        history.goBack();
    }
    return (
        <Error error={error} btnLabel='Go back' tryAgain={backBtn}/>
    )
}

export default NotFound
