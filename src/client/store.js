import { createStore, compose, applyMiddleware } from 'redux';

import reducers from './reducers';

const middleware = [];

const redux_dev = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(reducers, compose(applyMiddleware(...middleware), redux_dev));

export default store;