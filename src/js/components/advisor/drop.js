import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

const Drop = props => {
  return (
    <Dropzone onDrop={props.onDrop} className="drop-zone">

        {
          ({ isDragActive }) => {
            return (
              <div className="message">
                <span>Arraste seus arquivos</span>
                <span>ou</span>
                <span>clique para fazer upload</span>
                <span className="icon">
                  <i className={ isDragActive ? "ibm-icon ibm-add-new is-primary" : "ibm-icon ibm-add-new" }></i>
                </span>
              </div>
            );
          }
        }
      
    </Dropzone>
  );
};

export default Drop;