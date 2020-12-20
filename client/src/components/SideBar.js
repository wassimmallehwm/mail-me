import React, {useState, useContext} from 'react';
import { Grid, Icon, Menu, Segment, Sidebar, Item, Image } from 'semantic-ui-react';
import { Link, Route, Router } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const SideBar = ({children}) => {
    const {user} = useContext(AuthContext);
    const [visible, setVisible] = useState(true);
    return (
        <Grid>
      <Grid.Row stretched>
      <Grid.Column>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            vertical
            visible={visible}
            width='wide'
          >
            <Item>
              <Item.Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />

              <Item.Content>
                <Item.Header as='a'>Header</Item.Header>
                <Item.Meta>Description</Item.Meta>
                <Item.Extra>Additional Details</Item.Extra>
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
            <Menu.Item as={Link} to="/3">
              <Icon name='users' />
              Accounts
            </Menu.Item>
          </Sidebar>
            <Sidebar.Pusher>
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
