import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import styled from 'styled-components';

const Element = styled.div`
    width: 100%;
    height: 40px;
    background: #f1f1f1;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    font-weight: 800;
    cursor: pointer;
    user-select: none;
`;

export class SingleUser extends Component {


    render() {
        const { openConversation, name, _id } = this.props;
        return (
            <Element onClick={openConversation.bind(this, _id, name)}>
                {name}
            </Element>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({
    openConversation: (_id, name) => dispatch({ type: 'OPEN_CONVERSATION', payload: { _id, name } })
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleUser)
