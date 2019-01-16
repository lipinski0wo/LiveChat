import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components';

import { LogRegPanelAnimator } from './Base';

import UsersBoxContent from './UsersBoxContent';
import UserConversation from './UserConversation';


export class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthorized: true,
            socket: null
        };
        this.element = React.createRef();

    }

    componentDidMount() {
        if (!this.props.isAuthorized) return;
        LogRegPanelAnimator.call(this, 'Panel');

    }
    componentDidUpdate() {
        if (!this.props.isAuthorized) return;
        LogRegPanelAnimator.call(this, 'Panel');
    }

    render() {
        if (!this.props.isAuthorized) return null;

        return (
            <PanelBox innerRef={this.element} >
                <Container>
                    <UsersBox>
                        <UsersBoxContent />
                    </UsersBox>
                    <ConversationBox>
                        <UserConversation />
                    </ConversationBox>
                </Container>
            </PanelBox>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthorized: state.isAuthorized
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Panel)


export const PanelBox = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    background:#fff;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Container = styled.div`
    width: 700px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ConversationBox = styled.div`
    width: 450px;
    height: 100%;
    background: #f1f1f1;     
    position: relative;
`;
export const UsersBox = styled.div`
    width: 250px;
    height: 100%;
    position: relative;
`;