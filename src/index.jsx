import React from 'react';
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
      <App />
    </Provider>
  </>
));

const load = () => render(<Main />, root);

load();
