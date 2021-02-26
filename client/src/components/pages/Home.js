import React, { useState, useContext, useEffect } from 'react'
import { Grid, Header, Form, Select } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import { accountsList, sendMail } from '../../services/api';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Toast } from '../../utils/toast';
import Loading from '../Loading';
import GuestHome from '../GuestHome';


const Home = () => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({
    mailBody: EditorState.createEmpty(),
    sender: '',
    receiver: '',
    subject: '',
    accounts: null,
    loading: false
  })

  const { receiver, sender, subject, accounts, mailBody } = state;
  
  const getUserAccounts = () => {
    user && accountsList(user.token).then(
      (res) => {
        let values = [];
        res.data.forEach(acc => {
          values.push({key: acc._id, value: acc.email, text: acc.label});
        })
        setState({ ...state, accounts: values })
      },
      error => {
        console.log(error);
        Toast("ERROR", "Error loading accounts");
      }
    )
  }

  useEffect(() => {
    getUserAccounts();
  }, []);


  const onEditorStateChange = (mailBody) => {
    setState({
      ...state,
      mailBody,
    });
  };

  const handleAccountChange = (event, data) => {
    setState({ ...state, sender: data.value })
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const onSubmit = (event) => {
    event.preventDefault();
    setState({ ...state, loading: true })
    const data = {
      mailBody: draftToHtml(convertToRaw(mailBody.getCurrentContent())),
      receiver,
      sender,
      subject,
      senderId: user.username
    }
    sendMail(data).then(
      () => {
        setState({ ...state, loading: false , sender: '', receiver: '', mailBody: ''})
        Toast("SUCCESS", "Email sent successfully");
      },
      error => {
        console.log(error)
        setState({ ...state, loading: false })
        Toast("ERROR", "Error sending the email");
      }
    )
  }


  const mailForm = () => (
    <>
      <Header as='h3'>Home Page</Header>
      <Form
        className={state.loading ? 'loading ui form ' : 'ui form main-form'}
        onSubmit={onSubmit}
      >
        <Form.Field className="ui left icon input fluid"
          control={Select}
          options={accounts}
          closeOnChange
          placeholder='Account'
          search
          searchInput={{ id: 'form-select-account' }}
          defaultValue={sender}
          onChange={handleAccountChange}
        />
        <div className="ui left icon input fluid">
          <i aria-hidden="true" className="at icon"></i>
          <input type="email" placeholder="To"
            name="receiver"
            value={receiver}
            onChange={handleChange}
          />
        </div>
        <div className="ui left icon input fluid">
          <i aria-hidden="true" className="envelope open icon"></i>
          <input type="text" placeholder="Subject"
            name="subject"
            value={subject}
            onChange={handleChange}
          />
        </div>
        <Editor
          editorState={state.mailBody}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
        />
        <button type="submit" className="ui primary right floated button">Send</button>
      </Form>
    </>
  );

  return (
    user ?
      accounts && accounts.length > 0 ?
        mailForm()
        : (<Loading />)
      : (
        <GuestHome/>
        
      )
  )
}

export default Home