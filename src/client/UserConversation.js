import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components';
import axios from 'axios';
import io from 'socket.io-client';

import { UserConversationAnimator } from './Base';
import { connection } from 'mongoose';



export class UserConversation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conversationUser: null,
            conversationUserName: null,
            users: null,
            _id: null,
            talk: [],
            socket: null,
            socketConnected: false,
            fetching: false
        };
        this.url = 'http://localhost:8080';

        this.noBoxVisibleElement = React.createRef();
        this.conversationElement = React.createRef();
        this.textareaElement = React.createRef();
    }
    componentDidUpdate() {
        UserConversationAnimator.call(this);
    }
    componentDidMount() {
        this.initSocket();
    }

    initSocket = () => {
        const socket = io(this.url, {
        });
        const that = this;
        this.setState({ socket });
        socket.on('connect', function () {
            that.setState({ socketConnected: true })
        });
    }

    fetchConversation = (callback) => {
        const { conversationUser, token } = this.props;
        const { socketConnected, socket } = this.state;

        axios
            .post('/api/getConversation', { friendId: conversationUser })
            .then(response => response.data)
            .then(data => {
                if (data.error === 'unauthorized') {
                    window.location.reload(true);
                }
                if (data.conversation) {
                    const { conversation } = data;
                    this.setState({ _id: conversation._id, users: conversation.users, talk: conversation.talk })
                    if (socketConnected) {
                        socket.emit('room', { token, roomId: conversation._id });
                        socket.on('incomming', (msg) => {
                            console.log(msg);
                            this.setState({ fetching: false, talk: [...this.state.talk, msg] });
                        });
                    }

                }
                callback();
            })
    }

    SendMessage = () => {
        if (!this.state.socketConnected) return;
        if (this.state.fetching) return;

        const val = this.textareaElement.current.value;
        if (val.length < 2) return;
        this.setState({ fetching: true });
        this.state.socket.emit('msg', { token: this.props.token, msg: val }, res => {
            if (res === 'token expired') window.location.reload(true);

            this.textareaElement.current.value = '';
        });

    }

    render() {
        const { conversationUserName, conversationUser, talk, socketConnected } = this.state;

        return (
            <Box>
                <NoBoxVisible innerRef={this.noBoxVisibleElement}>
                    Begin conversation by selecting a user.
                </NoBoxVisible>
                <Conversation innerRef={this.conversationElement}>
                    <Name>
                        {conversationUserName}
                    </Name>
                    <Scroller>
                        {talk.map((msg, ind) => msg._id === conversationUser ? <LeftMsg key={msg._id + ind}>{msg.text}</LeftMsg> : <RightMsg key={msg._id + ind}>{msg.text}</RightMsg>)}

                    </Scroller>
                    <SendMessage>

                        <Textarea innerRef={this.textareaElement} />
                        <Button style={{ pointerEvents: socketConnected ? null : 'none' }} onClick={this.SendMessage}> Send </Button>
                    </SendMessage>
                </Conversation>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    conversationUser: state.conversationUser,
    conversationUserName: state.conversationUserName,
    token: state.token
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UserConversation)

export const Box = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

`;

export const NoBoxVisible = styled.div`
    color: #888;
    position: absolute;
`;


export const Conversation = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    
    opacity: 0;
`;

export const LeftMsg = styled.div`
    width: 90%;
    min-height:20px;
    clear: both;
    float: left;
    color: #888;
    padding: 0 5px;
`;

export const RightMsg = styled(LeftMsg)`
    float: right;
    text-align: right;
`;

export const Scroller = styled.div`
    width: 100%;
    flex: 1;
    overflow-x:hidden;
    overflow-y:scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
        background: #888; 
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
`;

export const SendMessage = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 5px;
    background: #555;
`;

export const Textarea = styled.textarea`
    flex: 1;
    height: 50px;
    border: 1px solid #fff;
    outline: none;
    background: transparent;
    box-sizing: border-box;
    margin: 5px;
    margin-left: 10px;
    color: #fff;
    padding: 5px;
    ::-webkit-scrollbar {
        width: 10px;
        cursor: pointer;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
        background: #888; 
        cursor: pointer;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
`;

export const Button = styled.button`
    width: 100px;
    height: 30px;
    outline: none;
    background: transparent;
    color: #fff;
    box-sizing: border-box;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
`;

export const Name = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #555;
    user-select: none;
`;