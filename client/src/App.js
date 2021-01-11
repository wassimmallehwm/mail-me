import React, { useState, lazy, Suspense } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import { AuthProvider } from './context/auth'
import GuestRoute from './utils/GuestRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './components/Loading';

const Navbar = lazy(() => import('./components/Navbar'));
const Accounts = lazy(() => import('./components/pages/Accounts'));
const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import('./components/pages/Login'));
const Register = lazy(() => import('./components/pages/Register'));
const Layout = lazy(() => import('./components/Layout'));
const Mails = lazy(() => import('./components/pages/Mails'));
const MailContent = lazy(() => import('./components/pages/MailContent'));
const Profile = lazy(() => import('./components/pages/Profile'));

toast.configure()
const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  const { innerWidth: width, innerHeight: height } = window;

  const closeSidebar = () => {
    setSidebarVisible(false);
  }

  //const history = createBrowserHistory(); history={history}
  return (
    <AuthProvider>
      <Router >
        <Suspense fallback={(<Loading/>)}>
          <Navbar toggleSidebar={toggleSidebar} />
          <ToastContainer />
          <Layout sidebarVisible={sidebarVisible} closeSidebar={closeSidebar}>
            <Switch>
              <Route exact path="/" component={Home} />
              <ProtectedRoute exact path="/mails" component={Mails} />
              <ProtectedRoute exact path="/accounts" component={Accounts} />
              <ProtectedRoute exact path="/mails/content" component={MailContent} />
              <ProtectedRoute exact path="/profile" component={Profile} />
              <GuestRoute exact path="/register" component={Register} />
              <GuestRoute exact path="/login" component={Login} />
            </Switch>
          </Layout>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App