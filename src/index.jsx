import 'react-hot-loader/root'; // This needs to be imported before React.
import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import { get } from 'lodash-es';

import 'normalize.css';
import '../fonts/fonts.css';
import './styles/globalStyles.css';

import { sentryDsn } from './constants/apiKeys';
import pjson from '../package.json';
import App from './App';

if (!__DEV__) {
  Sentry.init({
    dsn: sentryDsn,
    release: `frontend@${get(pjson, 'release')}`,
  });
}

const root = document.getElementById('root');

const load = () => render(<App />, root);

load();
