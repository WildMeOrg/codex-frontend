import React, { useEffect, useReducer } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { get } from 'lodash-es';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-numberformat/polyfill';
import enPolyfill from '@formatjs/intl-numberformat/dist/locale-data/en';
import esPolyfill from '@formatjs/intl-numberformat/dist/locale-data/es';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import useSiteSettings from './models/site/useSiteSettings';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';
import { AppContext, initialState } from './context';
import FrontDesk from './FrontDesk';
import SadScreen from './components/SadScreen';
import ErrorBoundary from './ErrorBoundary';

// polyfill to enable formatting of a number using the unit prop
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData(enPolyfill);
  Intl.NumberFormat.__addLocaleData(esPolyfill);
}

const messageMap = {
  en: messagesEn,
  es: messagesEs,
};

const queryClient = new QueryClient();

const ScrollToTop = function() {
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return null;
};

function reducer(state, action) {
  const { type, data } = action;
  if (type === 'SET_SIGHTINGS_NEEDS_FETCH') {
    return { ...state, sightingsNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_NEEDS_FETCH') {
    return { ...state, siteSettingsNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_SCHEMA_NEEDS_FETCH') {
    return { ...state, siteSettingsSchemaNeedsFetch: data };
  }
  if (type === 'SET_SITE_SETTINGS_SCHEMA') {
    return { ...state, siteSettingsSchema: data };
  }
  if (type === 'SET_SITE_SETTINGS_VERSION') {
    return { ...state, siteSettingsVersion: data };
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

const ContextualizedApp = function() {
  const locale = 'en';
  const { data, error } = useSiteSettings();

  const adminUserInitialized = get(data, 'site.adminUserInitialized');
  const primaryColor = get(data, ['site.look.themeColor', 'value']);

  if (error) {
    document.title = 'Server Unavailable';
    return <SadScreen variant="serverError" />;
  }
  if (!primaryColor) return null;
  const theme = createTheme(materialTheme(primaryColor));

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
            <ErrorBoundary>
              <FrontDesk
                adminUserInitialized={adminUserInitialized}
              />
            </ErrorBoundary>
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch }}>
        <ContextualizedApp />
        <ReactQueryDevtools initialIsOpen={false} />
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
