import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import * as Data from '../../data/assunto';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject } from '../../utils/utils';

class Assunto extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      data: [],
      temp: [],
      newAssunto: "",
      isLoading: true
    };

  //bind methods
    this.loadData = this.loadData.bind(this);
    this.handleItemClick = this.props.onItemClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAssuntoEdit = this.handleAssuntoEdit.bind(this);
    this.search = this.search.bind(this);
    this.createAssunto = this.createAssunto.bind(this);
    this.updateAssunto = this.updateAssunto.bind(this);
    this.removeAssunto = this.removeAssunto.bind(this);
  }

  componentDidMount () {
    this.loadData(function(error, data){
      if(!error){
        console.log("assuntos carregados");
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
          callback(null, this.state.data);
        });
      }
      else{
        that.setState({ isLoading: false }, function(){
          callback("falha ao carregar Assuntos", null);
          Toast.open('Falha ao carregar Assuntos', 'danger');
          console.log("assunto data load failed", response.message);
        });
      }
    }).catch(function(error){
        that.setState({ isLoading: false }, function(){
          callback("erro ao carregar Assuntos", null);
          Toast.open('Erro ao carregar Assuntos', 'danger');
          console.log("assunto data load error", error);
        });
    });
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({
      newAssunto: value
    }, this.search);
  }
  
  handleAssuntoEdit (event, assunto){
    let assuntos = this.state.data;
    const value = event.target.value;
    assunto.label = value;
    assunto.value = value;
    assuntos.forEach(function(entry, index){
      if(entry._id == assunto._id){
        assuntos[index] = assunto;
      }
    });
    this.setState({
      data: assuntos
    });
  }

  search () {
    let that =  this;
    let result = [];
    if(that.state.newAssunto == ""){
      result = that.state.data;
    }
    else{
      let regex = new RegExp(that.state.newAssunto, "gi");
      that.state.data.forEach(function(assunto){
        if(assunto.value.match(regex)){
          result.push(assunto);
        }
      });
    }
    that.setState({
      temp: result
    });
  }
  
  createAssunto (event) {
    let that = this;
    let assunto = {
      label: that.state.newAssunto,
      value: that.state.newAssunto,
      groups_id: that.props.currentGrupo
    };
    that.setState({
      isLoading: true
    }, function(){
      Data.create(assunto).then(function(response){
        if(response.status === 200){
          let assuntos = that.state.data;
          assuntos.push({
            groups_id: assunto.groups_id,
            label: assunto.label,
            value: assunto.value,
            _id: response.data.id,
            _rev: response.data.rev
          });
          that.setState({
            data: assuntos,
            temp: assuntos,
            newAssunto: "",
            isLoading: false
          });
        }
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao adicionar assunto', 'danger');
            console.log("create assunto error", error);
          });
        })
    });
  }

  updateAssunto (assunto) {
    let that = this;
    let assuntos = this.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.update(assunto).then(function(response){
        assuntos.forEach(function(entry, index){
          if(entry._id == assunto._id){
            assuntos[index] = assunto;
          }
        });
        that.setState({
          isLoading: false,
          data: assuntos
        });
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao atualisar assunto', 'danger');
            console.log("assunto update error", error);
          });
        })
    });
  }

  removeAssunto (assunto) {
    let that = this;
    let assuntos = that.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.remove(assunto).then(function(response){
        assuntos.forEach(function(entry, index){
          if(entry._id == assunto._id){
            assuntos.splice(index, 1);
          }
        });
        that.setState({
          isLoading: false,
          data: assuntos
        });
      }).catch(function(error){
        that.setState({
          isLoading: false
        }, function(){
          Toast.open('Erro ao deletar assunto', 'danger');
          console.log("assunto delete error", error);
        });
      });
    });
  }
  
  render() {
    let that = this;
    return (
        <div className="container assuntos">
          <div className="header">
            <div>
              <div className="field">
                <p className="control has-icons-left is-pulled-left">
                  <input className="input" id='newAssunto' type="text" placeholder="Nome do Assunto" value={this.state.newAssunto} onChange={this.handleSearchChange} />
                  <span className="icon is-small is-left">
                    <i className="fa fa-search"></i>
                  </span>
                </p>
                <button onClick={that.createAssunto} className="button is-small is-primary is-pulled-right">
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
          <div className="body">
            {
              this.state.isLoading ? null : 
              this.state.temp.map(function(entry, index){
                let assuntosList = [];
                return that.props.currentGrupo.map(function(grupo){
                  if(entry.hasOwnProperty("groups_id") && entry.groups_id.indexOf(Number(grupo)) != -1 && assuntosList.indexOf(entry._id) == -1){
                    assuntosList.push(entry._id);
                    return <div className="assunto field" key={entry._id} data-assuntoId={entry.id} onClick={that.handleItemClick}>
                      <input type="text" className="input" value={entry.value} onChange={(event) => { that.handleGrupoEdit(event, entry) }}/>
                      <div className="menu">
                        <button onClick = {event => {that.removeAssunto(entry)}} className="button is-small is-primary is-right">
                          <span>Atualizar</span>
                        </button>
                        <button onClick = {event => {that.removeAssunto(entry)}} className="button is-small is-primary is-right">
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  }
                })
              })
            }
            { this.state.isLoading ? <Loading /> : null }
          </div>
        </div>
    );
  }
}

export default Assunto;