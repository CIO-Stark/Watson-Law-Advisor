import React, { Component } from 'react';
import * as ModalService from '../../modal/modal_service';
import FileForm from './file_form';
import FileModal from './file_modal';
import moment from 'moment';
// import FileHelper from './file_helper';

const fields = [
  {
    label: 'Área Judicial',
    prop: 'area_judicial',
  },
  {
    label: 'Grupo de Assuntos',
    prop: 'grupo_de_assunto',
  },
  {
    label: 'Assuntos',
    prop: 'assunto',
    isMulti: true,
    hasLabelColor: true
  }
];

class FileItem extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      expanded: true
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handlePropChange = this.handlePropChange.bind(this);
    this.handleFileToSave = this.handleFileToSave.bind(this);
  }

  handleExpand (event) {
    this.setState({ expanded: !this.state.expanded });
  }

  handlePropChange (prop, value) {
    this.props.onChange(this.props.item, { prop, value });
  }

  handleFileToSave () {
    ModalService.dismiss();
    this.props.onSave(this.props.item);
  }

  openModal () {
    ModalService.open(<FileModal categories={this.categories} item={this.props.item} fields={fields} onChange={this.handlePropChange} onSave={this.handleFileToSave} />);
  }

  render () {
    const item = this.props.item;
    const isExpanded = this.state.expanded;
    const selectList = isExpanded ? fields : fields.slice(0,4);

    return (
      <div className="file-item">
        <div className="header level">
          <div className="level-left">
            <p className="level-item"><span className="is-small">Arquivo: { item.filename }</span></p>
          </div>

          <div className="level-right">
            { item.isNew ? <p className="status level-item"><span className="tag is-new">Novo</span></p> : null }
            {
              item.status === 'revised' ?
              <p className="status level-item"><span className="tag is-success">Revisado</span></p> :
              <p className="status level-item"><span className="tag is-warning">Pendente</span></p>
            }
          </div>
        </div>

        <div className="select-section">
          <FileForm categories={this.categories} item={item} onChange={this.handlePropChange} />
        </div>

        {
          isExpanded ?
          <div className="buttons level">
            <div className="level-left">
              <p className="level-item"><span className="is-small">Data de envio: { moment(item.date_creation).format('DD/MM/YYYY - HH:mm:ss') }</span></p>
            </div>
            
            <div className="level-right">
              <button className="button is-info is-small" onClick={() => {this.props.openModal(this.props.item)} }>Visualizar Documento</button>
              {
                item.status === 'revised' ?
                  <button className="button is-small" onClick={() => { this.props.onCsvDownload(this.props.item) }}>Exportar CSV</button> :
                  null
              }
              {
                item.status === 'pending' ?
                  <button className="button is-small" onClick={() => { this.props.onResetOptions(this.props.item) }}>Resetar as opções do Watson</button> :
                  null
              }
              {
                  item.status !== 'pending' ? null :
                  <button className={ 'button is-primary is-small' + (this.props.isSaving ? ' is-loading' : '') } onClick={this.handleFileToSave}>Classificação Confirmada</button>
              }
            </div>
          </div> : null
        }
        

        {/*<div className="footer has-text-centered">
          <span className="icon clickable" onClick={this.handleExpand}>
            {
              isExpanded ?
              <i className="ibm-icon-extra ibm-expand_less"></i> :
              <i className="ibm-icon-extra ibm-expand_more"></i>
            }
          </span>
        </div>*/}
      </div>
    );
  }
}

export default FileItem;