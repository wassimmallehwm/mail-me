import React, { useContext, useState, useEffect } from 'react'
import { IconPicker } from 'semantic-ui-react-icon-picker';
import { Button, Table, Grid, Modal, Form, Dropdown } from 'semantic-ui-react'
import { AuthContext } from '../../context/auth'
import { findAllArtificial, createOrUpdate, findAllGuest, submitConfig, deleteOneMenu, findAllMenus, updateOrder } from '../../services/menu.service'
import { findAll } from '../../services/roles.service'
import DragSortableList from 'react-drag-sortable'
import { Toast } from '../../utils/toast';
import Loading from '../Loading';
import moment from 'moment';
import NoData from '../NoData';

const Menus = ({ history }) => {
    const { user } = useContext(AuthContext)

    const [state, setState] = useState({
        deleteMenu: null,
        menus: null,
        mode: "add",
        modalTitle: "Add Menu",
        loading: false
    })

    const [modals, setModals] = useState({
        addEditModalOpen: false,
        deleteModalOpen: false,
        configModalOpen: false
    })

    const [sortedMenus, setSortedMenus] = useState(null);

    const [userRoles, setUserRoles] = useState(null);

    const [guestMenus, setGuestMenus] = useState(null);

    const initMenu = {
        _id: null,
        label: '',
        symbole: null,
        roles: [],
        submitConfigUrl: '',
        submitConfigMethod: null,
        redirectMenu: null
    };

    const methods = [
        { key: "post", value: "post", text: "POST" },
        { key: "get", value: "get", text: "GET" }
    ];

    const [menu, setMenu] = useState(initMenu)

    const { _id, symbole, label, roles, submitConfigUrl, submitConfigMethod, redirectMenu } = menu;
    const { deleteMenu, menus, mode, modalTitle, loading } = state;
    const { addEditModalOpen, deleteModalOpen, configModalOpen } = modals;

    const getUserRoles = () => {
        user && findAll(user.token).then(
            (res) => {
                let values = [];
                res.data.forEach(rol => {
                    values.push({ key: rol._id, value: rol._id, text: rol.label });
                })
                setUserRoles(values)
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading roles");
            }
        )
    }

    const updateMenusOrder = (data) => {
        user && updateOrder(user.token, {menus: data}).then(
            (res) => {
                Toast("SUCCESS", res.data.success);
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error Updating menus");
            }
        )
    }



    const getGuestMenus = () => {
        user && findAllGuest(user.token).then(
            (res) => {
                let values = [];
                res.data.forEach(menuItem => {
                    values.push({ key: menuItem._id, value: menuItem._id, text: menuItem.label });
                })
                setGuestMenus(values)
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading menus");
            }
        )
    }

    const getMenus = () => {
        user && findAllMenus(user.token).then(
            (res) => {
                setState({ ...state, menus: res.data })
            },
            error => {
                console.log(error);
                Toast("ERROR", "Error loading menus");
            }
        )
    }

    useEffect(() => {
        getMenus();
    }, []);

    const createOrUpdateMenu = () => {
        setState({ ...state, loading: true })
        createOrUpdate(user.token, mode, menu).then(
            (res) => {
                let updateMenus = menus;
                if (mode == 'add') {
                    updateMenus.push(res.data);
                } else {
                    const index = menus.findIndex(elem => elem._id == menu._id)
                    updateMenus[index] = res.data;
                }
                setModals({ ...modals, addEditModalOpen: false })
                setState({ ...state, loading: false, menus: updateMenus })
                setMenu(initMenu)
                Toast("SUCCESS", "Menu updated successfully");
            },
            error => {
                console.log(error);
                setState({ ...state, loading: false })
                Toast("ERROR", "Error updating the menu");
            }
        )
    }

    const openDeleteModal = (data) => {
        setModals({ ...modals, deleteModalOpen: true })
        setState({ ...state, deleteMenu: data });
    }

    const closeDeleteModal = () => {
        setModals({ ...modals, deleteModalOpen: false })
        setState({ ...state, deleteMenu: null });
    }

    const removeMenu = () => {
        deleteOneMenu(user.token, deleteMenu).then(
            (res) => {
                let menusList = menus;
                menusList = menusList.filter(elem => elem._id != deleteMenu);
                setModals({ ...modals, deleteModalOpen: false })
                setState({ ...state, menus: menusList, deleteMenu: null })
            },
            error => {
                console.log(error);
                setState({ ...state, deleteModalOpen: false, deleteMenu: null })
                Toast("ERROR", "Error deleting the Menu");
            }
        )
    }

    const deleteMenuModal = (
        <Modal
            closeOnEscape={true}
            closeOnDimmerClick={true}
            open={deleteModalOpen}
            dimmer="blurring"
            size="tiny"
            onOpen={() => setModals({ ...state, deleteModalOpen: true })}
            onClose={closeDeleteModal}
        >
            <Modal.Header>Confirmation</Modal.Header>
            <Modal.Content>
                <h3>Are you sure you want to delete the Menu ?</h3>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeDeleteModal} basic>
                    Cancel
        </Button>
                <Button onClick={removeMenu} negative>
                    Delete
        </Button>
            </Modal.Actions>
        </Modal>
    );


    const openEditMenuModal = ({ _id, label, roles, symbole }) => {
        if (!userRoles) {
            getUserRoles();
        }
        setMenu({ _id, label, roles, symbole })
        setState({ ...state, mode: "edit", modalTitle: "Edit Menu" })
        setModals({ ...modals, addEditModalOpen: true })
    }
    const openAddMenuModal = (data) => {
        if (!userRoles) {
            getUserRoles();
        }
        setModals({ ...modals, addEditModalOpen: true })
    }

    const onModalClose = (e, data) => {
        setModals({ ...modals, addEditModalOpen: false })
        setState({ ...state, mode: "add", modalTitle: "Add Menu" });
    }


    // ===== Edit Menu config

    const onMenuConfigModalClose = (e, data) => {
        setModals({ ...modals, configModalOpen: false })
    }

    const openEditMenuConfigModal = (data) => {
        if (!guestMenus) {
            getGuestMenus();
        }
        const redirectMenuValue = data.redirectMenu ? data.redirectMenu : null;
        const urlValue = data.submitConfigUrl ? data.submitConfigUrl : '';
        const methodValue = data.submitConfigMethod ? data.submitConfigMethod : null;
        setMenu({
            ...menu,
            _id: data._id,
            redirectMenu: redirectMenuValue,
            submitConfigUrl: urlValue,
            submitConfigMethod: methodValue
        })
        setModals({ ...modals, configModalOpen: true })
    }

    const editMenuConfig = () => {
        submitConfig(user.token, { _id, submitConfigUrl, submitConfigMethod, redirectMenu })
            .then(
                res => {
                    let updateMenus = menus;
                    const index = menus.findIndex(elem => elem._id == _id)
                    updateMenus[index] = res.data;
                    setModals({ ...modals, configModalOpen: false })
                    setState({ ...state, loading: false, menus: updateMenus })
                    setMenu(initMenu)
                    Toast("SUCCESS", "Menu updated successfully");
                },
                error => {
                    console.log(error)
                    Toast("ERROR", "Error updating the menu");
                }
            )
    }

    const onMethodChange = (e, data) => {
        setMenu({ ...menu, submitConfigMethod: data.value })
    }

    const onRedirectMenuChange = (e, data) => {
        setMenu({ ...menu, redirectMenu: data.value })
    }

    const menuConfigForm = (
        <Form className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Submit url"
                placeholder="Submit url"
                name="submitConfigUrl"
                type="text"
                value={submitConfigUrl}
                onChange={e => setMenu({ ...menu, submitConfigUrl: e.target.value })}
            />
            <label>Method</label>
            <Dropdown
                placeholder='Method'
                fluid
                search
                selection
                defaultValue={submitConfigMethod}
                onChange={onMethodChange}
                style={{ marginBottom: '1em' }}
                options={methods}
            />
            <label>Redirect Menu</label>
            <Dropdown
                placeholder='Method'
                fluid
                search
                selection
                defaultValue={redirectMenu}
                onChange={onRedirectMenuChange}
                style={{ marginBottom: '1em' }}
                options={guestMenus}
            />
        </Form>
    )

    const menuConfigModal = (
        <Grid.Column floated="right">
            <Modal
                style={{ overflow: 'visible' }}
                closeOnEscape={true}
                closeOnDimmerClick={true}
                open={configModalOpen}
                dimmer="blurring"
                size="tiny"
                onOpen={() => setModals({ ...modals, configModalOpen: true })}
                onClose={onMenuConfigModalClose}
            >
                <Modal.Header>Submit button config</Modal.Header>
                <Modal.Content>
                    {menuConfigForm}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onMenuConfigModalClose} basic>
                        Cancel
            </Button>
                    <Button onClick={editMenuConfig} primary>
                        Save
            </Button>
                </Modal.Actions>
            </Modal>
        </Grid.Column>
    );

    // ===== Edit Menu config



    const editMenuForm = (id) => {
        history.push('/form-builder', id);
    }


    // ===== Add / Edit Menu

    const onIconChange = (data) => {
        setMenu({ ...menu, symbole: data })
    }

    const onRolesChange = (event, data) => {
        setMenu({ ...menu, roles: data.value })
    }

    const onLabelChange = (event) => {
        setMenu({ ...menu, label: event.target.value })
    }

    const addMenuForm = (
        <Form className={loading ? "loading" : ''} noValidate>
            <Form.Input
                label="Label"
                placeholder="Label"
                name="label"
                type="text"
                value={label}
                onChange={onLabelChange}
            />

            <label>Icon</label>
            <IconPicker value={symbole} onChange={onIconChange} />

            <label>Roles</label>
            <Dropdown
                placeholder='Roles'
                fluid
                multiple
                search
                selection
                defaultValue={roles}
                onChange={onRolesChange}
                style={{ marginBottom: '1em' }}
                options={userRoles}
            />
        </Form>
    )

    const addMenuModal = (
        <Grid.Column floated="right">
            <Modal
                closeOnEscape={true}
                closeOnDimmerClick={true}
                open={addEditModalOpen}
                dimmer="blurring"
                size="tiny"
                onOpen={openAddMenuModal}
                onClose={onModalClose}
                trigger={<Button primary icon='plus' floated="right" />}
            >
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Content>
                    {addMenuForm}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onModalClose} basic>
                        Cancel
            </Button>
                    <Button onClick={createOrUpdateMenu} primary>
                        Save
            </Button>
                </Modal.Actions>
            </Modal>
        </Grid.Column>
    );

    // ===== Add / Edit Menu

    const formatDate = date => {
        return moment(date).format("DD/MM/YYYY HH:mm")
    }

    const menuItem = (data) => (
        <div className="menu-item" key={data._id}>
            <div className="menu-item-label">{data.label}</div>
            <div className="menu-item-date">{formatDate(data.createdAt)}</div>
            <div className="menu-item-action">
                <Button onClick={() => openEditMenuModal(data)} circular primary icon='edit' />
                {
                    data.isArtificial ? (
                        <>
                            <Button onClick={() => editMenuForm(data._id)} circular color='grey' icon='content' />
                            <Button onClick={() => openEditMenuConfigModal(data)} circular color='grey' icon='cog' />
                        </>
                    ) : null
                }
                <Button onClick={() => openDeleteModal(data._id)} circular negative icon='trash' />
            </div>
        </div>
    )

    const menuHeader = (
        <div className="menu-item menu-item-header no-drag">
            <div className="menu-item-label">Label</div>
            <div className="menu-item-date">Created at</div>
            <div className="menu-item-action">Actions</div>
        </div>
    )

    const draggableList = () => {
        let result = [{ content: menuHeader }];
        menus && menus.length > 0 &&
            menus.map(data => result.push({ content: menuItem(data) }))
        return result;
    }

    const onSort = (list) => {
        let newList = []
        list.forEach(elem => {
            newList.push({_id: elem.content.key, order: elem.rank})
        })
        updateMenusOrder(newList)
    }

    const dataTable = (
        <Grid.Row>
            {
                menus && menus.length > 0 ? (
                    <>
                        <div style={{ width: '100%' }}>
                            <div className="sort-menus-container">
                                <DragSortableList items={draggableList()} onSort={onSort} type="vertical" />
                            </div>
                        </div>
                    </>
                ) :
                    (
                        <NoData />
                    )
            }

        </Grid.Row>
    )

    return (
        <Grid columns={1} className="main-grid">
            {addMenuModal}
            {menuConfigModal}
            {deleteMenuModal}
            {menus ? dataTable : (<Loading />)}
        </Grid>
    )
}

export default Menus
