import React, { Component } from 'react';
import * as Service from './modal_service';

class Modal extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      children: null,
      isActive: false
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show (content) {
    this.setState({ isActive: true, children: content });
  }

  hide () {
    this.setState({ isActive: false, children: null });
  }

  componentDidMount () {
    Service.subscribe('open', this.show);
    Service.subscribe('dismiss', this.hide);
  }

  render() {
    const className = 'modal' + (this.state.isActive ? ' is-active' : '');

    return (
      <div className={className}>
        <div className="modal-background" onClick={this.hide}>
            <button className="modal-close is-large" aria-label="close"></button>
        </div>
        <div className="modal-content">
          { this.state.children }
        </div>
      </div>
    );
  }
}

export default Modal;