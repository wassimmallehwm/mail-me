import React, { useState, useContext, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button, Icon, Label, Menu } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import Emitter from '../services/events'
import { interceptToken } from '../services/users.service'
import EventsTypes from '../utils/EventsTypes'

const Navbar = ({ history, toggleSidebar, changeLanguage }) => {
  const handleItemClick = (e, { name }) => setaAtiveItem(name)

  const { user, logout, login } = useContext(AuthContext);
  const [requestsCount, setRequestsCount] = useState(null)

  const refreshTokenCallback = (data) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.token = data.token;
    localStorage.setItem('userData', JSON.stringify(userData))
    login(userData)
    return data.token;
  }

  const logoutUser = () => {
    history.push('/')
    handleItemClick(null, { name: 'home' });
    logout();
  }

  useEffect(() => {
    interceptToken(refreshTokenCallback, logout);
    Emitter.on(EventsTypes.REQUESTS_NUMBER, (requestsValue) => setRequestsCount(requestsValue));
  }, [])

  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substring(1)
  const [activeItem, setaAtiveItem] = useState(path)

  const langButton = (
    <>
    <Menu.Item
      name='FR'
      onClick={() => { changeLanguage('fr') }}
      as={Button}
    />
    <Menu.Item
      name='EN'
      onClick={() => { changeLanguage('en') }}
      as={Button}
    />
    </>
  )

  const navbar = user ? (
    <Menu pointing secondary size="massive" color="teal">
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
        {langButton}
        <Menu.Item
          name='logout'
          onClick={logoutUser}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu className="no-marg-menu" pointing secondary size="massive" color="teal">
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
    </Menu>
  )
  return navbar
}

export default withRouter(Navbar)
