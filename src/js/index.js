import '../css/main.scss';
import * as auth from './data/auth';
import React from 'react';
import { render } from 'react-dom';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import Advisor from './components/advisor/';
import Dashboard from './components/dashboard/';
import Admin from './components/admin/';
import NavBar from './components/navbar/';
import Login from './components/login';
import Modal from './components/modal/';
import Toast from './components/shared/toast/toast.js';
import * as File from './data/file';

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.selectComponent = this.selectComponent.bind(this);
  }

  componentDidMount () {
    File.initSocket();
  }

  selectComponent (props) {
    const path = props.location.pathname;

    // if (!auth.isAuthenticated() && path !== '/login') {
    //   return <Redirect to="/login" />
    // }

    switch (path) {
      case '/': return <Advisor {...props} />;
      case '/login': return <Login {...props} />;
      case '/dashboard': return <Dashboard {...props} />;
      case '/admin': return <Admin {...props} />;
      default: return <Login {...props} />
    }
  }

  render () {
    return (
      <Router basename="/">
        <div>
            <NavBar />
            <Toast />
            <Modal />
          
            <Route exact path="/" render={this.selectComponent} />
            <Route exact path="/login" render={this.selectComponent} />
            <Route exact path="/dashboard" render={this.selectComponent} />
            <Route exact path="/admin" render={this.selectComponent} />
        </div>
      </Router>
    );
  }

}

render(<App />, document.getElementById('app'));