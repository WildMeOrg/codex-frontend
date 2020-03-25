import thunk from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware, compose } from 'redux';

import appReducer from './modules';

const rootReducer = (state, action) => appReducer(state, action);

function configureStore() {
  const middlewares = [thunk, reduxPackMiddleware];

  let composeFn = compose;

  if (__DEV__) {
    const logger = createLogger({
      collapsed: true,
    });
    middlewares.push(logger);
    composeFn = composeWithDevTools;
  }

  const store = createStore(
    rootReducer,
    composeFn(applyMiddleware(...middlewares)),
  );

  return { store };
}

export default configureStore();
