import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

export default function configureStore(initialState) {

    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(thunk))
    );

    if (module.hot) {
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}