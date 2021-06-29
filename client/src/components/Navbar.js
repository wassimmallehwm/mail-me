import React, { useState, useContext, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Label, Menu, Image, Dropdown } from 'semantic-ui-react'
import config from '../config'
import { AuthContext } from '../context/auth'
import { SocketContext } from '../context/socket'
import Emitter from '../services/events'
import { count } from '../services/register-request.service'
import { interceptToken } from '../services/users.service'
import { SocketEvents } from '../constants/EventConst'
import { ClientEvents } from '../constants/EventConst'

const Navbar = ({ history, toggleSidebar }) => {
  const handleItemClick = (e, { name }) => setaAtiveItem(name)

  const { user, logout, login } = useContext(AuthContext);
  const socket = useContext(SocketContext)
  const [requestsCount, setRequestsCount] = useState(0)

  const imgUrl = config.publicUrl + "images/users/";

  const refreshTokenCallback = (data) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.token = data.token;
    localStorage.setItem('userData', JSON.stringify(userData))
    login(userData)
    return data.token;
  }

  const logoutUser = () => {
    socket.disconnect();
    history.push('/')
    handleItemClick(null, { name: 'home' });
    logout();
  }

  const getUserRequestsCount = () => {
    user && user.isAdmin && count(user.token).then(
      (res) => {
        setRequestsCount(res.data)
      },
      error => {
        console.log(error);
      }
    )
  }

  const profileImage = () => (
    <Image
      src={imgUrl + user.imagePath}
      avatar
      size="mini"
    />
  )

  const profileButton = (
    <Dropdown className="profile-dropdown" icon={null} text={profileImage}>
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          to="/profile"
          icon="user"
          value={null}
          text="Profile"
        />
        <Dropdown.Item
          icon="sign-out"
          value={null}
          text="Logout"
          onClick={logoutUser}
        />
      </Dropdown.Menu>
    </Dropdown>
  )

  useEffect(() => {
    interceptToken(refreshTokenCallback, logout);
    Emitter.on(ClientEvents.requestsNumber, (requestsValue) => setRequestsCount(requestsValue));
  }, [])

  useEffect(() => {
    getUserRequestsCount()
    if (user) {
      //console.log("SOCKET : ", socket.connected)
      !socket.connected && socket.connect()
      //socket.emit(SocketEvents.addUser, user._id);
      socket.on(SocketEvents.connect, () => {
        socket.emit(SocketEvents.addUser, user._id);
      })
      socket.on(SocketEvents.requestCreated, () => {
        setRequestsCount(prev => prev + 1)
      })
      socket.on(SocketEvents.requestDeleted, () => {
        setRequestsCount(prev => {
          if (prev > 0) {
            return prev - 1
          }
        })
      })
    }
    return () => {
      //socket.off(SocketEvents.connect)
      socket.off(SocketEvents.requestCreated)
      socket.off(SocketEvents.requestDeleted)
    };
  }, [user])

  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substring(1)
  const [activeItem, setaAtiveItem] = useState(path)

  const guestMenu = (
    <>
      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </>
  )

  const userMenu = (user) => (
    <>
      <Menu.Item onClick={toggleSidebar}>
        <Icon name="sidebar" size='large' />
      </Menu.Item>
      <Menu.Menu position='right'>
        {
          user.isAdmin && (
            <Menu.Item as={Link} to="/requests">
              <Icon name='user plus' />
              {
                requestsCount && requestsCount > 0 ? (
                  <Label color='teal' attached="bottom right" circular>
                    {requestsCount}
                  </Label>
                ) : null
              }
            </Menu.Item>
          )
        }
        <Menu.Item>
          {profileButton}
        </Menu.Item>
      </Menu.Menu>
    </>
  )
  return (
    <Menu className="no-marg-menu ui-navbar" pointing secondary size="massive" color="teal">
      {user ? userMenu(user) : guestMenu}
    </Menu>
  )
}

export default withRouter(Navbar)
