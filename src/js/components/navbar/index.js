import React, { Component } from 'react';
import { withRouter, NavLink, Link } from 'react-router-dom';
import watsonLogo from '../../../images/watson.svg';

class NavBar extends Component {

  render() {
    if (this.props.location.pathname === '/login') {
      return null;
    }

    return (
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-item logo" style={{ paddingRight: 0 }}>
            <img src={watsonLogo} alt="Watson"/>
          </div>
          <div className="nav-item logo" style={{ paddingLeft: 0 }}>
            <NavLink to="/" style={{ color: '#363636' }}>
              <p className="">Watson Law Advisor</p>
            </NavLink>
          </div>
          
        </div>

        <div className="nav-right">
          <NavLink to="/" className="nav-item" activeClassName="is-active"> Análises </NavLink>
         { 
           //<NavLink to="/dashboard" className="nav-item"  activeClassName="is-active"> Dashboard </NavLink>
         }
          <NavLink to="/admin" className="nav-item"  activeClassName="is-active"> Admin </NavLink>
          <Link to="/login" className="nav-item" title="Sair">
            <i className="ibm-icon-extra ibm-exit"></i>
          </Link>
        </div> 
      </nav>
    );
  }
}

export default withRouter(NavBar);