import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import Area from '../area';
import Grupo from '../grupo';
import Assunto from '../assunto';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject } from '../../utils/utils';

class Categories extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      currentTab: false,
      currentArea: false,
      currentGrupo: [],
      currentAssunto: false
    };
  //handlers
    this.tabsHeader = false;
  //bind methods
    this.changeCurrentTab = this.changeCurrentTab.bind(this);
    this.changeCurrentArea = this.changeCurrentArea.bind(this);
    this.changeCurrentGrupo = this.changeCurrentGrupo.bind(this);
    this.changeCurrentAssunto = this.changeCurrentAssunto.bind(this);
  }

  componentDidMount () {
    
  }

  changeCurrentTab (event) {
    let target = event.currentTarget || false;
    let tabName = target.getAttribute("data-tabName") || false;
    if(target && tabName && this.state.currentTab != tabName){
      this.setState({
        currentTab: tabName
      }, function(){
        console.log("categories: tab changed", this.state.currentTab);
      })
    }
  }

  changeCurrentArea (event) {
    let target = event.currentTarget || false;
    let area = target.getAttribute("data-areaId") || false;
    if(target && area && this.state.currentArea != area){
      this.setState({
        currentArea: area,
        currentGrupo: [],
        currentAssunto: false
      }, function(){
        target.parentNode.childNodes.forEach(function(sibling){
          if(sibling.classList.contains("active")){
            sibling.classList.remove("active");
          }
        });
        target.classList.add("active");
        console.log("categories: area changed", this.state.currentArea);
      })
    }
  }

  changeCurrentGrupo (event) {
    let target = event.currentTarget || false;
    let grupo = target.getAttribute("data-grupoId") || false;
    if(target && grupo){
      let grupos = this.state.currentGrupo;
      let found = false;
      grupos.forEach(function(current, index){
        if(current == Number(grupo)){
          found = index;
        }
      });
      if(found !== false){
          grupos.splice(found, 1);
          target.classList.remove("active");
      }
      else{
          grupos.push(Number(grupo));
          target.classList.add("active");
      }
      this.setState({
        currentGrupo: grupos
      }, function(){
        console.log("categories: grupo changed", this.state.currentGrupo);
      })
    }
  }

  changeCurrentAssunto (event) {
    let target = event.currentTarget || false;
    let assunto = target.getAttribute("data-assuntoId") || false;
    if(target && assunto && this.state.currentAssunto != assunto){
      this.setState({
        currentAssunto: assunto
      }, function(){
        target.parentNode.childNodes.forEach(function(sibling){
          if(sibling.classList.contains("active")){
            sibling.classList.remove("active");
          }
        });
        target.classList.add("active");
        console.log("categories: assunto changed", this.state.currentAssunto);
      })
    }
  }

//dom  
  render() {
    return (
      <div className="container categories">
        <div id="tabsCategoriesHeader" className="header">
          <div className="tab areas" onClick={this.changeCurrentTab} data-tabName="areas">Areas Jurídicas</div>
          <div className="tab grupo" onClick={this.changeCurrentTab} data-tabName="grupos">Grupos de Assunto</div>
          <div className="tab assunto" onClick={this.changeCurrentTab} data-tabName="assuntos">Assuntos</div>
        </div>
        <div id="tabsCategoriesBody" className="body">
          <Area onItemClick={this.changeCurrentArea}/>
          <Grupo currentArea={this.state.currentArea} onItemClick={this.changeCurrentGrupo}/>
          <Assunto currentGrupo={this.state.currentGrupo} onItemClick={this.changeCurrentAssunto}/>
        </div>
      </div>
    );
  }
}

export default Categories;