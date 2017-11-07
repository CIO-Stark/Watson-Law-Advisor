import React, { Component } from 'react';
import * as ToastService from './toast_service';

class Toast extends Component {

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      notifications: [],
      isActive: false
    };

    this.setMessage = this.setMessage.bind(this);
    this.pushNotification = this.pushNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentDidMount () {
    ToastService.subscribe('open', this.pushNotification);
  }

  setMessage (notification, message) {
    let notifications = this.state.notifications;
    let index = notifications.indexOf(notification);

    notifications[index].message = message;

    this.setState({ notifications });
  }
  
  pushNotification (message, type, returnNotification) {
    let self = this;
    let notifications = self.state.notifications;
    // building notification obj
    let notification = {
        type: type,
        message: message,
        setMessage: (message) => {
            self.setMessage(notification, message);
        },
        remove: (time) => {
            self.removeNotification(notification, time);
        }
    };

    notifications.push(notification);

    self.setState({ notifications, isActive: true }, () => {
      if (!returnNotification) self.removeNotification(notification);
    });

    if (returnNotification) {
        return notification;
    }
  }

  removeNotification (notification, time) {
    setTimeout(() => {
      let isActive = this.state.isActive;
      let notifications = this.state.notifications;
      let index = notifications.indexOf(notification);

      if (index === -1) {
        throw new Error('Notification to be removed not found.');
      }

      notifications.splice(index, 1);

      if (!notifications.length) {
        isActive = false;
      }

      this.setState({ notifications, isActive });
    }, time || 5000);
  }

  resolveNotificationType (type) {
    switch (type) {
      case 'warning': return 'is-warning';
      case 'success': return 'is-success';
      case 'danger': return 'is-danger';
      default: return 'is-info';
    }
  }

  render() {
    return (
      <div className={'toast-container' + (this.state.isActive ? ' is-active': '') } >
        {
          this.state.notifications.map((notification, index) => {
            return (
              <div key={index} className={'notification ' + this.resolveNotificationType(notification.type)}>
                <p>{ notification.message }</p>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Toast;