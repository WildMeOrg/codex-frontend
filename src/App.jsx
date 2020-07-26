import React, { useEffect, useReducer } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import '@formatjs/intl-numberformat/polyfill';
import enPolyfill from '@formatjs/intl-numberformat/dist/locale-data/en';
import esPolyfill from '@formatjs/intl-numberformat/dist/locale-data/es';
import { selectLocale } from './modules/app/selectors';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';
import { AppContext, initialState } from './context';
import BigSwitch from './BigSwitch';

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
  if (type === 'SET_SITE_SETTINGS_NEEDS_FETCH') {
    return { ...state, siteSettingsNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_SCHEMA') {
    return { ...state, siteSettingsSchema: data };
  }
  if (type === 'SET_SITE_SETTINGS') {
    return { ...state, siteSettings: data };
  }
  console.warn('Action not recongized', action);
  return state;
}

export default function App() {
  const theme = createMuiTheme(materialTheme);
  const locale = useSelector(selectLocale);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={messageMap[locale]}
      >
        <AppContext.Provider value={{ state, dispatch }}>
          <BrowserRouter basename="/">
            <ScrollToTop />
            <BigSwitch />
          </BrowserRouter>
        </AppContext.Provider>
      </IntlProvider>
    </ThemeProvider>
  );
}
