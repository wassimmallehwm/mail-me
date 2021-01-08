import React, {useState, useContext} from 'react';
import { Grid, Icon, Menu, Segment, Sidebar, Item, Image } from 'semantic-ui-react';
import { Link, Route, Router } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const SideBar = ({history, visible, closeSidebar, children}) => {
    const {user} = useContext(AuthContext);

    const imgUrl = "http://localhost:4000/public/images/";
    return (
        <Grid>
      <Grid.Row style={{padding: 0}} stretched>
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
            <Item as={Link} to="/profile">
              <Item.Image circular size='tiny' src={imgUrl + user.imagePath}/>
              <Item.Content verticalAlign='middle'>
                <Item.Header as='a'>{user.username}</Item.Header>
              </Item.Content>
            </Item>
            <Menu.Item as={Link} to="/">
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as={Link} to="/mails">
              <Icon name='mail' />
              Mails
            </Menu.Item>
            <Menu.Item as={Link} to="/accounts">
              <Icon name='users' />
              Accounts
            </Menu.Item>
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
