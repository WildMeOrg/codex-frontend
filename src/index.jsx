import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import * as Sentry from '@sentry/react';
import { get } from 'lodash-es';

import 'normalize.css';
import '../fonts/fonts.css';
import './styles/globalStyles.css';

import { sentryDsn } from './constants/apiKeys';
import pjson from '../package.json';
import App from './App';
import storeConfigs from './store';

if (!__DEV__) {
  Sentry.init({
    dsn: sentryDsn,
    release: `frontend@${get(pjson, 'release')}`,
  });
}

const { store } = storeConfigs;

const root = document.getElementById('root');

const Main = hot(() => (
  <Provider store={store}>
    <App />
  </Provider>
));

const load = () => render(<Main />, root);

load();
