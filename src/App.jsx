import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import AppHeader from './components/AppHeader';
import { selectLocale } from './modules/app/selectors';
import Individual from './pages/individual/Individual';
import Org from './pages/org/Org';
import User from './pages/user/User';
import FourOhFour from './pages/fourohfour/FourOhFour';
import materialTheme from './styles/materialTheme';
import messagesEn from '../locale/en.json';
import messagesEs from '../locale/es.json';

const messageMap = {
  en: messagesEn,
  es: messagesEs,
};

export default function App() {
  const theme = createMuiTheme(materialTheme);
  const locale = useSelector(selectLocale);

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
              display: 'flex',
              height: '100%',
              width: '100%',
              color: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              fontFamily: 'Franklin Gothic Medium',
            }}
          >
            <AppHeader />
            <Switch>
              <Route path="/individuals/:id">
                <Individual />
              </Route>
              <Route path="/users/:id">
                <User />
              </Route>
              <Route path="/orgs/:id">
                <Org />
              </Route>
              <Route path="/" exact>
                <div />
              </Route>
              <Route>
                <FourOhFour />
              </Route>
            </Switch>
          </main>
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
}
