import React, {useEffect, useState} from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { findSettings } from '../services/settings.service';
import Background from '../wall.png';
import Loading from './Loading';
const GuestHome = () => {

  const [settings, setSettings] = useState({
    guestUrl: ""
  });
  const [loading, setLoading] = useState(true);

  const {guestUrl} = settings;

  useEffect(() => {
    findSettings().then(
      res => {
        setSettings(res.data)
        setLoading(false)
      }, 
      error => {
        console.log(error)
        setLoading(false)
      }
    )
  }, [])

  
  return loading ? 
    (<Loading/>):
    (
      <div style={{
        height: 'calc(100vh - 52px)',
        width: '100vw',
        marginTop: '-55px'
      }}>          
      <iframe src={guestUrl} style={{
        height: '100%',
        width: '100%'
      }}/>         
    </div>
    )
}

export default GuestHome
