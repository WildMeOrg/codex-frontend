import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { TransitionGroup } from 'react-transition-group';
import UnauthenticatedAppHeader from './components/UnauthenticatedAppHeader';
import ReportBasic from './pages/report/ReportBasic';
import ReportBulk from './pages/report/ReportBulk';
import ReportSplash from './pages/report/ReportSplash';
import Login from './pages/auth/Login';
import RequestInvitation from './pages/auth/RequestInvitation';
import Forgot from './pages/auth/Forgot';
import Create from './pages/auth/Create';
import Iceland from './pages/match/iceland/Iceland';
import FlagsOnly from './pages/match/iceland/FlagsOnly';
import Splash from './pages/splash/Splash';
import Footer from './components/Footer';
import { defaultCrossfadeDuration } from './constants/defaults';

export default function AuthenticatedSwitch() {
  const { pathname } = useLocation();
  const home = pathname === '/';

  return (
    <main>
      <UnauthenticatedAppHeader
        topTransparency={home}
        siteNameScrolls={home}
      />
      <Route
        render={({ location }) => (
          <TransitionGroup appear>
            <Fade
              key={location.key}
              timeout={defaultCrossfadeDuration}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    minHeight: 'calc(100vh - 64px)',
                    boxSizing: 'border-box',
                  }}
                >
                  <Switch location={location}>
                    <Route path="/report/bulk">
                      <ReportBulk />
                    </Route>
                    <Route path="/report/one">
                      <ReportBasic variant="one" />
                    </Route>
                    <Route path="/report/several">
                      <ReportBasic variant="several" />
                    </Route>
                    <Route path="/report">
                      <ReportSplash />
                    </Route>
                    <Route path="/forgot">
                      <Forgot />
                    </Route>
                    <Route path="/request">
                      <RequestInvitation />
                    </Route>
                    <Route path="/create">
                      <Create />
                    </Route>
                    <Route path="/login">
                      <Login redirect="/" />
                    </Route>
                    <Route path="/iceland/flags">
                      <FlagsOnly />
                    </Route>
                    <Route path="/iceland">
                      <Iceland />
                    </Route>
                    <Route path="/" exact>
                      <Splash />
                    </Route>
                    <Route>
                      <Login showBanner redirect={pathname} />
                    </Route>
                  </Switch>
                </div>
                <Footer />
              </div>
            </Fade>
          </TransitionGroup>
        )}
      />
    </main>
  );
}
