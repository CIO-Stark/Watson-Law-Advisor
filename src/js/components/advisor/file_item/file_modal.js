import React, { Component } from 'react';
import Dropbox from '../../shared/dropbox';
import FileForm from './file_form';
import Loading from '../../shared/loading';
import RegisterPopup from '../register_popup/';
import * as Data from '../../../data/assunto';
import * as Toast from '../../shared/toast/toast_service';

class FileModal extends Component {
  constructor (props, context) {
    super(props, context);

  //state
    this.state = {
      isLoading: false,
      newAssunto: "",
      newAssuntoGrupo: ""
    };

    this.textContainer = null;

    //bind methods
    this.createAssunto = this.createAssunto.bind(this);
    this.getSelectionText = this.getSelectionText.bind(this);
  }

  componentWillUnmount () {
    this.textContainer = null;
  }
  
//methods
  createAssunto () {
    let that = this;
    let assunto = {
      id: Date.now(),
      label: that.state.newAssunto,
      value: that.state.newAssunto,
      groups_id: [that.state.newAssuntoGrupo]
    };
    that.setState({
      isLoading: true
    }, function(){
      Data.create(assunto).then(function(response){
        if(response.status === 200){
          let assuntos = that.state.data;
          that.setState({
            newAssunto: "",
            newAssuntoGrupo: "",
            isLoading: false
          }, function(){
            Toast.open('Assunto adicionado', 'success');
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

  getSelectionText (event) {
    let text = null;
    let selectedText = null;
    let selectedBox = null;

    if (window.getSelection) {
        text = window.getSelection().toString();
        selectedBox = window.getSelection().getRangeAt(0).getBoundingClientRect();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }

    if (text) {
        console.log('SelectedBox: ', selectedBox);
        const POPOVER_WIDTH = 250;
        const LEFT_COMPENSATION = 40;
        const TOP_COMPENSATION = 105;
        selectedText = {
            text: text,
            position: {
                x: Math.ceil(selectedBox.left / 2) + (POPOVER_WIDTH / 2), //event.pageX - LEFT_COMPENSATION - (POPOVER_WIDTH / 2) - (text.length / 2),
                y: event.pageY - TOP_COMPENSATION
            }
        };
        
        // console.log('Position: ', event.clientX,' - ', event.clientY);
        // console.log('Selected: ', text);
        // open popup register
        
        // this.openRegisterPopup(text, { x: event.clientX, y: event.clientY });
        
        // this.setState({
        //   newAssunto: text,
        //   newAssuntoGrupo: event.data.grupo_de_assunto.options[0].id
        // }, function(){
        //   console.log("current newAssunto", item, that.state.newAssunto, that.state.newAssuntoGrupo);
        //   that.createAssunto();
        // });
    }

    this.setState({ selectedText }, () => { console.log(this.state.selectedText); });
  }

  render() {
    let that = this;
    let item = this.props.item;

    return (
      this.state.isLoading ? null : 
      <div className="file-modal columns">
        <RegisterPopup categories={this.props.categories} container="file-content" />
        <div className="modal-subtitles is-two-thirds">
          <p className="is-small">
            <span className="subtitle tag discovery keywords">Palavras-chaves</span>
            <span className="subtitle tag discovery entities">Entidades</span>
            <span className="subtitle tag discovery assunto">Assuntos</span>
            <span className="subtitle tag discovery fields">Campos</span>
          </p>
        </div>

        <div id="file-content" className="file-content column is-two-thirds" dangerouslySetInnerHTML={{__html: item.html}}></div>

        <div className="file-aside column">
          <div className="select-section">
            <FileForm categories={this.props.categories} item={item} onChange={that.props.onChange} shouldStretch />
          </div>

          <div className="columns bottom">
            <div className="column">
                {
                    item.status === 'pending' ?
                    <button className="button is-info is-inverted is-pulled-right" onClick={this.props.onSave}>Salvar</button> :
                    null
                }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileModal;
// { 
//     !this.state.selectedText ? null : 
//     <RegisterPopup 
//         position={this.state.selectedText.position} 
//         text={this.state.selectedText.text} 
//         item={item}
//         categories={this.props.categories} />
// }