import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import 'normalize.css';
import '../fonts/fonts.css';

// import GlobalStyles from './styles/GlobalStyles';
import App from './App';
import storeConfigs from './store';

const { store } = storeConfigs;

const root = document.getElementById('root');

const Main = hot(() => (
  <>
    {/* <GlobalStyles /> */}
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Route path="/:tab?/:subTab?" component={App} />
      </BrowserRouter>
    </Provider>
  </>
));

const load = () => render(<Main />, root);

load();
