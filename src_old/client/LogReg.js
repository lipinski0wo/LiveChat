import styled from 'styled-components';

export default styled.div`
    width: 500px;
    height: 300px;
    position: relative;
`;

export const Container = styled.div`
    width: 220px;
    height: 100%;
    box-sizing:border-box;
    box-shadow: 2px 2px 62px -9px rgba(0,0,0,0.75);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
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