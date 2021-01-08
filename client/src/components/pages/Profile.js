import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../context/auth';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';
import { Button, Image, Grid, Form, Modal, Loader, Segment, Dimmer } from 'semantic-ui-react';
import { uploadUserImage } from '../../services/api';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [state, setState] = useState({
        loading: false,
        modalLoading: false,
        selectedFile: null,
        previewImage: null,
        imagePreviewModalOpen: false
    })

    const {loading, modalLoading, selectedFile, previewImage, imagePreviewModalOpen} = state;

    const handleChange = (e) => {
        setState({...state, [e.target.name] : e.target.value})
    }

    const fileRef = useRef();

    const imgUrl = "http://localhost:4000/public/images/";
      
    const userDetailsForm = (
        <Form className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Username"
                placeholder="Username"
                name="username"
                type="text"
                value={user.username}
                onChange={handleChange}
            />

            <Form.Input
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
            />
        </Form>
    )

    const onImageClick = () => {
        fileRef.current.click();
    }

    const fileChnage = (event) => {
        setState({
            ...state,
            selectedFile: event.target.files[0],
            previewImage: URL.createObjectURL(event.target.files[0]),
            imagePreviewModalOpen: true
        })
    }

    const uploadImage = () => {
        setState({ ...state, modalLoading: true })
        const data = new FormData() 
        data.append('image', selectedFile)
        uploadUserImage(user.token, data).then(
            res => {
                user.imagePath = res.data.filename
                login(user);
                setState({ ...state, modalLoading: false, imagePreviewModalOpen: false })
            }, 
            error => {
                Toast("ERROR", "Error updating user image");
                setState({ ...state, modalLoading: false, imagePreviewModalOpen: false })
            }
        )
    }

    const closeImagePreviewModal = () => {
        setState({ ...state, imagePreviewModalOpen: false, modalLoading: false })
    }

    const imagePreviewModal = (
        <Modal
            closeOnEscape={true}
            closeOnDimmerClick={true}
            open={imagePreviewModalOpen}
            dimmer="blurring"
            size="tiny"
            onOpen={() => setState({ ...state, imagePreviewModalOpen: true })}
            onClose={closeImagePreviewModal}
        >
            <Modal.Content>
            <Dimmer.Dimmable as={Segment} dimmed={modalLoading}>
                <Dimmer inverted active={modalLoading} >
                <Loader active/>
                    </Dimmer>
                <Image size="medium" centered src={previewImage} style={{maxHeight: '50vh', width: 'auto'}}/>
            </Dimmer.Dimmable>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeImagePreviewModal} floated="left" basic>
                    Cancel
                </Button>
                <Button onClick={uploadImage} primary>
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    );


    return (
        <Grid columns={2} divided stackable>
            {imagePreviewModal}
            <input style={{display: "none"}} type="file" name="file" ref={fileRef} onChange={fileChnage}/>
    <Grid.Row>
      <Grid.Column width={4}>
        <Image style={{cursor: "pointer"}} onClick={onImageClick} size="medium" centered circular src={imgUrl + user.imagePath} />
      </Grid.Column>
      <Grid.Column width={12}>
        {user && userDetailsForm}
      </Grid.Column>
    </Grid.Row>
    </Grid>
    )
}

export default Profile
