import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/auth';
import Loading from '../Loading';
import { Toast } from '../../utils/toast';
import Compress from 'compress.js';
import { Button, Image, Grid, Modal, Loader, Segment, Dimmer, Tab } from 'semantic-ui-react';
import { uploadUserImage, updateUser } from '../../services/users.service';
import UserDetails from '../UserDetails';
import ChangePassword from '../ChangePassword';
import ImageEditor from '../ImageEditor';
import config from '../../config';
import DeleteAccount from '../DeleteAccount';
import trans from '../../utils/translate';

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
        profileImageModalOpen: false,
        tabIndex: 0,
        userDetails: null,
        active: false
    })

    const imgUrl = config.publicUrl + "images/users/";

    const compress = new Compress()

    const { active, modalLoading, selectedFile, selectedFileName, selectedFileType, previewImage, imagePreviewModalOpen, profileImageModalOpen, tabIndex, userDetails } = state;

    useEffect(() => {
        const { username, firstname, lastname, email } = user;
        const details = { username, firstname, lastname, email };
        setState({ ...state, userDetails: details });
    }, [])

    const panes = [
        { menuItem: trans('details'), render: () => null },
        { menuItem: trans('changePassword'), render: () => null },
        { menuItem: trans('deleteAccount'), render: () => null },
    ]

    const fileRef = useRef();

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
            .then((res) => { return res.arrayBuffer(); })
            .then((buf) => { return new File([buf], filename, { type: mimeType }); })
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

    const resizeImageFn = async (file) => {

        const resizedImage = await compress.compress([file], {
            size: 2,
            quality: 1,
            maxWidth: 400,
            maxHeight: 400,
            resize: true
        })
        const img = resizedImage[0];
        const base64str = img.data
        const imgExt = img.ext
        const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
        return resizedFiile;
    }

    const uploadImage = async () => {
        setState({ ...state, modalLoading: true })
        const compressedFile = await resizeImageFn(selectedFile);
        const data = new FormData()
        data.append('image', compressedFile)
        uploadUserImage(user.token, data).then(
            res => {
                user.imagePath = res.data.filename
                login(user);
                setState({
                    ...state,
                    modalLoading: false,
                    imagePreviewModalOpen: false,
                    previewImage: '',
                    selectedFile: null,
                    selectedFileName: null,
                    selectedFileType: null
                })
                Toast("SUCCESS", "User image updated successfully");
            },
            error => {
                Toast("ERROR", "Error updating user image");
                setState({ ...state, modalLoading: false })
            }
        )
    }

    const closeImagePreviewModal = () => {
        setState({
            ...state,
            modalLoading: false,
            imagePreviewModalOpen: false,
            previewImage: '',
            selectedFile: null,
            selectedFileName: null,
            selectedFileType: null
        })
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
                <Dimmer.Dimmable style={{ textAlign: "center" }} as={Segment} dimmed={modalLoading}>
                    <Dimmer inverted active={modalLoading} >
                        <Loader active />
                    </Dimmer>
                    <ImageEditor imgUrl={previewImage} saveAfterChange={saveImageAfterChange} />
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

    const updateUserDetails = (stopLoadercallback) => {
        updateUser(user.token, userDetails).then(
            res => {
                let userData = res.data;
                userData.token = user.token;
                login(userData);
                Toast("SUCCESS", "User details updated successfully");
                stopLoadercallback();
            },
            error => {
                Toast("ERROR", "Error updating user details");
                stopLoadercallback();
            }
        )
    }

    const onUserDetailsChange = (e) => {
        const data = userDetails
        data[e.target.name] = e.target.value;
        setState({ ...state, userDetails: data })
    }

    const onTabChange = (event, data) => {
        setState({ ...state, tabIndex: data.activeIndex })
    }

    const pageContent = () => {
        switch (tabIndex) {
            case 0:
                return (<UserDetails
                    userDetails={userDetails}
                    onUserDetailsChange={onUserDetailsChange}
                    updateUserDetails={updateUserDetails}
                />);
            case 1:
                return (<ChangePassword user={user} />);
            case 2:
                return (<DeleteAccount />);
            default:
                return (<UserDetails
                    userDetails={userDetails}
                    onUserDetailsChange={onUserDetailsChange}
                    updateUserDetails={updateUserDetails}
                />);
        }
    }

    const openImageProfile = () => {
        setState({ ...state, profileImageModalOpen: true });
    }

    const closeImageProfile = () => {
        setState({ ...state, profileImageModalOpen: false });
    }

    const profileImagePreviewModal = (
        <Modal
            closeOnEscape={true}
            closeOnDimmerClick={true}
            open={profileImageModalOpen}
            dimmer="blurring"
            size="small"
            onOpen={() => setState({ ...state, profileImageModalOpen: true })}
            onClose={closeImageProfile}
            id="modal-no-padding"
        >
            <Image id="image-no-padding" size="large" centered src={imgUrl + user.imagePath} />
        </Modal>
    );

    const content = (
        <div>
            <Button onClick={openImageProfile} inverted basic icon="expand arrows alternate" />
            <Button onClick={onImageClick} inverted basic icon="edit" />
        </div>
    )

    const handleShow = () => {
        setState({ ...state, active: true })
    }

    const handleHide = () => {
        setState({ ...state, active: false })
    }


    return (
        <Grid columns={2} divided stackable>
            {imagePreviewModal}
            {profileImagePreviewModal}
            <input style={{ display: "none" }} type="file" name="file" ref={fileRef} onChange={fileChnage} />
            <Grid.Row>
                <Grid.Column width={4}>
                    {/* <Image style={{ cursor: "pointer" }} onClick={onImageClick} size="medium" centered circular src={imgUrl + user.imagePath} /> */}
                    <div style={{ textAlign: 'center' }}>
                        <Dimmer.Dimmable
                            as={Image}
                            circular
                            dimmed={active}
                            dimmer={{ active, content }}
                            onMouseEnter={handleShow}
                            onMouseLeave={handleHide}
                            size='medium'
                            src={imgUrl + user.imagePath}
                        />
                    </div>
                    <Tab onTabChange={onTabChange} grid={{ tabWidth: 16 }} menu={{ secondary: true, fluid: true, vertical: true, className: "menu-tab" }} panes={panes} />

                </Grid.Column>
                <Grid.Column width={12}>
                    {userDetails ? pageContent() : (<Loading />)}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            </Grid.Row>
        </Grid>
    )
}

export default Profile
