import React, { Component } from 'react';
import axios from 'axios';
import { TweenMax } from 'gsap/TweenMax';
import { Container, Input, Form, Submit, Header, Warning, Change } from './LogReg';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingLogin: true,
            email: '',
            password1: '',
            password2: '',
            errors: '',
        }
        this.elementRef = React.createRef();
        this.d = null;
    }
    showLoginHandle = () => {
        if (this.props.isShowingLogin === this.state.isShowingLogin) return false;
        this.setState({ isShowingLogin: this.props.isShowingLogin });

        TweenMax.to(this.elementRef.current, 0.6, { x: !this.props.isShowingLogin ? '-50%' : '100%', autoAlpha: !this.props.isShowingLogin ? 1 : 0 });

        return true;
    }
    componentDidMount() {
        this.showLoginHandle();
    }
    componentDidUpdate() {
        this.showLoginHandle();
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

                    this.props.logRegToggle();
                    this.props.fetchingToggle();
                }
            })
    }
    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value, errors: null })
    }

    render() {

        const { email, password1, password2, errors } = this.state;
        const { isFetching } = this.props;

        return (
            <Container style={{ transform: 'translateX(100%)', opacity: 0 }} innerRef={this.elementRef}>
                <Form style={{ opacity: isFetching ? 0.5 : 1, pointerEvents: isFetching ? 'none' : '' }}>
                    <Header>Register</Header>
                    <Input type='text' placeholder="email" name="email" value={email} onChange={this.onChange} />
                    <Input type='text' placeholder="password" name="password1" value={password1} onChange={this.onChange} />
                    <Input type='text' placeholder="repeat password" name="password2" value={password2} onChange={this.onChange} />
                    <Submit type="button" onClick={this.register} value='Register' />
                    <Warning>{errors || '.'}</Warning>
                    <Change onClick={this.props.logRegToggle}>Already a member? Click to log in!</Change>
                </Form>
            </Container>
        );
    }
}

export default Register;
