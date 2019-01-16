import styled from 'styled-components';
import { TweenMax } from 'gsap/TweenMax';


export const Base = styled.div`  
    background-color: rgba(1,1,1,0.1);
    width: 100vw; 
    height: 100vh;
    overflow: hidden; 
    position: relative;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;


export function LogRegPanelAnimator(type) {
    if (this.state.isAuthorized === this.props.isAuthorized) return;
    this.setState({ isAuthorized: this.props.isAuthorized });

    let decision = this.props.isAuthorized;
    if (type === 'LogReg') decision = !decision;

    TweenMax.to(this.element.current, 0.3, { autoAlpha: decision ? 1 : 0 })
};

export function LoginRegisterAnimator(type) {
    if (this.state.isShowingLogin === this.props.isShowingLogin) return;
    this.setState({ isShowingLogin: this.props.isShowingLogin });

    let decision = this.props.isShowingLogin;
    if (type === 'Register') decision = !decision;

    let position;
    if (type === 'Register') {
        position = this.props.isShowingLogin ? '100%' : '0%';
    } else {
        position = this.props.isShowingLogin ? '0%' : '-100%';
    }

    TweenMax.to(this.ContainerElement.current, 0.3, { autoAlpha: decision ? 1 : 0, x: position })
};

export function LoginRegisterFetchingAnimator(type) {
    if (this.state.isFetching === this.props.isFetching) return;
    this.setState({ isFetching: this.props.isFetching });

    let decision = this.props.isFetching;
    TweenMax.to(this.FormElement.current, 0.3, { autoAlpha: decision ? 0.5 : 1 });
    TweenMax.to(this.SpriteElement.current, 0.3, { autoAlpha: decision ? 1 : 0 });
};

export function UserConversationAnimator(type) {
    if (this.state.conversationUser === null && this.props.conversationUser !== null) {
        this.setState({ conversationUser: this.props.conversationUser, conversationUserName: this.props.conversationUserName });
        this.fetchConversation(() => {
            TweenMax.to(this.conversationElement.current, 0.3, { autoAlpha: 1 });
        });
        TweenMax.to(this.noBoxVisibleElement.current, 0.3, { autoAlpha: 0 });
    } else if (this.state.conversationUser !== this.props.conversationUser) {
        TweenMax.to(this.conversationElement.current, 0.15, {
            autoAlpha: 0, onComplete: () => {
                this.setState({ conversationUser: this.props.conversationUser, conversationUserName: this.props.conversationUserName });
                this.fetchConversation(() => {
                    TweenMax.to(this.conversationElement.current, 0.15, { autoAlpha: 1 });
                })
            }
        });
    }
};
