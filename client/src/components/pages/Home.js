import React, { useState, useContext, useEffect } from 'react'
import { Grid, Header } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import { sendMail } from '../../services/api';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Toast } from '../../utils/toast';


const Home = () => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({
    mailBody: EditorState.createEmpty(),
    sender: '',
    receiver: '',
    subject: '',
    loading: false
  })

  const { receiver, sender, subject, mailBody } = state;


  const onEditorStateChange = (mailBody) => {
    setState({
      ...state,
      mailBody,
    });
  };

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
        console.log("Success")
        setState({ ...state, loading: false })
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
      <form
        className={state.loading ? 'loading ui form ' : 'ui form main-form'}
        onSubmit={onSubmit}
      >
        <div className="ui left icon input fluid">
          <i aria-hidden="true" className="at icon"></i>
          <input type="email" placeholder="Email"
            name="sender"
            value={sender}
            onChange={handleChange}
          />
        </div>
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
      </form>
    </>
  );

  return (
    user ?
      mailForm()
      : (
        <Grid columns={3}>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>
            <h5>Guest page</h5>
          </Grid.Column>
        </Grid>
      )
  )
}

export default Home