import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const DeleteModal = ({
    title,
    deleteModalOpen,
    //openDeleteModal,
    closeDeleteModal,
    submit
}) => {
    return (
            <Modal
                closeOnEscape={true}
                closeOnDimmerClick={true}
                open={deleteModalOpen}
                dimmer="blurring"
                size="tiny"
                //onOpen={openDeleteModal}
                onClose={closeDeleteModal}
            >
                <Modal.Header>Confirmation</Modal.Header>
                <Modal.Content>
                    <h3>{title}</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeDeleteModal} basic>
                        Cancel
            </Button>
                    <Button onClick={submit} negative>
                        Delete
            </Button>
                </Modal.Actions>
            </Modal>
    )
}

export default DeleteModal
