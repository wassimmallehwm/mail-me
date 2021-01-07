import React, {useContext, useState} from 'react';
import { AuthContext } from '../../context/auth';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';

const MailContent = (props) => {
    const { user } = useContext(AuthContext);
    const [state, setState] = useState({
        mail : props.location.state
    })

    const createMarkup = (body) => {
        return {__html: body};
    }

    const {mail} = state;

    return (
        <div>
            {
                mail ? (
                    <div dangerouslySetInnerHTML={createMarkup(mail.body)}/>
                ) : (
                    <Loading/>
                )
            }
        </div>
    )
}

export default MailContent
