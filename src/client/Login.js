import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { setToken } from './localStorage';
import { Container, Input, Form, Submit, Header, Warning, Change, onChange } from './LogReg';

import { LoginRegisterAnimator, LoginRegisterFetchingAnimator } from './Base';

import { SpriteBox, SpriteImg } from './Sprite';

import spriteSrc from '../../public/sprite.png';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingLogin: true,
            email: '',
            password: '',
            errors: '',
            isFetching: false
        };
        this.ContainerElement = React.createRef();
        this.FormElement = React.createRef();
        this.SpriteElement = React.createRef();
    }

    componentDidMount() {
        LoginRegisterAnimator.call(this, 'Login');
        LoginRegisterFetchingAnimator.call(this, 'Login');
    }
    componentDidUpdate() {
        LoginRegisterAnimator.call(this, 'Login');
        LoginRegisterFetchingAnimator.call(this, 'Login');
    }

    login = (evt) => {
        if (this.props.isFetching) return;
        const { email, password } = this.state;

        this.props.fetchingToggle();

        axios
            .post('/api/login', { email, password })
            .then(response => response.data)
            .then(data => {
                if (data.status === 'error') {
                    this.props.fetchingToggle();
                    this.setState({ errors: 'try again...' });
                } else if (data.status === 'success') {
                    this.setState({
                        email: '',
                        password: '',
                        errors: ''
                    });

                    const decoded = jwtDecode(data.token);

                    this.props.loginUser(data.token, decoded);
                    this.props.fetchingToggle();
                    setToken(data.token);
                }
            })

    }

    render() {
        const { email, password, errors } = this.state;
        const { loginRegisterToggle, isFetching } = this.props;

        return (
            <Container innerRef={this.ContainerElement}>
                <Form style={{ pointerEvents: isFetching ? 'none' : null }} innerRef={this.FormElement}>
                    <Header>Login</Header>
                    <Input type='text' placeholder="email" name="email" value={email} onChange={onChange.bind(this)} />
                    <Input type='text' placeholder="password" name="password" value={password} onChange={onChange.bind(this)} />
                    <Submit type="button" onClick={this.login} value='Login' />
                    <Warning>{errors || '.'}</Warning>
                    <Change onClick={loginRegisterToggle}>New around here? Click to register!</Change>
                </Form>
                <SpriteBox innerRef={this.SpriteElement} style={{ opacity: 0 }}>
                    <SpriteImg src={spriteSrc} alt="" />
                </SpriteBox>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    isShowingLogin: state.isShowingLogin,
    isFetching: state.isFetching
});

const mapDispatchToProps = dispatch => ({
    loginRegisterToggle: () => dispatch({ type: 'LOGIN_REGISTER_TOGGLE', payload: 'login' }),
    fetchingToggle: () => dispatch({ type: 'FETCHING_TOGGLE' }),
    loginUser: (token, user) => dispatch({ type: 'LOGIN_USER', payload: { token, user } })
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
