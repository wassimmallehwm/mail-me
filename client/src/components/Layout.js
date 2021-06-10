import React, {lazy, Suspense, useContext} from 'react'
import { Container } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import Loading from './Loading';
const SideBar = lazy(() => import('./SideBar'));

const Layout = ({sidebarVisible, closeSidebar, children}) => {
    const {user} = useContext(AuthContext);

    return (
        <div style={{height: 'calc(100% - 75px)', marginTop: '75px'}}>
        {user ? (
            <Suspense fallback={<Loading/>}>
                <SideBar closeSidebar={closeSidebar} visible={sidebarVisible}>
                <div className="main-content">
                    {children}
                </div>
                </SideBar>
            </Suspense>
        ) : children
        }
        </div>
    )
}

export default Layout
