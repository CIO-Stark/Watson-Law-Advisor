import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import Categories from '../categories/';
import Users from '../users/';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject, siblings } from '../../utils/utils';

class Admin extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      currentTab: false
    };
  //handlers
    this.tabsHeader = false;
    this.tabsBody = false;
  //bind methods
    this.changeCurrentTab = this.changeCurrentTab.bind(this);
  }

  componentDidMount () {
    this.tabsHeader = document.getElementById("tabsAdminHeader");
    this.tabsBody = document.getElementById("tabsAdminBody");
    this.tabsHeader.childNodes[0].click();
  }

  setTargetHeader (tabName) {
    let result = false;
    this.tabsHeader.childNodes.forEach(function(node){
      if(result === false && node.getAttribute("data-tabName") === tabName){
        node.classList.add("active");
        result = node;
      }
      else{
        node.classList.remove("active");
      }
    });
    return result;
  }

  setTargetBody (tabName) {
    let result = false;
    this.tabsBody.childNodes.forEach(function(node){
      if(result === false && node.classList.contains(tabName)){
        node.classList.add("active");
        result = node;
      }
      else{
        node.classList.remove("active");
      }
    });
    return result;
  };

  changeCurrentTab (event) {
    let target = event.currentTarget || false;
    let tabName = target.getAttribute("data-tabName") || false;
    if(target && tabName){
      this.setState({
        currentTab: tabName
      }, function(){
        this.setTargetHeader(tabName);
        this.setTargetBody(tabName);
      })
    }
    console.log("admin change tab", this.state.currentTab);
  }
  
  render() {
    return (
      <div className="container admin">
        <div id="tabsAdminHeader" className="header">
          <div className="tab" onClick={this.changeCurrentTab} data-tabName="categories">Categorias</div>
          <div className="tab" onClick={this.changeCurrentTab} data-tabName="users">Usuários</div>
        </div>
        <div id="tabsAdminBody" className="body">
          <Categories />
          <Users />
        </div>
      </div>
    );
  }
}

export default Admin;