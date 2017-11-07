import React from 'react';
import Select from 'react-select';

const Dropbox = props => {
  return (
    <div className="field">
      { props.label ? <label className="label is-small"> { props.label } </label> : null }
      <div className="control">
        <Select
            multi={props.multi}
            delimiter=","
            placeholder="Selecione uma opção."
            noResultsText="Nenhum resultado encontrado."
            clearable={props.clearable ? true : false}
            clearAllText="Remover todos os itens"
            value={props.value}
            options={props.options}
            onChange={value => props.onChange(value)}
          />
      </div>
    </div>
  );
};

export default Dropbox;

// <Creatable
//             className="is-small"
//             placeholder="Selecione uma opção"
//             noResultsText="Nenhum resultado encontrado."
//             clearable={false}
//             value={props.item.data[props.prop].selected}
//             options={props.options}
//             onChange={value => { props.onChange(props.prop, value.value); }}
//             promptTextCreator={label => { return `Input manual: ${label}` }}
//           />