import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';


export const SpriteBox = styled.div`
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    pointer-events: none;
`;

let inject = ``;
for (let i = 0; i < 24; i++) {
    inject += `${i * 4.015}% {transform: translateX(${i * -4.015}%)} `;
}

const movie = keyframes`
    ${inject}
`;

export const SpriteImg = styled.img`
    height: 100%;
    width: auto;
    position: absolute;
    left: 0;
    top: 0;
    animation: ${movie} 1s steps(1, start) infinite;
`;
