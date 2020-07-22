import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware, compose } from 'redux';

import appReducer from './modules';

const rootReducer = (state, action) => appReducer(state, action);

function configureStore() {
  let composeFn = compose;

  if (__DEV__) composeFn = composeWithDevTools;

  const store = createStore(
    rootReducer,
    composeFn(applyMiddleware(thunk)),
  );

  return { store };
}

export default configureStore();
