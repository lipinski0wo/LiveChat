import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components';

import { LogRegPanelAnimator } from './Base';
import Login from './Login';
import Register from './Register';

export class LogReg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthorized: false
        };
        this.element = React.createRef();
    }

    componentDidMount() {
        LogRegPanelAnimator.call(this, 'LogReg');
    }
    componentDidUpdate() {
        LogRegPanelAnimator.call(this, 'LogReg');
    }

    render() {
        return (
            <LogRegBox innerRef={this.element}>
                <Login />
                <Register />
            </LogRegBox>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthorized: state.isAuthorized
})

const mapDispatchToProps = dispatch => ({
    toggleAuthorized: () => dispatch({ type: 'TOGGLE_AUTHORIZED', payload: true })
});

export default connect(mapStateToProps, mapDispatchToProps)(LogReg)

export function onChange({ target }) {
    this.setState({ [target.name]: target.value, errors: null })
};




export const LogRegBox = styled.div`
    width: 220px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    box-sizing:border-box;
    box-shadow: 2px 2px 62px -9px rgba(0,0,0,0.75);
    position: absolute;
    top: 0;
    left: 0;
`;


export const Input = styled.input`
    width: 90%;
    height: 25px;
    outline: none;
    border: 1px solid rgba(0,0,0,0.25);
    color: rgba(0,0,0,0.75);
    margin: 5px 0;
    padding-left: 4px;
`;

export const Submit = styled.input`
    width: 90%;
    height: 25px;
    outline: none;
    border: 1px solid #FF3B30;
    color: rgba(0,0,0,0.75);
    text-align: center;
    margin: 5px 0;
    cursor: pointer;
    background-color: #fff;
    &:hover {
        color: rgba(0,0,0,1);
    }
`;

export const Form = styled.form`
    width: 100%;
    height: 100%;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const Header = styled.h3`
    color: rgba(0,0,0,0.75);
    font-size: 20px;
    text-align:center;
    width: 100%;
    margin-top: 0px;
`;

export const Warning = styled.span`
    color: rgba(255,0,0,0.75);
    font-size: 12px;
    text-align:center;
    width: 100%;
    margin-top: 5px;
`;


export const Change = styled.span`
    color: rgba(0,0,0,0.45);
    font-size: 12px;
    text-align:center;
    width: 100%;
    margin-top: 5px;
    cursor: pointer;
    user-select: none;
    &:hover {
        color: rgba(0,0,0,1);
    }
`;