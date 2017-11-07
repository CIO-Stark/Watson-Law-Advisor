import React, { Component } from 'react';
import Dropbox from '../../shared/dropbox';
import * as Toast from '../../shared/toast/toast_service';
import * as Assunto from '../../../data/assunto';
import * as Grupo from '../../../data/grupo';

const API = {
    grupo: Grupo,
    assunto: Assunto
};

const POPOVER_WIDTH = 250;
const POPOVER_HEIGHT = 62;
const LEFT_COMPENSATION = 40;
const TOP_COMPENSATION = 105;

class RegisterPopup extends Component {
    constructor (props, context) {
        super(props, context);
        
        this.state = {
            showPopover: false,
            type: null,
            selected: null,
            message: 'Adicionar novo:',
            text: null,
            position: {
                x: 0,
                y: 0
            }
        };

        this.selectType = this.selectType.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.onDropboxChange = this.onDropboxChange.bind(this);
    }

    componentDidMount () {
        document.querySelector(`#${this.props.container}`).addEventListener('mouseup', this.showPopover);
        
    }

    componentWillUnmount () {
        document.querySelector(`#${this.props.container}`).removeEventListener('mouseup', this.showPopover);
    }

    _getSelection () {
        let selection = null;

        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection && document.selection.type != "Control") {
            selection = document.selection.createRange();
        }

        return selection;
    }

    showPopover (event) {
        this.setState({ showPopover: false, type: null, selected: null }, () => {
            const selection = this._getSelection();
            const text = selection.toString();
            
            if (text) {
                const selectionBox = selection.getRangeAt(0).getBoundingClientRect();
                const position = {
                    y: selectionBox.top - 155,
                    x: selectionBox.left - POPOVER_WIDTH / 2
                };
                
                this.setState({ showPopover: true, position, text: text });
            }
        });
    }

    selectType (type) {
        const message = type === 'assunto' ? 'Selecione os grupos desse assunto' : 'Selecione a área desse grupo';
        this.setState({ type, message });
    }

    onDropboxChange (selected) {
        const type = this.state.type;

        this.setState({ selected }, () => {
            let data = {
                id: Date.now(),
                label: this.state.text,
                value: this.state.text
            };

            if (this.state.type === 'assunto') {
                data.groups_id = [selected.id];
            } else {
                data.id_area = [selected.id_area];
            }

            API[this.state.type].create(data)
            .then(response => {
                Toast.open(type + ' adicionado', 'success');
            })
            .catch(error => {
                console.log('onDropBoxChange error: ', error);
                const message = error.message ? error.message : 'Erro ao adicionar ' + type;
                Toast.open(message, 'danger');
            });
        });
    }
    
    render () {
        if (!this.state.showPopover) {
            return null;
        }

        let categories = this.props.categories;
        let content = null;

        if (this.state.type) {
            let type = this.state.type === 'assunto' ? 'grupo_de_assunto' : 'area_judicial';
            content = (<Dropbox value={this.state.selected} options={categories[type].options} onChange={this.onDropboxChange} />);
        } else {
            content = (
                <div className="register-buttons columns">
                    <div className="column"><button className="button is-fullwidth is-small" onClick={e => { this.selectType('grupo') }}>Grupo</button></div>
                    <div className="column"><button className="button is-fullwidth is-small" onClick={e => { this.selectType('assunto') }}>Assunto</button></div>
                </div>
            );
        }

        return (
            <div className="register-popup box slide-in" style={{ left: this.state.position.x, top: this.state.position.y }}>
                <span className="register-message">{ this.state.message }</span>
                { content }
            </div>
        );
    }
}

export default RegisterPopup;

{/* <form className="form">
    <Dropbox label="Área Judicial" item={item} prop="area_judicial" options={data.area_judicial.options} onChange={this.props.onChange} />
    <Dropbox label="Grupo de Assunto" item={item} prop="grupo_de_assunto" options={data.grupo_de_assunto.options} onChange={this.props.onChange} />
    <Dropbox label="Assuntos" item={item} prop="assunto" options={data.assunto.options} onChange={this.props.onChange} />
</form> */}