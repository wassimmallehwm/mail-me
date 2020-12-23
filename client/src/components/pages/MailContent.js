import React, {useEffect, useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { mailById } from '../../services/api';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';

const MailContent = () => {
    const { user } = useContext(AuthContext);
    const [state, setState] = useState({
        mail : null
    })

    const createMarkup = (body) => {
        return {__html: body};
    }

    const {mail} = state;

    const {mailId} = useParams();

    useEffect(() => {
        user && mailById(mailId, user.token).then(
          (res) => {
            setState({mail: res.data});
          },
          error => {
            console.log(error)
            Toast("ERROR", "Error loading mail content");
          }
        )
      }, []);

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
