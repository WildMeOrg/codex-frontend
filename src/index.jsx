import 'react-hot-loader/root'; // This needs to be imported before React.
import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import { get } from 'lodash-es';

import 'normalize.css';
import '../fonts/fonts.css';
import './styles/globalStyles.css';

import pjson from '../package.json';
import App from './App';

fetch(`${__houston_url__}/api/v1/site-settings/main/block`)
  .then(response => response.json())
  .then(result => {
    const sentryDsn = get(result, [
      'response',
      'configuration',
      'sentryDsn',
      'value',
    ]);
    if (sentryDsn) {
      Sentry.init({
        dsn: sentryDsn,
        release: `frontend@${get(pjson, 'release')}`,
      });
    }
  })
  .finally(() => {
    const root = document.getElementById('root');

    const load = () => render(<App />, root);

    load();
  });
