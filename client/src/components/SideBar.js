import React, { useState, useContext, useEffect } from 'react';
import { Grid, Icon, Menu, Segment, Sidebar, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { findAllByRole } from '../services/menu.service';
import config from '../config';
import displayName from '../utils/displayName';
import { trans } from '../utils/translate';

const SideBar = ({ history, visible, closeSidebar, children }) => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({
    menuList: null
  })

  const { menuList } = state;


  useEffect(() => {
    user && findAllByRole(user.token, { role: user.role }).then(
      res => {
        setState({ ...state, menuList: res.data })
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const imgUrl = config.publicUrl + "images/users/";
  return (
    <Grid>
      <Grid.Row style={{ padding: 0, margin: 0 }} stretched>
        <Grid.Column style={{ padding: 0, margin: 0 }}>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon='labeled'
              vertical
              visible={visible}
              width='wide'
            >

              <Menu.Item onClick={closeSidebar} as={Link} to="/profile">
                <Item.Image centered circular size='tiny' src={imgUrl + user.imagePath} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header><strong>{displayName(user)}</strong></Item.Header>
                </Item.Content>
              </Menu.Item>
              {
                menuList &&
                menuList.map(menu => (
                  <Menu.Item onClick={closeSidebar} key={menu._id} as={Link} to={menu.isArtificial ? `/form/${menu._id}` : menu.url}>
                    {
                    menu.symboleType == 'ICON' 
                    ? (<Icon style={{position: 'absolut', left: '1em'}} size="mini" name={menu.symbole} />)
                    : (<Image size="mini" avatar  src={imgUrl + menu.symbole} />)
                  }
                    <span>{ trans(menu.label.toLowerCase()) }</span>
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
