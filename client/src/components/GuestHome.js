import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import Background from '../wall.png';
const GuestHome = () => {
  return (
    <Segment
      inverted
      textAlign='center'
      style={{
        minHeight: 750,
        padding: '1em 0em',
        backgroundImage: "url(" + Background + ")",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
      }}
      vertical
    >
      <Container>
        <Header
          as='h4'
          content='UNDER DESIGN'
          inverted
          color='blue'
          style={{
            fontSize: '4em',
            fontWeight: 'normal',
            marginTop: '4em',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        />
      </Container>
    </Segment>
  )
}

export default GuestHome
