import jwtDecode from 'jwt-decode';

export const getUserAndToken = () => {
    const userToken = localStorage.getItem('user_token');

    if (!userToken) return {};

    const decoded = jwtDecode(userToken);

    if (decoded.exp < Date.now() / 1000) return {};

    return {
        user: decoded,
        token: userToken,
        isAuthorized: true
    };
}

export const setToken = (token) => {
    localStorage.setItem('user_token', token);
}