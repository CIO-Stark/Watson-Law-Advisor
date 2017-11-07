import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import * as Data from '../../data/area';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject } from '../../utils/utils';

class Area extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      data: [],
      temp: [],
      newArea: "",
      isLoading: true
    };

//bind methods
    this.loadData = this.loadData.bind(this);
    this.handleItemClick = this.props.onItemClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAreaEdit = this.handleAreaEdit.bind(this);
    this.search = this.search.bind(this);
    this.createArea = this.createArea.bind(this);
    this.updateArea = this.updateArea.bind(this);
    this.removeArea = this.removeArea.bind(this);
  }

  componentDidMount () {
    this.loadData(function(error, data){
      if(!error){
        console.log("areas carregadas");
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
          callback("falha ao carregar Areas", null);
          Toast.open('Falha ao carregar Areas', 'danger');
          console.log("area data load failed", response.message);
        });
      }
    }).catch(function(error){
        that.setState({ isLoading: false }, function(){
          callback("erro ao carregar Areas", null);
          Toast.open('Erro ao carregar Areas', 'danger');
          console.log("area data load error", error);
        });
    });
  }

  handleSearchChange (event) {
    const value = event.target.value;
    this.setState({
      newArea: value
    }, this.search);
  }

  handleAreaEdit (event, area){
    let areas = this.state.data;
    const value = event.target.value;
    area.label = value;
    area.value = value;
    areas.forEach(function(entry, index){
      if(entry._id == area._id){
        areas[index] = area;
      }
    });
    this.setState({
      data: areas
    });
  }

  search () {
    let that =  this;
    let result = [];
    if(that.state.newArea == ""){
      result = that.state.data;
    }
    else{
      let regex = new RegExp(that.state.newArea, "gi");
      that.state.data.forEach(function(area){
        if(area.value.match(regex)){
          result.push(area);
        }
      });
    }
    that.setState({
      temp: result
    });
  }

  createArea (event) {
    let that = this;
    let area = {
      id_area: that.state.newArea,
      label: that.state.newArea,
      value: that.state.newArea
    };
    that.setState({
      isLoading: true
    }, function(){
      Data.create(area).then(function(response){
        if(response.status === 200){
          let areas = that.state.data;
          areas.push({
            id_area: area.id_area,
            label: area.label,
            value: area.value,
            _id: response.data.id,
            _rev: response.data.rev
          });
          that.setState({
            data: areas,
            temp: areas,
            newArea: "",
            isLoading: false
          });
        }
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao adicionar o área', 'danger');
            console.log("create area error", error);
          });
        })
    });
  }

  updateArea(area) {
    let that = this;
    let areas = this.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.update(area).then(function(response){
        areas.forEach(function(entry, index){
          if(entry._id == area._id){
            areas[index] = area;
          }
        });
        that.setState({
          isLoading: false,
          data: areas
        });
      }).catch(function(error){
          that.setState({
            isLoading: false
          }, function(){
            Toast.open('Erro ao atualisar o Área', 'danger');
            console.log("area update error", error);
          });
        })
    });
  }

  removeArea (area) {
    let that = this;
    let areas = that.state.data;
    that.setState({
      isLoading: true
    }, function(){
      Data.remove(area).then(function(response){
        areas.forEach(function(entry, index){
          if(entry._id == area._id){
            areas.splice(index, 1);
          }
        });
        that.setState({
          isLoading: false,
          data: areas
        });
      }).catch(function(error){
        that.setState({
          isLoading: false
        }, function(){
          Toast.open('Erro ao deletar o área', 'danger');
          console.log("area delete error", error);
        });
      });
    });
  }
  
//dom
  render() {
    let that = this;
    return (
        <div className="container areas">
          <div className="header">
            <div className="field">
              <p className="control has-icons-left is-pulled-left">
                <input className="input" id='newArea' type="text" placeholder="Nome da Área" value={this.state.newArea} onChange={this.handleSearchChange} />
                <span className="icon is-small is-left">
                  <i className="fa fa-search"></i>
                </span>
              </p>
              <button onClick={that.createArea} className="button is-small is-primary is-pulled-right">
                <span>Adicionar</span>
              </button>
            </div>
          </div>
          <div className="body">
            {
              this.state.isLoading ? null : 
              this.state.temp.map(function(entry, index){
                return <div className="area field" key={entry._id} data-areaId={entry.id_area} onClick={that.handleItemClick}>
                  <input type="text" className="input" value={entry.value} onChange={(event) => { that.handleAreaEdit(event, entry) }}/>
                  <div className="menu">    
                    <button onClick = {event => {that.updateArea(entry)}} className="button is-small is-primary is-right">
                      <span>Atualizar</span>
                    </button>    
                    <button onClick = {event => {that.removeArea(entry)}} className="button is-small is-primary is-right">
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              })
            }
            { this.state.isLoading ? <Loading /> : null }
          </div>
        </div>
    );
  }
}

export default Area;