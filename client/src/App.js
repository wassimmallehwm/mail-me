import React, {useState} from 'react'
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import {AuthProvider} from './context/auth'
import GuestRoute from './utils/GuestRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/Layout';
import Mails from './components/pages/Mails';
import MailContent from './components/pages/MailContent';
import { createBrowserHistory } from 'history';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()
const App = () => {

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  const { innerWidth: width, innerHeight: height } = window;

  const closeSidebar = () => {
    if(width <= 1000) {
      setSidebarVisible(false);
    }
  }
  
  //const history = createBrowserHistory(); history={history}
  return (
    <AuthProvider>
    <Router >
      <Navbar toggleSidebar={toggleSidebar}/>
      <ToastContainer/>
      <Layout sidebarVisible={sidebarVisible} closeSidebar={closeSidebar}>
      <Switch>
      <Route exact path="/" component={Home}/>
      <ProtectedRoute exact path="/mails" component={Mails}/>
      <ProtectedRoute exact path="/mails/:mailId" component={MailContent}/>
      <GuestRoute exact path="/register" component={Register}/>
      <GuestRoute exact path="/login" component={Login}/>
      </Switch>
      </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App