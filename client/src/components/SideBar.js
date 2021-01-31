import React, { useState, useContext, useEffect } from 'react';
import { Grid, Icon, Menu, Segment, Sidebar, Item, Image } from 'semantic-ui-react';
import { Link, Route, Router } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { findAllByRole } from '../services/menu.service';

const SideBar = ({ history, visible, closeSidebar, children }) => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({
    menuList: null
  })

  const { menuList } = state;

  const displayName = () => {
    if (user.firstname && user.firstname != '' && user.lastname && user.lastname != '') {
      return user.firstname + ' ' + user.lastname;
    }
    return user.username;
  }

  useEffect(() => {
    user && findAllByRole(user.token, { role: user.role }).then(
      res => {
        console.log(res.data)
        setState({ ...state, menuList: res.data })
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const imgUrl = "http://localhost:4000/public/images/users/";
  return (
    <Grid>
      <Grid.Row style={{ padding: 0 }} stretched>
        <Grid.Column>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon='labeled'
              vertical
              visible={visible}
              width='wide'
            >

              <Menu.Item as={Link} to="/profile">
                <Item.Image centered circular size='tiny' src={imgUrl + user.imagePath} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header><strong>{displayName()}</strong></Item.Header>
                </Item.Content>
              </Menu.Item>
              {
                menuList &&
                menuList.map(menu => (
                  <Menu.Item key={menu._id} as={Link} to={menu.isArtificial ? `/form/${menu._id}` : menu.url}>
                    {/* {
                    menu.symboleType == 'ICON' 
                    ? (<Icon size="mini" circular name={menu.symbole} />)
                    : (<Image size="mini" avatar  src={imgUrl + menu.symbole} />)
                  } */}
                    <span>{menu.label}</span>
                  </Menu.Item>
                ))
              }
            </Sidebar>
            <Sidebar.Pusher onClick={closeSidebar} dimmed={visible}>
              <Segment basic>
                {children}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SideBar
