import React, {useContext} from 'react'
import { AuthContext } from '../context/auth';
import SideBar from './SideBar';

const Layout = ({children}) => {
    const {user} = useContext(AuthContext);
    return (
        <>
        {user ? (
            <SideBar>
            <div className="main-content">
                {children}
            </div>
            </SideBar>
        ) : 
        children
        }
        </>
    )
}

export default Layout
