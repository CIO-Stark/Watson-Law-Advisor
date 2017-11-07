import React, { Component } from 'react';
import Dropbox from '../../shared/dropbox';

class FileForm extends Component {

  constructor(props, context) {
    super(props, context);
    
    this.selectedSubjectGroups = {}; // grupos dos assuntos selecionados
  }

  buildGroupOptions () {
    this.item.data.assunto.options;
  }

  attachOptionsOnFile (file) {
    for (let cat in this.categories) {
      file.data[cat].options_bk = file.data[cat].options;
      file.data[cat].options = file.data[cat].options.concat(this.categories[cat].options);
      // file.data[cat].selected = file.data[cat].selected || file.data[cat].options[0].value;
    }
    
    return file;
  }


  render() {
    let item = this.props.item;
    let data = item.data;
    let className = 'column ' + (this.props.shouldStretch ? 'is-12' : 'is-half');

    return (
      <div className="columns is-multiline">
        <div className={className}>
          <Dropbox 
            label="Área Judicial" 
            value={item.data.area_judicial.selected}
            options={data.area_judicial.options} 
            onChange={value => { this.props.onChange('area_judicial', value); }} />
        </div>
        <div className={className}>
          <Dropbox 
            label="Grupo de Assunto" 
            value={item.data.grupo_de_assunto.selected} 
            options={data.grupo_de_assunto.options} 
            onChange={value => { this.props.onChange('grupo_de_assunto', value); }} />
        </div>
        <div className="column is-12 multi assunto-dropbox">
          <Dropbox 
            label="Assuntos" 
            value={item.data.assunto.selected} 
            options={data.assunto.options} 
            onChange={value => { this.props.onChange('assunto', value); }} multi clearable />
        </div>

        {/* SISJUR Fields */}
      </div>
    );
  }
}

export default FileForm;