import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/auth';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';
import { Button, Image, Grid, Form, Modal, Loader, Segment, Dimmer, Tab, Header } from 'semantic-ui-react';
import { uploadUserImage, updateUser } from '../../services/api';
import UserDetails from '../UserDetails';
import ChangePassword from '../ChangePassword';
import ImageEditor from '../ImageEditor';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [state, setState] = useState({
        loading: false,
        modalLoading: false,
        selectedFile: null,
        selectedFileName: null,
        selectedFileType: null,
        previewImage: null,
        imagePreviewModalOpen: false,
        tabIndex: 0,
        userDetails: null,
        active: false
    })

    const {active, modalLoading, selectedFile, selectedFileName, selectedFileType, previewImage, imagePreviewModalOpen, tabIndex, userDetails } = state;

    useEffect(() => {
        const {username, firstname, lastname, email} = user;
        const details = {username, firstname, lastname, email};
        setState({...state, userDetails: details});
    }, [])

    const panes = [
        { menuItem: 'Details', render: () => null},
        { menuItem: 'Change Password', render: () => null },
        { menuItem: 'Tab 3', render: () => null },
    ]

    const fileRef = useRef();

    const imgUrl = "http://localhost:4000/public/images/";

    const onImageClick = () => {
        fileRef.current.click();
    }

    const fileChnage = (event) => {
        setState({
            ...state,
            selectedFile: event.target.files[0],
            selectedFileName: event.target.files[0].name,
            selectedFileType: event.target.files[0].type,
            previewImage: URL.createObjectURL(event.target.files[0]),
            imagePreviewModalOpen: true
        })
    }

    const urltoFile = (url, filename, mimeType) => {
        return (fetch(url)
            .then((res) => {return res.arrayBuffer();})
            .then((buf) => {return new File([buf], filename,{type:mimeType});})
        );
    }

    const saveImageAfterChange = (url) => {
        urltoFile(url, selectedFileName, selectedFileType).then(
            res => {
                setState({ ...state, selectedFile: res })
            },
            error => {
                console.log(error)
            }
        )
    }

    const uploadImage = () => {
        setState({ ...state, modalLoading: true })
        const data = new FormData()
        data.append('image', selectedFile)
        uploadUserImage(user.token, data).then(
            res => {
                user.imagePath = res.data.filename
                login(user);
                setState({ ...state, modalLoading: false, imagePreviewModalOpen: false, previewImage: '' })
            },
            error => {
                Toast("ERROR", "Error updating user image");
                setState({ ...state, modalLoading: false })
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
                        <Loader active />
                    </Dimmer>
                    <ImageEditor imgUrl={previewImage} saveAfterChange={saveImageAfterChange}/>
                    {/* <Image size="medium" centered src={previewImage} style={{ maxHeight: '50vh', width: 'auto' }} /> */}
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

    const updateUserDetails = (succesCallback, errorCallback) => {
        updateUser(user.token, userDetails).then(
            res => {
                let userData = res.data;
                userData.token = user.token;
                login(userData);
                succesCallback();
            },
            error => {
                Toast("ERROR", "Error updating user details");
                errorCallback();
            }
        )
    }

    const onUserDetailsChange = (e) => {
        const data = userDetails
        data[e.target.name] = e.target.value;
        setState({...state, userDetails: data})
    }

    const onTabChange = (event, data) => {
        setState({...state, tabIndex: data.activeIndex})
    }

    const pageContent = () => {
        switch(tabIndex) {
            case 0 :
                return (<UserDetails 
                    userDetails={userDetails}
                    onUserDetailsChange={onUserDetailsChange}
                    updateUserDetails={updateUserDetails}
                    />);
            case 1 :
                return (<ChangePassword user={user}/>);
            default :
                return (<h1>TEST</h1>);
        }
    }

    const content = (
        <div>
          <Button onClick={onImageClick} inverted basic icon="edit"/>
        </div>
      )

      const handleShow = () => {
        setState({...state, active: true })
      }

      const handleHide = () => {
        setState({...state, active: false })
      }


    return (
        <Grid columns={2} divided stackable>
            {imagePreviewModal}
            <input style={{ display: "none" }} type="file" name="file" ref={fileRef} onChange={fileChnage} />
            <Grid.Row>
                <Grid.Column width={4}>
                    {/* <Image style={{ cursor: "pointer" }} onClick={onImageClick} size="medium" centered circular src={imgUrl + user.imagePath} /> */}
                    <Dimmer.Dimmable
                        as={Image}
                        circular
                        inverted
                        dimmed={active}
                        dimmer={{ active, content }}
                        onMouseEnter={handleShow}
                        onMouseLeave={handleHide}
                        size='medium'
                        src={imgUrl + user.imagePath}
                    />
                <Tab onTabChange={onTabChange} grid={{ tabWidth: 16 }} menu={{ secondary: true, fluid: true, vertical: true, className: "menu-tab" }} panes={panes} />
                    
                </Grid.Column>
                <Grid.Column width={12}>
                    { userDetails ? pageContent() : (<Loading/>)}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            </Grid.Row>
        </Grid>
    )
}

export default Profile
