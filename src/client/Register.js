import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios';

import { Container, Input, Form, Submit, Header, Warning, Change, onChange } from './LogReg';

import { LoginRegisterAnimator, LoginRegisterFetchingAnimator } from './Base';
import { SpriteBox, SpriteImg } from './Sprite';

import spriteSrc from '../../public/sprite.png';

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingLogin: true,
            email: '',
            password1: '',
            password2: '',
            errors: '',
            isFetching: false
        };
        this.ContainerElement = React.createRef();
        this.FormElement = React.createRef();
        this.SpriteElement = React.createRef();
    }

    componentDidMount() {
        LoginRegisterAnimator.call(this, 'Register');
        LoginRegisterFetchingAnimator.call(this, 'Register');
    }
    componentDidUpdate() {
        LoginRegisterAnimator.call(this, 'Register');
        LoginRegisterFetchingAnimator.call(this, 'Register');
    }

    register = (evt) => {
        if (this.props.isFetching) return;
        const { email, password1, password2 } = this.state;

        this.props.fetchingToggle();

        axios
            .post('/api/register', { email, password1, password2 })
            .then(response => response.data)
            .then(data => {
                if (data.status === 'error') {
                    this.props.fetchingToggle();
                    this.setState({ errors: 'try again...' });
                } else if (data.status === 'success') {
                    this.setState({
                        email: '',
                        password1: '',
                        password2: '',
                        errors: ''
                    });

                    this.props.LoginRegisterToggle();
                    this.props.fetchingToggle();
                }
            })
    }

    render() {
        const { email, password1, password2, errors } = this.state;
        const { LoginRegisterToggle, isFetching } = this.props;

        return (
            <Container innerRef={this.ContainerElement} style={{ transform: 'translate(100%)', opacity: 0 }}>
                <Form style={{ pointerEvents: isFetching ? 'none' : null }} innerRef={this.FormElement}>
                    <Header>Register</Header>
                    <Input type='text' placeholder="email" name="email" value={email} onChange={onChange.bind(this)} />
                    <Input type='text' placeholder="password" name="password1" value={password1} onChange={onChange.bind(this)} />
                    <Input type='text' placeholder="repeat password" name="password2" value={password2} onChange={onChange.bind(this)} />
                    <Submit type="button" onClick={this.register} value='Register' />
                    <Warning>{errors || '.'}</Warning>
                    <Change onClick={LoginRegisterToggle}>Already a member? Click to log in!</Change>
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
    LoginRegisterToggle: () => dispatch({ type: 'LOGIN_REGISTER_TOGGLE', payload: 'register' }),
    fetchingToggle: () => dispatch({ type: 'FETCHING_TOGGLE' }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)
