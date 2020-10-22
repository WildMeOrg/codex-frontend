import React, { useEffect, useReducer } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { get } from 'lodash-es';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import '@formatjs/intl-numberformat/polyfill';
import enPolyfill from '@formatjs/intl-numberformat/dist/locale-data/en';
import esPolyfill from '@formatjs/intl-numberformat/dist/locale-data/es';

import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import useSiteSettings from './models/site/useSiteSettings';
import { selectLocale } from './modules/app/selectors';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';
import { AppContext, initialState } from './context';
import FrontDesk from './FrontDesk';
import ServerErrorPage from './components/ServerErrorPage';

// polyfill to enable formatting of a number using the unit prop
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData(enPolyfill);
  Intl.NumberFormat.__addLocaleData(esPolyfill);
}

const messageMap = {
  en: messagesEn,
  es: messagesEs,
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return null;
}

function reducer(state, action) {
  const { type, data } = action;
  if (type === 'SET_SIGHTINGS_NEEDS_FETCH') {
    return { ...state, sightingsNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_NEEDS_FETCH') {
    return { ...state, siteSettingsNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_SCHEMA') {
    return { ...state, siteSettingsSchema: data };
  }
  if (type === 'SET_SITE_SETTINGS') {
    return { ...state, siteSettings: data };
  }
  if (type === 'SET_ME') {
    return { ...state, me: data };
  }
  console.warn('Action not recognized', action);
  return state;
}

function ContextualizedApp() {
  const locale = useSelector(selectLocale);
  const { data, error } = useSiteSettings();

  const primaryColor = get(data, ['site.look.themeColor', 'value']);

  if (error)
    return (
      <ServerErrorPage
        title="Server unavailable"
        details="The server could not be reached. Unfortunately, normal site functionality is currently unavailable. Check back at a later date."
      />
    );
  if (!primaryColor) return null;
  const theme = createMuiTheme(materialTheme(primaryColor));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={messageMap[locale]}
      >
        <BrowserRouter basename="/">
          <ScrollToTop />
          <FrontDesk />
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ContextualizedApp />
    </AppContext.Provider>
  );
}
