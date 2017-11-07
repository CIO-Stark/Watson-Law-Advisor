import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import * as Data from '../../data/grupo';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject } from '../../utils/utils';

class Grupo extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      data: [],
      temp: [],
      newGrupo: "",
      isLoading: true
    };

//bind methods
    this.loadData = this.loadData.bind(this);
    this.handleItemClick = this.props.onItemClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleGrupoEdit = this.handleGrupoEdit.bind(this);
    this.search = this.search.bind(this);
    this.createGrupo = this.createGrupo.bind(this);
    this.updateGrupo = this.updateGrupo.bind(this);
    this.removeGrupo = this.removeGrupo.bind(this);
  }

  componentDidMount () {
    let that = this;
    this.loadData(function(error, data){
      if(!error){
        console.log("grupos carregados");
      }
    });
  }

//methods
  loadData (callback) {
    let that = this;
    Data.load().then(function(response){
      if(response.status){
        that.setState({
          data: response.data,
          temp: response.data,
          isLoading: false
        }, function(){
          callback(null, that.state.data);
        });
      }
      else{
        that.setState({ isLoading: false }, function(){
          callback("falha ao carregar Grupos", null);
          Toast.open('Falha ao carregar Grupos', 'danger');
          console.log("grupo data load failed", response.message);
        });
      }
    }).catch(function(error){
        that.setState({ isLoading: false }, function(){
          callback("erro ao carregar Grupos", null);
          Toast.open('Erro ao carregar Grupos', 'danger');
          console.log("grupo data load error", error);
        });
    });
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({
      newGrupo: value
    }, this.search);
  }
  
  handleGrupoEdit (event, grupo){
    let grupos = this.state.data;
    const value = event.target.value;
    grupo.label = value;
    grupo.value = value;
    grupos.forEach(function(entry, index){
      if(entry._id == grupo._id){
        grupos[index] = grupo;
      }
    });
    this.setState({
      data: grupos
    });
  }

  search () {
    let that =  this;
    let result = [];
    if(that.state.newGrupo == ""){
      result = that.state.data;
    }
    else{
      let regex = new RegExp(that.state.newGrupo, "gi");
      that.state.data.forEach(function(grupo){
        if(grupo.value.match(regex)){
          result.push(grupo);
        }
      });
    }
    that.setState({
      temp: result
    });
  }
  
  createGrupo (event) {
    let that = this;
    let grupo = {
      id: Date.now(),
      id_area: that.props.currentArea,
      label: that.state.newGrupo,
      value: that.state.newGrupo
    };
    that.setState({
      isLoading: true
    }, function(){
      Data.create(grupo).then(function(response){
        if(response.status === 200){
          let grupos = that.state.data;
          grupos.push({
            id: grupo.id,
            id_area: grupo.id_area,
            label: grupo.label,
            value: grupo.value,
            _id: response.data.id,
            _rev: response.data.rev
          });
          that.setState({
            data: grupos,
            temp: grupos,
            newGrupo: "",
            isLoading: false
          });
        }
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao adicionar o grupo', 'danger');
            console.log("create grupo error", error);
          });
        })
    });
  }

  updateGrupo(grupo) {
    let that = this;
    let grupos = this.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.update(grupo).then(function(response){
        grupos.forEach(function(entry, index){
          if(entry._id == grupo._id){
            grupos[index] = grupo;
          }
        });
        that.setState({
          isLoading: false,
          data: grupos
        });
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao atualisar o Grupo', 'danger');
            console.log("grupo update error", error);
          });
        })
    });
  }

  removeGrupo (grupo) {
    let that = this;
    let grupos = that.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.remove(grupo).then(function(response){
        grupos.forEach(function(entry, index){
          if(entry._id == grupo._id){
            grupos.splice(index, 1);
          }
        });
        that.setState({
          isLoading: false,
          data: grupos
        });
      }).catch(function(error){
        that.setState({
          isLoading: false
        }, function(){
          Toast.open('Erro ao deletar o grupo', 'danger');
          console.log("grupo delete error", error);
        });
      });
    });
  }
  
  render() {
    let that = this;
    return (
        <div className="container grupos">
          <div className="header">
            <div>
              <div className="field">
                <p className="control has-icons-left is-pulled-left">
                  <input className="input" id='newGrupo' type="text" placeholder="Nome do Grupo" value={this.state.newGrupo} onChange={this.handleSearchChange} />
                  <span className="icon is-small is-left">
                    <i className="fa fa-search"></i>
                  </span>
                </p>
                <button onClick={that.createGrupo} className="button is-small is-primary is-pulled-right">
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
          <div className="body">
            {
              this.state.isLoading ? null : 
              this.state.temp.map(function(entry){
                if(entry.id_area != false && entry.id_area == that.props.currentArea){
                  return <div className="grupo field" key={entry._id} data-grupoId={entry.id} onClick={that.handleItemClick}>
                    <input type="text" className="input" value={entry.value} onChange={(event) => { that.handleGrupoEdit(event, entry) }}/>
                    <div className="menu">
                      <button onClick = {event => {that.updateGrupo(entry)}} className="button is-small is-primary is-right">
                        <span>Atualizar</span>
                      </button>
                      <button onClick = {event => {that.removeGrupo(entry)}} className="button is-small is-primary is-right">
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                }
              })
            }
            { this.state.isLoading ? <Loading /> : null }
          </div>
        </div>
    );
  }
}

export default Grupo;