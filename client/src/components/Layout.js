import React, {useContext} from 'react'
import { AuthContext } from '../context/auth';
import SideBar from './SideBar';

const Layout = ({sidebarVisible, closeSidebar, children}) => {
    const {user} = useContext(AuthContext);
    return (
        <>
        {user ? (
            <SideBar visible={sidebarVisible}>
            <div onClick={closeSidebar} className="main-content">
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
