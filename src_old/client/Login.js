import React, { Component } from 'react';
import axios from 'axios';
import { TweenMax } from 'gsap/TweenMax';
import { Container, Input, Form, Submit, Header, Warning, Change } from './LogReg';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingLogin: true,
            email: '',
            password: '',
            errors: '',
        }
        this.elementRef = React.createRef();
        this.formElement = React.createRef();
        this.d = null;
    }
    showLoginHandle = () => {
        if (this.props.isShowingLogin === this.state.isShowingLogin) return false;
        this.setState({ isShowingLogin: this.props.isShowingLogin });

        TweenMax.to(this.elementRef.current, 0.6, { x: this.props.isShowingLogin ? '-50%' : '-150%', autoAlpha: this.props.isShowingLogin ? 1 : 0 });

        return true;
    }
    componentDidMount = () => {
        this.showLoginHandle();
    }
    componentDidUpdate = () => {
        this.showLoginHandle();
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
                    this.props.fetchingToggle();
                    this.setState({
                        email: '',
                        password: '',
                        errors: ''
                    });
                    this.props.callback(data.token);
                }
            })

    }
    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value, errors: null })
    }

    render() {
        const { email, password, errors } = this.state;
        const { isFetching } = this.props;

        return (
            <Container innerRef={this.elementRef}>
                <Form style={{ opacity: isFetching ? 0.5 : 1, pointerEvents: isFetching ? 'none' : '' }}>
                    <Header>Login</Header>
                    <Input type='text' placeholder="email" name="email" value={email} onChange={this.onChange} />
                    <Input type='text' placeholder="password" name="password" value={password} onChange={this.onChange} />
                    <Submit type="button" onClick={this.login} value='Login' />
                    <Warning>{errors || '.'}</Warning>
                    <Change onClick={this.props.logRegToggle}>New around here? Click to register!</Change>
                </Form>
            </Container>
        );
    }
}

export default Login;
