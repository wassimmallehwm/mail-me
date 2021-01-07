import React, {useState, useContext} from 'react';
import { Grid, Icon, Menu, Segment, Sidebar, Item, Image } from 'semantic-ui-react';
import { Link, Route, Router } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const SideBar = ({visible, closeSidebar, children}) => {
    const {user} = useContext(AuthContext);

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
            <Item>
              <Item.Image circular size='tiny' src='https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/120305100_1428776037317293_169039830729195269_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=6jUoZ462dlEAX-MjGdC&_nc_ht=scontent.ftun3-1.fna&oh=83df99641349929c0684c6dbb50e2c06&oe=60097FAD' />
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
