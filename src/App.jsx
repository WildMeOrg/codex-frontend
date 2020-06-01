import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import '@formatjs/intl-numberformat/polyfill';
import enPolyfill from '@formatjs/intl-numberformat/dist/locale-data/en.json';
import esPolyfill from '@formatjs/intl-numberformat/dist/locale-data/es.json';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import { selectLocale } from './modules/app/selectors';
import Individual from './pages/individual/Individual';
import Sighting from './pages/sighting/Sighting';
import Org from './pages/org/Org';
import Orgs from './pages/org/Orgs';
import User from './pages/user/User';
import Users from './pages/user/Users';
import ReportSightings from './pages/report/ReportSightings';
import FourOhFour from './pages/fourohfour/FourOhFour';
import { selectSiteSettings } from './modules/site/selectors';
import SearchIndividuals from './pages/individual/SearchIndividuals';
import SearchSightings from './pages/sighting/SearchSightings';
import Administration from './pages/administration/Administration';
import SiteSetup from './pages/administration/SiteSetup';
import CreateAccount from './pages/auth/Create';
import Login from './pages/auth/Login';
import Welcome from './pages/auth/Welcome';
import Forgot from './pages/auth/Forgot';
import Logout from './pages/auth/Logout';
import RequestInvitation from './pages/auth/RequestInvitation';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';

// polyfill to enable formatting of a number using the unit prop
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData(enPolyfill);
  Intl.NumberFormat.__addLocaleData(esPolyfill);
}

const messageMap = {
  en: messagesEn,
  es: messagesEs,
};

export default function App() {
  const theme = createMuiTheme(materialTheme);
  const locale = useSelector(selectLocale);

  const siteSettings = useSelector(selectSiteSettings);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={messageMap[locale]}
      >
        <BrowserRouter basename="/">
          <main
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              minHeight: '100vh',
            }}
          >
            <AppHeader />
            {siteSettings.needsSetup ? (
              <SiteSetup />
            ) : (
              <Switch>
                <Route path="/individuals/:id">
                  <Individual />
                </Route>
                <Route path="/individuals">
                  <SearchIndividuals />
                </Route>
                <Route path="/sightings/:id">
                  <Sighting />
                </Route>
                <Route path="/sightings">
                  <SearchSightings />
                </Route>
                <Route path="/users/:id">
                  <User />
                </Route>
                <Route path="/users">
                  <Users />
                </Route>
                <Route path="/orgs/:id">
                  <Org />
                </Route>
                <Route path="/orgs">
                  <Orgs />
                </Route>
                <Route path="/report">
                  <ReportSightings />
                </Route>
                <Route path="/administration">
                  <Administration />
                </Route>
                <Route path="/forgot">
                  <Forgot />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/logout">
                  <Logout />
                </Route>
                <Route path="/request">
                  <RequestInvitation />
                </Route>
                <Route path="/create">
                  <CreateAccount />
                </Route>
                <Route path="/welcome">
                  <Welcome />
                </Route>
                <Route path="/" exact>
                  <div />
                </Route>
                <Route>
                  <FourOhFour />
                </Route>
              </Switch>
            )}
          </main>
          <Footer />
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
}
