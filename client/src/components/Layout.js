import React, {lazy, Suspense, useContext} from 'react'
import { Container } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import Loading from './Loading';
import Footer from './layout/footer/Footer';
const SideBar = lazy(() => import('./SideBar'));

const Layout = ({sidebarVisible, closeSidebar, changeLanguage, children}) => {
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
        <Footer changeLanguage={changeLanguage}/>
        </div>
    )
}

export default Layout
