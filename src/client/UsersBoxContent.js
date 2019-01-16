import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios';
import styled from 'styled-components';

import spriteSrc from '../../public/sprite.png';
import SingleUser from './SingleUser';

import { SpriteBox, SpriteImg } from './Sprite';
import { TweenMax } from 'gsap/TweenMax';

const Scroller = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    opacity:0;
    overflow-x:hidden;
    overflow-y:scroll;
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

export class UsersBoxContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null
        };
        this.spriteElement = React.createRef();
        this.scrollerElement = React.createRef();

    }
    fetchUsers = (evt) => {
        if (!this.props.token) return;

        axios.defaults.headers.common['authorization'] = 'Bearer ' + this.props.token;

        axios
            .post('/api/getAllUsers')
            .then(response => response.data)
            .then(data => {
                this.setState({ users: data.users });

                TweenMax.to(this.spriteElement.current, 0.3, { autoAlpha: 0 });
                TweenMax.to(this.scrollerElement.current, 0.3, { autoAlpha: 1 });

            });
    }

    componentDidMount() {
        this.fetchUsers();
    }
    render() {
        const { users = [] } = this.state;

        return (
            <React.Fragment>
                <SpriteBox innerRef={this.spriteElement}>
                    <SpriteImg src={spriteSrc} />
                </SpriteBox>
                <Scroller innerRef={this.scrollerElement}>
                    {users && users.map(user => (<SingleUser key={user._id} name={user.email} _id={user._id} />))}
                </Scroller>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.token
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UsersBoxContent)
