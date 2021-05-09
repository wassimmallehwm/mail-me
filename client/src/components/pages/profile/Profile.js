import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../../context/auth';
import Loading from '../../Loading';
import { Toast } from '../../../utils/toast';
import Compress from 'compress.js';
import { Button, Image, Grid, Modal, Loader, Segment, Dimmer, Tab, Card, Icon } from 'semantic-ui-react';
import { uploadUserImage, updateUser, userPhotos, chnagePicture, removePicture } from '../../../services/users.service';
import UserDetails from '../../UserDetails';
import ChangePassword from '../../ChangePassword';
import ImageEditor from '../../ImageEditor';
import config from '../../../config';
import DeleteAccount from '../../DeleteAccount';
import { trans } from '../../../utils/translate';
import Accounts from '../Accounts';
import './profile.css'

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

    const [userImages, setUserImages] = useState([])
    const [selectedUserImage, setSelectedUserImage] = useState("")

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
        { menuItem: trans('accounts'), render: () => null },
        { menuItem: trans('settings'), render: () => null },
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

    const settingsComponent = (
        <div>
            <Grid.Column style={{ margin: '2rem auto' }}>
                <Card fluid >
                    <Card.Header>
                        <h2 style={{ margin: '10px auto', textAlign: 'center' }}>Change password</h2>
                    </Card.Header>
                    <Card.Content>
                        <ChangePassword user={user} />
                    </Card.Content>
                </Card>
            </Grid.Column>
            <Grid.Column style={{ margin: '2rem auto' }}>
                <Card fluid >
                    <Card.Header>
                        <h2 style={{ margin: '10px auto', textAlign: 'center' }}>Delete account</h2>
                    </Card.Header>
                    <Card.Content>
                        <DeleteAccount />
                    </Card.Content>
                </Card>
            </Grid.Column>
        </div>
    )

    const pageContent = () => {
        switch (tabIndex) {
            case 0:
                return (<UserDetails
                    userDetails={userDetails}
                    onUserDetailsChange={onUserDetailsChange}
                    updateUserDetails={updateUserDetails}
                />);
            case 1:
                return (<Accounts />);
            case 2:
                return settingsComponent;
            default:
                return (<UserDetails
                    userDetails={userDetails}
                    onUserDetailsChange={onUserDetailsChange}
                    updateUserDetails={updateUserDetails}
                />);
        }
    }

    const getUserPhotos = () => {
        userPhotos(user.token, user._id).then(
            res => {
                if(res.data.images.length > 0){
                    setUserImages(res.data.images)
                    setSelectedUserImage(res.data.images[0])
                } else {
                    setSelectedUserImage(user.imagePath)
                }
            },
            error => {
                Toast("ERROR", "Error loading user images");
            }
        )
    }

    const goToNext = () => {
        const imgIndex = userImages.indexOf(selectedUserImage);
        const diff = userImages.length - imgIndex;
        if (diff == 1) {
            setSelectedUserImage(userImages[0])
        }
        if (diff > 1) {
            setSelectedUserImage(userImages[imgIndex + 1])
        }
    }

    const goToPrev = () => {
        const imgIndex = userImages.indexOf(selectedUserImage);
        if (imgIndex != 0) {
            setSelectedUserImage(userImages[imgIndex - 1])
        }
        if (imgIndex == 0) {
            setSelectedUserImage(userImages[userImages.length - 1])
        }
    }

    const changeProfilePic = () => {
        if(selectedUserImage != user.imagePath){
            chnagePicture(user.token, {image: selectedUserImage}).then(
                res => {
                    closeImageProfile()
                    user.imagePath = res.data
                    login(user);
                    setSelectedUserImage(user.imagePath)
                    Toast("SUCCESS", "User image chnaged successfully");
                },
                error => {
                    Toast("ERROR", "Error changing user image");
                }
            )
        }
        
    }

    const deleteProfilePic = () => {
        removePicture(user.token, {image: selectedUserImage}).then(
            res => {
                closeImageProfile()
                Toast("SUCCESS", "User image deleted successfully");
                if(res.data != user.imagePath){
                    user.imagePath = res.data
                    login(user);
                }
                setSelectedUserImage(user.imagePath)
            },
            error => {
                Toast("ERROR", "Error deleting user image");
            }
        )
    }

    const openImageProfile = () => {
        getUserPhotos()
        setState({ ...state, profileImageModalOpen: true });
    }

    const closeImageProfile = () => {
        setSelectedUserImage(user.imagePath)
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
            <Button onClick={goToPrev} className="prev-btn">
                <Icon name="angle left" size='big' />
            </Button>
            <Button onClick={goToNext} className="next-btn">
                <Icon name="angle right" size='big' />
            </Button>
            <div className="profile-img-btns">
                <Button disabled={selectedUserImage == user.imagePath} onClick={changeProfilePic} className="profile-img-btn">
                    Profile
                </Button>
                <Button onClick={deleteProfilePic} className="delete-img-btn">
                    Delete
                </Button>
            </div>
            <Image id="image-no-padding" size="large" centered src={imgUrl + selectedUserImage} />
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
            <Grid.Row style={{ margin: '1rem 1.5rem' }}>
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
