import { getUserAndToken } from './localStorage';

let defaultState = {
    user: null,
    isAuthorized: false,
    token: null,
    canAnimate: true,
    isFetching: false,
    isShowingLogin: true,
    conversationUser: null,
    conversationUserName: null
};

defaultState = { ...defaultState, ...getUserAndToken() };



export default (state = defaultState, { type, payload }) => {
    switch (type) {
        case 'LOGIN_USER':
            return {
                ...state,
                isAuthorized: true,
                user: payload.user,
                token: payload.token
            };
        case 'LOGIN_REGISTER_TOGGLE':
            return {
                ...state,
                isShowingLogin: payload === 'login' ? false : true
            };
        case 'FETCHING_TOGGLE':
            return {
                ...state,
                isFetching: !state.isFetching
            };
        case 'OPEN_CONVERSATION':

            return {
                ...state,
                conversationUser: payload._id,
                conversationUserName: payload.name
            };

        default:
            return state;
    }
};