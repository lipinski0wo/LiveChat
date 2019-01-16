import React, { Component } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

import { getUserAndToken, setToken, removeToken } from './localStorage';

import LogReg from './LogReg';
import Base from './Base';
import Login from './Login';
import Register from './Register';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: null,
      token: null,
      isAuthorized: false,
      isShowingLogin: true,
      isFetching: false
    };
  }
  getDefaultState = () => {
    const feedback = getUserAndToken();

    if (!feedback) return;

    this.setState({
      user: feedback.user,
      token: feedback.token,
      isAuthorized: true
    });
  }

  fromRegister = (response) => {
    console.log(response);
  }

  fromLogin = (token) => {
    setToken(token);
    this.getDefaultState();
  }

  componentDidMount() {
    this.getDefaultState();
  }

  initSocket(socket) {
  }

  logRegToggle = () => {
    this.setState({ isShowingLogin: !this.state.isShowingLogin });
  }

  fetchingToggle = () => {
    this.setState({ isFetching: !this.state.isFetching });
  }
  baseContent = () => {
    const { isAuthorized, isShowingLogin, isFetching } = this.state;
    const destructure = { isShowingLogin, isFetching, logRegToggle: this.logRegToggle, fetchingToggle: this.fetchingToggle }
    if (isAuthorized) {
      return 'is authorized'
    }

    return (
      <LogReg>
        <Login callback={this.fromLogin} {...destructure} />
        <Register callback={this.fromRegister} {...destructure} />
      </LogReg>
    )
  }

  render() {
    return (
      <Base>
        {this.baseContent()}
      </Base>
    );
  }
}

export default App;
