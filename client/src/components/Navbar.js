import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { refresh } from '../services/api'

const Navbar = () => {
    const handleItemClick = (e, { name }) => setaAtiveItem(name)

    const {user, logout, login} = useContext(AuthContext);
    const [inter, setInter] = useState();

  const refreshToken = () => {
    refresh(user.token).then(
      res => {
        localStorage.setItem('userData', JSON.stringify(res.data))
        login(res.data)
      },
      error => {
        logout();
      }
    );
  }

  const logoutUser = () => {
    clearInterval(inter);
    setInter(null);
    logout();
  }

  useEffect(() => {
    if(user != null){
      setInter(setInterval(refreshToken, 60000))
    } else {
      clearInterval(inter);
      setInter(null)
    }
  }, [])

    const pathname = window.location.pathname
    const path = pathname === '/' ? 'home' : pathname.substring(1)
    const[activeItem, setaAtiveItem] = useState(path)

    const navbar = user ? (
      <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name={user.username}
            active
            as={Link}
            to="/"
          />
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

export default Navbar
