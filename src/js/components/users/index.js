import React, { Component } from 'react';
import NavBar from '../navbar/';
import Loading from '../shared/loading';
import * as data from '../../data/user';
import * as ModalService from '../modal/modal_service';
import * as Toast from './../shared/toast/toast_service';
import { indexOfObject } from '../../utils/utils';

class Users extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: [],
      isLoading: true,
      newUserEmail: "",
      newUserProfile: "normal",
      newUserPassword: ""
    };

    //bind methods
    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    let that = this;
    data.load().then(function (response) {
      if (response.status) {
        that.setState({
          data: response.data,
          isLoading: false
        });
      }
      else {
        that.setState({ isLoading: false });
        Toast.open('Falha ao carregar Usuários', 'danger');
        console.log("user data load failed", response.message);
      }
    }).catch(function (error) {
      that.setState({ isLoading: false });
      Toast.open('Erro ao carregar Usuários', 'danger');
      console.log("user data load error", error);
    });
  }

  //methods
  handleChange(event) {
    const target = event.target.id;
    const value = event.target.value;
    this.setState({ [target]: value });
  }

  createUser(event) {
    let user = {};
    user.email = this.state.newUserEmail;
    user.password = this.state.newUserPassword;
    user.profile = this.state.newUserProfile;
    this.setState({ isLoading: true });
    data.create(user)
      .then(
      (response) => {
        if (response.status === 200) {
          let users = this.state.data;
          users.push({
            email: user.email,
            password: user.password,
            profile: user.profile,
            _id: response.data.id,
            _rev: response.data.rev
          });
          this.setState({ data: users, newUserEmail: "", newUserPassword: "", isLoading: false });
        }
      }
      )
      .catch(
      (error) => {
        this.setState({ isLoading: false });
        Toast.open('Erro ao adicionar o usuario', 'danger');
        console.log("Create user error", error);
      }
      )

  }

  fieldChange(event, field, index) {
    let users = this.state.data;
    users[index][field] = event.target.value;
    this.setState({ data: users });
  }

  updateUser(user, index) {
    let users = this.state.data;
    this.setState({ isLoading: true });

    data.update(user)
      .then(response => {
        users[index]._rev = response.data.rev;
        this.setState({ isLoading: false, data: users });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Toast.open('Erro ao atualisar o usuário', 'danger');
        console.log("user update error", error);
      })

  }

  deleteUser(user, index) {
    let users = this.state.data;
    this.setState({ isLoading: true });

    data.remove(user)
      .then(response => {
        console.log(response);
        users.splice(index, 1);
        this.setState({ isLoading: false, data: users });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Toast.open('Erro ao deletar o usuário', 'danger');
        console.log("user delete error", error);
      })

  }

  render() {
    let that = this;
    return (
      <div className="container users">
        <div className='column'>
          <div>
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" id='newUserEmail' type="email" placeholder="Email" value={this.state.newUserEmail} onChange={this.handleChange} />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" id='newUserPassword' type="password" placeholder="Senha" value={this.state.newUserPassword} onChange={this.handleChange} />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <span className="select">
                  <select id='newUserProfile' selected={this.state.newUserProfile} onChange={this.handleChange}>
                    <option value='normal'>Normal</option>
                    <option value='admin'>Admin</option>
                  </select>
                </span>
                <span className="icon is-small is-left">
                  <i className="fa fa-globe"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button onClick={this.createUser} className="button is-small is-primary is-right">
                  <span>Adicionar Usuário</span>
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="body">
          <div className='column'>
            {this.state.data.map((user, index) => {
              return (
                <div key={index} className="field has-addons" name='form'>
                  <p className="control has-icons-left">
                    <span className="select">
                      <select onChange={(event) => { that.fieldChange(event, "profile", index) }} value={user.profile} id='userType'>
                        <option value='admin'>Admin</option>
                        <option value='normal'>Normal</option>
                      </select>
                    </span>
                    <span className="icon is-small is-left">
                      <i className="fa fa-globe"></i>
                    </span>
                  </p>
                  <p className="control is-expanded has-icons-left">
                    <input className="input" id='userEmail' onChange={(event) => { that.fieldChange(event, "email", index) }} value={user.email} type="email" placeholder="Email" />
                    <span className="icon is-small is-left">
                      <i className="fa fa-envelope"></i>
                    </span>
                  </p>
                  <p className="control has-icons-left">
                    <input className="input" id='userPassword' onChange={(event) => { that.fieldChange(event, "password", index) }} value={user.password} type="password" placeholder="Senha" />
                    <span className="icon is-small is-left">
                      <i className="fa fa-lock"></i>
                    </span>
                  </p>
                  <p className="control" onClick={event => { that.updateUser(user, index) }}>
                    <a className="button" title='Save'>
                      <i className="fa fa-floppy-o"></i>
                    </a>
                  </p>
                  <p className="control" onClick={event => { that.deleteUser(user, index) }}>
                    <a className="button" title='Deletar'>
                      <i className="fa fa-trash-o"></i>
                    </a>
                  </p>
                </div>
              )
            })}
            {this.state.isLoading ? <Loading /> : null}
          </div>
        </div>
      </div>

    );
  }
}

export default Users;