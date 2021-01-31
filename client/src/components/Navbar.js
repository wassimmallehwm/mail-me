import React, { useState, useContext, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { interceptToken } from '../services/api'

const Navbar = ({history, toggleSidebar}) => {
    const handleItemClick = (e, { name }) => setaAtiveItem(name)

    const {user, logout, login} = useContext(AuthContext);

  const refreshTokenCallback = (data) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.token = data.token;
    localStorage.setItem('userData', JSON.stringify(userData))
    login(userData)
    return data.token;
  }

  const logoutUser = () => {
    history.push('/')
    logout();
  }

  useEffect(() => {
    interceptToken(refreshTokenCallback, logout);
  }, [])

    const pathname = window.location.pathname
    const path = pathname === '/' ? 'home' : pathname.substring(1)
    const[activeItem, setaAtiveItem] = useState(path)

    const navbar = user ? (
      <Menu pointing secondary size="massive" color="teal">
          <Menu.Item onClick={toggleSidebar}>
            <Icon name="sidebar" size='large'/>
          </Menu.Item>
          <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            onClick={logoutUser}
          />
          </Menu.Menu>
        </Menu>
    ) : (
      <Menu pointing secondary size="massive" color="teal">
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
