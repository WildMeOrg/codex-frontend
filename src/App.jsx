import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { get } from 'lodash-es';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-numberformat/polyfill';
import enPolyfill from '@formatjs/intl-numberformat/dist/locale-data/en';
import esPolyfill from '@formatjs/intl-numberformat/dist/locale-data/es';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import errorTypes from './constants/errorTypes';
import useSiteSettings from './models/site/useSiteSettings';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';
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

function AppWithQueryClient() {
  const locale = 'en';
  const { data, error } = useSiteSettings();

  const adminUserInitialized = get(data, 'site.adminUserInitialized');
  const primaryColor = get(data, ['site.look.themeColor', 'value']);

  if (error) {
    document.title = 'Server Unavailable';
    return <SadScreen variant={errorTypes.serverError} />;
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
            <FrontDesk adminUserInitialized={adminUserInitialized} />
          </ErrorBoundary>
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithQueryClient />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

// react-hot-loader automatically ensures that it is not executed in production
// and has a minimal footprint.
export default hot(() => <App />);
