import React from 'react';

const Input = props => {
  return (
    <div className="field">
      { props.label ? <label htmlFor="" className="label">{ props.label }</label> : null }
      <p className="control has-icons-right">
        <input type="text" className="input is-small" placeholder={props.placeholder} onChange={props.onChange} onKeyPress={props.onKeyChange} value={props.value} />
        <span className="icon is-small is-right">
          <i className="ibm-icon ibm-search"></i>
        </span>
      </p>
    </div>
  );
};

export default Input;