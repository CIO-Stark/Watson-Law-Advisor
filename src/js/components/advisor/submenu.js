import React, { Component } from 'react';
import Input from '../shared/input';

class AdvisorSubMenu extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }
  

  handleChange (event) {
    const parent = event.target.parentNode;

    this.sortParent.querySelector('.selected').classList.remove('selected');
    parent.classList.add('selected');

    this.props.filterBy(event.target.id);
  }
  
  render() {
    let isProcessingClass = this.props.status.current > 0 ? ' is-loading' : '';
    let status = this.props.status; // processing status

    return (
        <div className="level submenu hr">
        <div className="level-left">
            <div className="level-item">
            <Input placeholder="Pesquisar..." value={this.props.searchedTerm} onChange={this.props.searchBy} onKeyChange={this.props.onSearchKeyPress} />
            </div>
        </div>

        {
            status.current !== null && status.total !== null ?
            <div className="level-item has-text-centered">
                <button className={`button button-message ${isProcessingClass}`}></button>
                { `Fila de processamento: ${status.current}/${status.total}` }
            </div> : null
        }
        
        <div className="level-right" ref={element => { this.sortParent = element; }}>
            <span className="level-item selected"><a id="all" onClick={this.handleChange}>Todos</a></span>
            <span className="level-item"><a id="pending" onClick={this.handleChange}>Pendentes</a></span>
            <span className="level-item"><a id="revised" onClick={this.handleChange}>Revisados</a></span>
            <span className="level-item">
            <a className="button button-add is-small is-primary" onClick={this.props.openModal}>
                <span className="icon">
                    <i className="ibm-icon ibm-add-new"></i>
                </span>
                <span>Nova Carga</span>
            </a>
            </span>
        </div>
        </div>
);
  }
}

export default AdvisorSubMenu;