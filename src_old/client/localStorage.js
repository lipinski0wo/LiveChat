import jwtDecode from 'jwt-decode';

export const getUserAndToken = () => {
    const userToken = localStorage.getItem('user_token');

    if (!userToken) return false;

    const decoded = jwtDecode(userToken);

    if (decoded.exp < Date.now() / 1000) return false;

    return {
        user: decoded,
        token: userToken
    };
}

export const removeToken = () => {
    localStorage.removeItem('user_token');
    return true;
}

export const setToken = (token) => {
    localStorage.setItem('user_token', token);
}